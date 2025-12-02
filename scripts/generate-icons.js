const fs = require('fs');
const path = require('path');

// Create simple SVG icons that can be used as placeholders
const createSVGIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">GS</text>
</svg>`;
};

const publicDir = path.join(__dirname, '..', 'public');

// Generate icons
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), createSVGIcon(512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), createSVGIcon(180));
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), createSVGIcon(32));

console.log('✓ Icons generated successfully!');
console.log('Note: SVG icons created. For production, convert to PNG using:');
console.log('  - Online tool: https://svgtopng.com');
console.log('  - Or install sharp: npm install sharp');
