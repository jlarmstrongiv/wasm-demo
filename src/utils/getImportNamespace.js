const getImportNamespace = function (module) {
  let namespace = null;
  for (let imp of WebAssembly.Module.imports(module)) {
    // We only check for the functions
    if (imp.kind !== "function") {
      continue;
    }
    // We allow functions in other namespaces other than wasi
    if (!imp.module.startsWith("wasi_")) {
      continue;
    }
    if (!namespace) {
      namespace = imp.module;
    } else {
      if (namespace !== imp.module) {
        throw new Error("Multiple namespaces detected.");
      }
    }
  }
  return namespace;
};
module.exports = getImportNamespace;
