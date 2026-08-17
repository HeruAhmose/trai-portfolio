(function () {
  "use strict";
  if (window.__TRAI_DEV_OBSERVER__) return;
  var ENDPOINT = "/__trai_dev__/telemetry";
  var MAX = 100;
  var store = { console: [], network: [], ui: [] };
  var sensitive =
    /password|passcode|token|secret|authorization|cookie|session|api.?key|credential/i;

  function safeString(value) {
    var text = String(value == null ? "" : value);
    return text.length > 500 ? text.slice(0, 500) + "…" : text;
  }
  function sanitize(value, depth) {
    if (depth > 4) return "[max-depth]";
    if (
      value == null ||
      typeof value === "boolean" ||
      typeof value === "number"
    )
      return value;
    if (typeof value === "string") return safeString(value);
    if (value instanceof Error)
      return { name: value.name, message: safeString(value.message) };
    if (Array.isArray(value))
      return value.slice(0, 50).map(function (item) {
        return sanitize(item, depth + 1);
      });
    if (typeof value === "object") {
      var out = {};
      Object.keys(value)
        .slice(0, 50)
        .forEach(function (key) {
          out[key] = sensitive.test(key)
            ? "[redacted]"
            : sanitize(value[key], depth + 1);
        });
      return out;
    }
    return safeString(value);
  }
  function push(bucket, entry) {
    store[bucket].push(entry);
    if (store[bucket].length > MAX)
      store[bucket].splice(0, store[bucket].length - MAX);
  }

  ["log", "info", "warn", "error", "debug"].forEach(function (level) {
    var original = console[level];
    if (typeof original !== "function") return;
    console[level] = function () {
      try {
        push("console", {
          at: Date.now(),
          level: level,
          args: Array.prototype.slice.call(arguments).map(function (arg) {
            return sanitize(arg, 0);
          }),
        });
      } catch (_) {}
      return original.apply(console, arguments);
    };
  });

  var originalFetch = window.fetch;
  if (typeof originalFetch === "function") {
    window.fetch = async function (input, init) {
      var started = performance.now();
      var method = (init && init.method) || (input && input.method) || "GET";
      var url;
      try {
        url = new URL(
          typeof input === "string" ? input : input.url,
          location.href
        );
      } catch (_) {
        url = null;
      }
      try {
        var response = await originalFetch.apply(this, arguments);
        if (url && url.pathname !== ENDPOINT)
          push("network", {
            at: Date.now(),
            method: method,
            path: url.pathname,
            status: response.status,
            durationMs: Math.round(performance.now() - started),
          });
        return response;
      } catch (error) {
        if (url && url.pathname !== ENDPOINT)
          push("network", {
            at: Date.now(),
            method: method,
            path: url.pathname,
            error: safeString(error && error.message),
            durationMs: Math.round(performance.now() - started),
          });
        throw error;
      }
    };
  }

  function ignored(target) {
    return (
      target instanceof Element &&
      !!target.closest(
        '.trai-no-record,[data-trai-observe="off"],[data-private]'
      )
    );
  }
  document.addEventListener(
    "click",
    function (event) {
      var target = event.target;
      if (!(target instanceof Element) || ignored(target)) return;
      push("ui", {
        at: Date.now(),
        kind: "click",
        tag: target.tagName.toLowerCase(),
        role: target.getAttribute("role"),
        label: safeString(target.getAttribute("aria-label") || ""),
      });
    },
    true
  );
  document.addEventListener(
    "input",
    function (event) {
      var target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) ||
        ignored(target)
      )
        return;
      push("ui", {
        at: Date.now(),
        kind: "input",
        tag: target.tagName.toLowerCase(),
        type: target.getAttribute("type") || null,
        valueLength: String(target.value || "").length,
      });
    },
    true
  );

  async function flush() {
    if (!store.console.length && !store.network.length && !store.ui.length)
      return;
    var payload = {
      console: store.console.splice(0),
      network: store.network.splice(0),
      ui: store.ui.splice(0),
    };
    try {
      await originalFetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (_) {}
  }
  setInterval(flush, 3000);
  window.addEventListener("pagehide", flush);
  window.__TRAI_DEV_OBSERVER__ = { flush: flush };
})();
