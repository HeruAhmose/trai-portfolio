import { readFileSync } from "node:fs";

const contracts = [
  {
    file: "client/src/pages/MelaNation.tsx",
    forbidden: ["/media/tamerian/", "DNAHelix"],
    required: ["VesselNetworkVisual", "04 · Vessels · Mobility Sovereignty", "#1f66ad"],
  },
  {
    file: "client/src/pages/MeLaNiNa.tsx",
    forbidden: ["DNAHelix", "/media/tamerian/"],
    required: ["IdentityTextileVisual", "05 · Skin · Identity Sovereignty", "#d98758"],
  },
];

let failures = 0;

for (const contract of contracts) {
  const source = readFileSync(contract.file, "utf8");

  for (const token of contract.forbidden) {
    if (source.includes(token)) {
      console.error(`VISUAL_CONTRACT_FAIL ${contract.file}: forbidden ${JSON.stringify(token)}`);
      failures += 1;
    }
  }

  for (const token of contract.required) {
    if (!source.includes(token)) {
      console.error(`VISUAL_CONTRACT_FAIL ${contract.file}: missing ${JSON.stringify(token)}`);
      failures += 1;
    }
  }
}

if (failures > 0) {
  process.exit(1);
}

console.log("ORGANISM_VISUAL_CONTRACT=PASS");
