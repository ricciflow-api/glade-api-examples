import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} failed with status ${result.status}`);
  }
}

const shellExamples = [
  "examples/curl/quickstart.sh",
  "examples/curl/search-products.sh",
  "examples/curl/graphql-product.sh",
];
for (const file of shellExamples) run("bash", ["-n", file]);

const pythonExamples = [
  "examples/python/glade_client.py",
  "examples/python/01_product.py",
  "examples/python/02_search.py",
];
run("python3", [
  "-c",
  "import ast,sys; [ast.parse(open(p, encoding='utf-8').read(), filename=p) for p in sys.argv[1:]]",
  ...pythonExamples,
]);

const nodeExamples = [
  "examples/node/glade-client.mjs",
  "examples/node/01-product.mjs",
  "examples/node/02-search.mjs",
  "examples/node/03-graphql.mjs",
  "scripts/verify-live.mjs",
];
for (const file of nodeExamples) run(process.execPath, ["--check", file]);

run("go", ["test", "./..."], {
  cwd: path.join(root, "examples/go"),
  env: {
    ...process.env,
    GOCACHE: path.join(process.env.TMPDIR || "/tmp", "glade-api-examples-go-cache"),
  },
});

const runnableExamples = [...shellExamples, ...pythonExamples, ...nodeExamples.slice(0, 4), "examples/go/main.go"];
for (const file of runnableExamples) {
  const source = readFileSync(path.join(root, file), "utf8");
  assert.doesNotMatch(source, /glade_live_[A-Za-z0-9_-]{12,}/, `${file} contains a key-shaped literal`);
}

const credentialReaders = [
  ...shellExamples,
  "examples/python/glade_client.py",
  "examples/node/glade-client.mjs",
  "examples/go/main.go",
];
for (const file of credentialReaders) {
  const source = readFileSync(path.join(root, file), "utf8");
  assert.match(source, /GLADE_API_KEY/, `${file} must read GLADE_API_KEY`);
}

console.log(`Validated ${runnableExamples.length} runnable examples.`);
