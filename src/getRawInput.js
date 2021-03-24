const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

async function getRawInput() {
  const imagePath = path.join(process.cwd(), "t-100.png");
  const image = await fs.readFile(imagePath);
  // shape = torch.randn(1,3,100,100)
  // https://pytorch.org/docs/stable/generated/torch.randn.html

  const metadata = await sharp(image).metadata();

  const imageVec = await new Promise(async (resolve, reject) => {
    sharp(image).toBuffer(async (error, data) => {
      if (error) return reject(error);

      const r = [];
      for (let i = 0; i < data.length; i += metadata.channels) {
        r.push(data.readUInt8(i) / 255);
      }

      const g = [];
      for (let i = 1; i < data.length; i += metadata.channels) {
        g.push(data.readUInt8(i) / 255);
      }

      const b = [];
      for (let i = 2; i < data.length; i += metadata.channels) {
        b.push(data.readUInt8(i) / 255);
      }

      resolve([[r, g, b]]);
    });
  });
  return imageVec;
}

module.exports = getRawInput;
