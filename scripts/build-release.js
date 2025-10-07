const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting release build...');

// Function to execute commands and log output
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean up previous builds
console.log('\n🧹 Cleaning up previous builds...');
if (fs.existsSync('bin')) {
  fs.rmSync('bin', { recursive: true, force: true });
}
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
}

// Create release directory
fs.mkdirSync('bin/release', { recursive: true });

// Step 1: Build the frontend for production
// Default to export mode for release builds (static export to wwwroot)
const buildMode = process.env.BUILD_MODE || 'export';

// Set environment variable for the build
if (buildMode === 'export') {
  process.env.BUILD_MODE = 'export';
  process.env.NODE_ENV = 'production';
}

runCommand('npm run build', `Building frontend (mode: ${buildMode})`);

// Step 2: Build the backend for release
runCommand('dotnet publish RisagerBackend/RisagerBackend.csproj -c Release -o bin/backend --self-contained false', 'Building backend for release');

// Step 3: Copy frontend files to backend wwwroot
console.log('\n📂 Copying frontend files to backend...');
const frontendOutDir = path.join(process.cwd(), 'out');
const backendWwwrootDir = path.join(process.cwd(), 'bin/backend/wwwroot');

// Create wwwroot directory if it doesn't exist
if (!fs.existsSync(backendWwwrootDir)) {
  fs.mkdirSync(backendWwwrootDir, { recursive: true });
}

// Copy Next.js static export to wwwroot
if (fs.existsSync(frontendOutDir)) {
  copyDir(frontendOutDir, backendWwwrootDir);
  console.log('✅ Frontend files copied to backend wwwroot');
} else {
  console.error('❌ Frontend build output not found. Make sure Next.js is configured for static export.');
  process.exit(1);
}

// Step 4: Create deployment package
console.log('\n📦 Creating deployment package...');
const releaseDir = path.join(process.cwd(), 'bin/release');

// Copy backend files to release directory
copyDir(path.join(process.cwd(), 'bin/backend'), releaseDir);

// Step 5: Create zip file for Azure deployment
const archiver = require('archiver');
const output = fs.createWriteStream('bin/risager-app-release.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`\n🎉 Release package created: bin/risager-app-release.zip (${archive.pointer()} bytes)`);
  console.log('📋 Release contents:');
  console.log('   - ASP.NET Core backend application');
  console.log('   - Frontend files in wwwroot/');
  console.log('   - Ready for Azure App Service deployment');
  console.log('\n✨ Build release completed successfully!');
});

archive.on('error', (err) => {
  console.error('❌ Error creating zip file:', err);
  process.exit(1);
});

archive.pipe(output);
archive.directory('bin/release/', false);
archive.finalize();