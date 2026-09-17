const fs = require('fs');

const files = ['public/assets/img1.png', 'public/assets/img2.png', 'public/assets/logo.png'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const stat = fs.statSync(f);
    console.log(f, 'size:', stat.size);
    // Read PNG header to get width and height
    const buf = fs.readFileSync(f);
    if (buf.length > 24 && buf.toString('ascii', 1, 4) === 'PNG') {
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      console.log(`  Dimensions: ${w}x${h}`);
    }
  }
});
