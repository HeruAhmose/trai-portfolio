const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

const cdpEndpoint = "http://127.0.0.1:9222";
const allowedRoots = new Map([
  ["http://127.0.0.1:4173", "http://127.0.0.1:4173/trai-portfolio/"],
  ["https://heruahmose.github.io", "https://heruahmose.github.io/trai-portfolio/"],
]);

function allowedTarget(candidate) {
  if (candidate?.type !== "page" || !candidate.webSocketDebuggerUrl) return null;
  try {
    const url = new URL(candidate.url);
    const root = allowedRoots.get(url.origin);
    if (!root) return null;
    const rootUrl = new URL(root);
    if (!url.pathname.startsWith(rootUrl.pathname)) return null;
    return { candidate, root };
  } catch {
    return null;
  }
}

async function main() {
  let selected;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const targets = await fetch(`${cdpEndpoint}/json`).then(response => {
      if (!response.ok) throw new Error(`CDP target request failed: ${response.status}`);
      return response.json();
    });
    selected = targets.map(allowedTarget).find(Boolean);
    if (selected) break;
    await sleep(250);
  }

  if (!selected) throw new Error("Allowlisted TRAI browser target not found for reset");

  const socket = new WebSocket(selected.candidate.webSocketDebuggerUrl);
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    message.error
      ? waiter.reject(new Error(JSON.stringify(message.error)))
      : waiter.resolve(message.result);
  });

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  const send = (method, params = {}) => {
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  };

  await send("Page.enable");
  const navigation = await send("Page.navigate", { url: selected.root });
  if (navigation?.errorText) throw new Error(`Browser reset failed: ${navigation.errorText}`);

  await sleep(500);
  socket.close();
  console.log(`AUDIT_BROWSER_RESET=PASS ${selected.root}`);
}

await main();
