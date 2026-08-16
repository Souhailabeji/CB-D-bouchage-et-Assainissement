const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Dossier à scanner (adapte le chemin si tes images sont ailleurs)
const targetDir = path.join(__dirname, 'src', 'assets', 'images-original');

// Taille max acceptable avant compression (en octets) - ici 1 Mo
const SIZE_THRESHOLD = 1 * 1024 * 1024;

// Largeur max pour redimensionner (les images web n'ont pas besoin d'être en 4K)
const MAX_WIDTH = 1600;

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(png|jpe?g)$/i.test(file)) {
      if (stat.size > SIZE_THRESHOLD) {
        compressImage(fullPath, stat.size);
      }
    }
  });
}

async function compressImage(filePath, originalSize) {
  try {
    const tempPath = filePath + '.tmp';

    await sharp(filePath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(tempPath);

    const newSize = fs.statSync(tempPath).size;

    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);

    console.log(
      `✔ ${path.basename(filePath)}: ${(originalSize / 1024 / 1024).toFixed(2)} Mo → ${(newSize / 1024 / 1024).toFixed(2)} Mo`
    );
  } catch (err) {
    console.error(`✘ Erreur sur ${filePath}:`, err.message);
  }
}

console.log('Compression des images volumineuses en cours...\n');
walk(targetDir);