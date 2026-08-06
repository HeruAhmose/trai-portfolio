import {
  copyFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const projectRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(
  projectRoot,
  "dist",
  "public",
);

const indexPath = path.join(outputDirectory, "index.html");
const fallbackPath = path.join(outputDirectory, "404.html");
const noJekyllPath = path.join(outputDirectory, ".nojekyll");

if (!existsSync(indexPath)) {
  throw new Error(
    `GitHub Pages entry file was not found: ${indexPath}`,
  );
}

const indexHtml = readFileSync(indexPath, "utf8");
const expectedBasePath =
  process.env.VITE_BASE_PATH?.trim();

if (
  expectedBasePath &&
  expectedBasePath !== "/" &&
  !indexHtml.includes(expectedBasePath)
) {
  throw new Error(
    `Built HTML does not contain the expected base path: ${expectedBasePath}`,
  );
}

copyFileSync(indexPath, fallbackPath);
writeFileSync(noJekyllPath, "", "utf8");

console.log(
  "GitHub Pages routing fallback and .nojekyll prepared.",
);