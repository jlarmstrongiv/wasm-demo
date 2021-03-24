const convertLocalInput = function (input, type) {
  let bArr; // input is byteArray
  let bArrBase;

  // switch based on type
  switch (type) {
    case "string": // input is string
      input = '{"input": ' + input + "}";
      bArrBase = new TextEncoder().encode(input);
      bArr = new Int8Array(bArrBase.length + 1);
      bArr.set(bArrBase);
      break;
    case "numVec": // input is a numeric vector
      input = '{"input": [' + JSON.stringify(input) + "]}";
      bArrBase = new TextEncoder().encode(input);
      bArr = new Int8Array(bArrBase.length + 1);
      bArr.set(bArrBase);
      break;
    case "exact": // whatever the user provides
      bArrBase = new TextEncoder().encode(input);
      bArr = new Int8Array(bArrBase.length + 1);
      bArr.set(bArrBase);
      break;

    default:
      // Not yet implemented / unkown type:
      throw new Error(
        "Unable to find the specified inputType / type not yet implemented."
      );
  }
  return bArr;
};
module.exports = convertLocalInput;
