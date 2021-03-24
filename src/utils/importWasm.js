const fs = require("fs-extra");
const path = require("path");
const getImportNamespace = require("./getImportNamespace");

async function importWasm(
  fileName,
  polyFill,
  settings = { memoryMin: 2, memoryMax: 16384 * 2 }
) {
  // basic vars
  let moduleName = path.join(process.cwd(), fileName + ".wasm");
  let module;

  // compile the module
  if (WebAssembly.compileStreaming) {
    module = await WebAssembly.compileStreaming(
      fs.createReadStream(moduleName)
    );
  } else {
    const buffer = await fs.readFile(moduleName);
    module = await WebAssembly.compile(buffer);
  }

  // initialize memory
  let memory = new WebAssembly.Memory({
    initial: settings.memoryMin,
    maximum: settings.memoryMax,
  });
  // assign an empty environment and the initialized memory to imported module
  let moduleImports = { env: {}, js: { mem: memory } };
  // retrieve namespace from downloaded WASM module; for example, wasi_snapshot_preview1
  const nspace = getImportNamespace(module);
  // and assign polyfill to namespace
  moduleImports[nspace] = polyFill;

  // instantiate
  const instance = await WebAssembly.instantiate(module, moduleImports);
  polyFill.setModuleInstance(instance);

  // run start
  instance.exports._start();

  /* set the instance to the scailable object */
  return instance;
}
module.exports = importWasm;
