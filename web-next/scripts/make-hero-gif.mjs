import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import GIFEncoder from "gifencoder";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const hero = path.join(root, "public", "hero");
const scenic = path.join(hero, "scenic");
const outPath = path.join(root, "..", "design-mockups", "salam-hero-scenic.gif");

const WIDTH = 1280;
const HEIGHT = 720;
const FRAMES = 5;
const DELAY_MS = 200;

// Multiple regions of Pakistan — scenic, clear, no solo portraits
const shots = [
  path.join(hero, "hunza-8.jpg"), // Gilgit-Baltistan autumn
  path.join(scenic, "reg-swat-kandol.jpg"), // Khyber Pakhtunkhwa / north lakes
  path.join(scenic, "pk-attabad-lake.jpg"), // Hunza Attabad
  path.join(scenic, "reg-lahore-shalimar.jpg"), // Punjab heritage
  path.join(scenic, "reg-hingol.jpg"), // Balochistan Hingol
  path.join(scenic, "reg-islamabad-dusk.jpg"), // Islamabad
  path.join(scenic, "reg-badshahi-wide.jpg"), // Lahore Badshahi
  path.join(scenic, "reg-islamabad-hills.jpg"), // Azad Kashmir / northern meadows
  path.join(hero, "hunza-3.jpg"), // Rakaposhi / GB peaks
  path.join(scenic, "pk-deosai.jpg"), // Northern high pastures
].filter((f) => fs.existsSync(f));

async function frame(file, progress) {
  const scale = 1 + progress * 0.055;
  const meta = await sharp(file).metadata();
  const iw = meta.width ?? WIDTH;
  const ih = meta.height ?? HEIGHT;
  const cover = Math.max(WIDTH / iw, HEIGHT / ih) * scale;
  const cropW = Math.min(iw, Math.round(WIDTH / cover));
  const cropH = Math.min(ih, Math.round(HEIGHT / cover));
  const left = Math.max(0, Math.round((iw - cropW) / 2));
  const top = Math.max(0, Math.min(Math.round((ih - cropH) / 2), ih - cropH));

  const { data } = await sharp(file)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.75, m1: 0.7, m2: 0.35 })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
}

async function main() {
  console.log("Regions mix:", shots.map((s) => path.basename(s)).join(", "));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const encoder = new GIFEncoder(WIDTH, HEIGHT);
  const stream = fs.createWriteStream(outPath);
  encoder.createReadStream().pipe(stream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(DELAY_MS);
  encoder.setQuality(4);

  for (const file of shots) {
    const name = path.basename(file);
    for (let i = 0; i < FRAMES; i++) {
      encoder.addFrame(await frame(file, i / Math.max(1, FRAMES - 1)));
      process.stdout.write(`\r${name} ${i + 1}/${FRAMES}   `);
    }
  }

  encoder.finish();
  await new Promise((r, j) => {
    stream.on("finish", r);
    stream.on("error", j);
  });
  console.log(`\nWrote ${outPath} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
