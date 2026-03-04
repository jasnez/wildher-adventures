/**
 * Optimizacija placeholder slika za WildHer Adventures.
 * - Konvertuje JPG u WebP (manji file size, moderna podrška).
 * - Generiše više širina za srcset: 400, 640, 960, 1280, 1920.
 * - Izlaz: public/images/ — koristi OptimizedImage komponentu za lazy load + srcset.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'public');
const OUTPUT_DIR = path.join(ROOT, 'public', 'images');

// Širine za srcset (px) — pokrivaju mobile → wide (375–1440+)
const WIDTHS = [400, 640, 960, 1280, 1920];
const WEBP_QUALITY = 82;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getJpgFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|JPE?G)$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(path.basename(a, path.extname(a)), 10);
      const numB = parseInt(path.basename(b, path.extname(b)), 10);
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
      return String(a).localeCompare(b);
    });
}

async function optimizeImage(inputPath, baseName) {
  const results = [];
  const metadata = await sharp(inputPath).metadata();
  const maxWidth = Math.min(metadata.width || 1920, 1920);
  const widths = [...new Set([...WIDTHS.filter((w) => w <= maxWidth), maxWidth])].sort((a, b) => a - b);

  for (const w of widths) {
    const outName = `${baseName}-${w}w.webp`;
    const outPath = path.join(OUTPUT_DIR, outName);
    await sharp(inputPath)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    results.push({ width: w, path: `/images/${outName}`, bytes: stat.size });
  }

  return results;
}

async function main() {
  ensureDir(OUTPUT_DIR);
  const files = getJpgFiles(INPUT_DIR);

  if (files.length === 0) {
    console.log('Nema JPG/JPEG fajlova u public/. Preskačem.');
    return;
  }

  console.log(`Pronađeno ${files.length} slika. Generišem WebP u ${OUTPUT_DIR}...`);

  const manifest = {};
  for (const file of files) {
    const baseName = path.basename(file, path.extname(file));
    const inputPath = path.join(INPUT_DIR, file);
    try {
      const variants = await optimizeImage(inputPath, baseName);
      manifest[baseName] = variants;
      const totalBytes = variants.reduce((s, v) => s + v.bytes, 0);
      console.log(`  ${file} → ${variants.length} WebP varijanti (${(totalBytes / 1024).toFixed(0)} KB ukupno)`);
    } catch (err) {
      console.error(`  Greška za ${file}:`, err.message);
    }
  }

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nManifest sačuvan: ${manifestPath}`);
  console.log('Gotovo. Koristi komponentu OptimizedImage sa imenom fajla (npr. "1", "2") ili putem manifesta.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
