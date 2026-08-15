const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const source = path.join(__dirname, "public", "images-original");
const destination = path.join(__dirname, "public", "images");

async function convert(dir, relative = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const input = path.join(dir, entry.name);
    const rel = path.join(relative, entry.name);

    if (entry.isDirectory()) {
      await convert(input, rel);
      continue;
    }

    if (!/\.(png|jpe?g)$/i.test(entry.name)) continue;

    const outputName = entry.name.replace(/\.(png|jpe?g)$/i, ".webp");
    const output = path.join(destination, relative, outputName);

    fs.mkdirSync(path.dirname(output), { recursive: true });

    await sharp(input)
      .webp({ quality: 80 })
      .toFile(output);

    console.log("Converti :", rel);
  }
}

convert(source).then(() => {
  console.log("\n? Toutes les images ont été converties en WebP.");
}).catch(console.error);
