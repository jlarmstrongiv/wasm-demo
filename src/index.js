const fs = require("fs-extra");
const path = require("path");

const runLocal = require("./utils/runLocal");
const convertLocalInput = require("./utils/convertLocalInput");
const getRawInput = require("./getRawInput");

async function start() {
  const rawInput = await getRawInput();
  return new Promise(async (resolve, reject) => {
    let input; // input to the task
    let output; // task result

    try {
      // Error in WASI:Parser failed
      input = convertLocalInput(rawInput, "numVec"); // ("string", "numVec", "exact", ...) (OPTIONAL, default string)

      const base64string = Buffer.from(
        await fs.readFile(path.join(process.cwd(), "t-100.png"))
      ).toString("base64");

      // Error in WASI:Parser failed
      input =
        '{"input": "' +
        base64string +
        '", "type":"image", "width":100, ' +
        '"height":100, "channels":3 }';
    } catch (err) {
      return reject(err);
    }

    await runLocal(input, "sclbl");
  });
}

start();
