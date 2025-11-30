// Simple script to extract dominant colors from logo
// Requires sharp: npm install sharp

const sharp = require('sharp');
const fs = require('fs');

async function extractColors() {
  try {
    const image = sharp('public/logo.png');
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Sample colors from the image
    const colors = new Map();
    const step = Math.max(1, Math.floor(data.length / 1000)); // Sample every nth pixel
    
    for (let i = 0; i < data.length; i += step * 4) {
      if (i + 3 < data.length) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Round to reduce color space
        const rRound = Math.round(r / 10) * 10;
        const gRound = Math.round(g / 10) * 10;
        const bRound = Math.round(b / 10) * 10;
        
        const key = `${rRound},${gRound},${bRound}`;
        colors.set(key, (colors.get(key) || 0) + 1);
      }
    }
    
    // Get most common colors
    const sortedColors = Array.from(colors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    console.log('\nDominant colors found in logo:');
    sortedColors.forEach(([rgb, count], index) => {
      const [r, g, b] = rgb.split(',').map(Number);
      const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      console.log(`${index + 1}. RGB(${r}, ${g}, ${b}) = ${hex} (${count} occurrences)`);
    });
    
    if (sortedColors.length >= 2) {
      const [r1, g1, b1] = sortedColors[0][0].split(',').map(Number);
      const [r2, g2, b2] = sortedColors[1][0].split(',').map(Number);
      const primaryHex = `#${[r1, g1, b1].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      const secondaryHex = `#${[r2, g2, b2].map(x => x.toString(16).padStart(2, '0')).join('')}`;
      
      console.log('\nSuggested colors:');
      console.log(`Primary: ${primaryHex}`);
      console.log(`Secondary: ${secondaryHex}`);
    }
  } catch (error) {
    console.error('Error extracting colors:', error.message);
    console.error('\nPlease install sharp: npm install sharp');
  }
}

extractColors();


