const fs = require('fs');
const path = require('path');

console.log('🎨 PWA Icon Generator');
console.log('===================');

// Create a simple SVG icon generator
function createIcon(size) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="#059669" stroke="#047857" stroke-width="2"/>
  
  <!-- Tool icon (wrench) -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Wrench body -->
    <path d="M-12,-8 L-8,-4 L8,4 L12,0 L8,-4 L-8,-12 L-12,-8 Z" fill="white" stroke="none"/>
    <!-- Wrench handle -->
    <rect x="-16" y="-2" width="8" height="4" rx="2" fill="white"/>
    <!-- Wrench head -->
    <circle cx="12" cy="0" r="3" fill="white"/>
  </g>
  
  <!-- Text -->
  <text x="${size/2}" y="${size - 8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size/8}" font-weight="bold" fill="white">ابزار</text>
</svg>`;
  
  return svg;
}

// Icon sizes needed for PWA
const iconSizes = [192, 256, 384, 512];

console.log('📱 Creating PWA icons...');

iconSizes.forEach(size => {
  const svg = createIcon(size);
  const filename = `public/icon-${size}x${size}.png`;
  
  // For now, we'll create SVG files and mention that they need to be converted to PNG
  const svgFilename = `public/icon-${size}x${size}.svg`;
  fs.writeFileSync(svgFilename, svg);
  
  console.log(`✅ Created ${svgFilename}`);
});

// Create favicon
const faviconSvg = createIcon(32);
fs.writeFileSync('public/favicon.svg', faviconSvg);
console.log('✅ Created favicon.svg');

console.log('');
console.log('📋 Next Steps:');
console.log('');
console.log('1. Convert SVG files to PNG format:');
console.log('   - Use online converters like: https://convertio.co/svg-png/');
console.log('   - Or use tools like Inkscape, GIMP, or Photoshop');
console.log('');
console.log('2. Required PNG files:');
iconSizes.forEach(size => {
  console.log(`   - public/icon-${size}x${size}.png`);
});
console.log('');
console.log('3. Optional: Create screenshots for PWA store:');
console.log('   - public/screenshot-mobile.png (390x844)');
console.log('   - public/screenshot-desktop.png (1280x720)');
console.log('');
console.log('4. Alternative: Use your existing logo:');
console.log('   - Copy your logo to public/logo.svg');
console.log('   - Convert it to the required PNG sizes');
console.log('   - Replace the generated icons');
console.log('');
console.log('🎉 PWA icons structure created!');
