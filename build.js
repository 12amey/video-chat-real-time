/**
 * Build Script for Video Chat Application
 * This script prepares the application for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    console.log('✅ Created build directory');
}

// Directories to copy
const directoriesToCopy = ['public', 'views'];
const filesToCopy = [
    'server.js', 
    'package.json', 
    'package-lock.json', 
    '.gitignore',
    'netlify.toml',
    '_redirects',
    'render.yaml',
    'railway.json',
    'app.json',
    'Dockerfile',
    '.dockerignore',
    'DEPLOYMENT.md',
    'NETLIFY_README.txt',
    'START_HERE.md',
    'DEPLOYMENT_FILES_GUIDE.md'
];

// Copy directories
directoriesToCopy.forEach(dir => {
    const srcDir = path.join(__dirname, dir);
    const destDir = path.join(buildDir, dir);
    
    if (fs.existsSync(srcDir)) {
        copyDirectory(srcDir, destDir);
        console.log(`✅ Copied ${dir} directory`);
    }
});

// Copy files
filesToCopy.forEach(file => {
    const srcFile = path.join(__dirname, file);
    const destFile = path.join(buildDir, file);
    
    if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied ${file}`);
    }
});

// Create production README
const prodReadme = `# Video Chat Application - Production Build

## Deployment Instructions

1. Install dependencies:
   \`\`\`bash
   npm install --production
   \`\`\`

2. Set environment variables (optional):
   - PORT (default: 3030)
   - NODE_ENV=production

3. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

## Features
- Real-time video chat with WebRTC
- 3D particle background animations
- Screen sharing capability
- Text chat functionality
- Responsive design

## Requirements
- Node.js 12+
- Modern web browser with WebRTC support
`;

fs.writeFileSync(path.join(buildDir, 'README.md'), prodReadme);
console.log('✅ Created production README');

console.log('\n🎉 Build completed successfully!');
console.log(`📦 Build output: ${buildDir}`);

// Helper function to copy directory recursively
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
