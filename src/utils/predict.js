const predict = function (cf, bArray) {
  let inputLength = bArray.length; //byteLength;

  let p_input = cf.exports.malloc_buffer(inputLength);

  // WebAssembly allows an instance's memory to grow during execution.
  // Calling malloc from JavaScript triggers a resize, invalidating wasmMemory.
  // Any attempt to read or write it will result an error, if it is not reassigned.
  let wasmMemory = new Uint8Array(cf.exports.memory.buffer);
  wasmMemory.set(bArray, p_input);

  // run pred() function
  cf.exports.pred();

  // get output:
  let p_output = cf.exports.get_out_loc();
  cf.exports.free_buffer();
  let outputLen = cf.exports.get_out_len();
  wasmMemory = new Uint8Array(cf.exports.memory.buffer);
  let uint8array = wasmMemory.slice(p_output, p_output + outputLen);
  let result = new TextDecoder().decode(uint8array);

  // and free buffers
  cf.exports.free_buffer();

  return result;
};
module.exports = predict;
