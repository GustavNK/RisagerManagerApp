const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('📦 Starting Docker deployment package build...');

// Function to execute commands and log output
function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
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

// Function to copy single file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`  ✓ Copied ${path.basename(src)}`);
}

// Step 1: Build the release package
runCommand('npm run build-release', 'Building application release');

// Step 2: Create deployment package directory
console.log('\n📂 Creating deployment package structure...');
const packageDir = path.join(process.cwd(), 'bin/docker-package');
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir, { recursive: true });

// Step 3: Copy necessary files
console.log('\n📋 Copying deployment files...');

// Copy the built release
const releaseDir = path.join(process.cwd(), 'bin/release');
const packageReleaseDir = path.join(packageDir, 'bin/release');
console.log('  Copying application binaries...');
copyDir(releaseDir, packageReleaseDir);

// Copy Dockerfile
copyFile(
  path.join(process.cwd(), 'Dockerfile'),
  path.join(packageDir, 'Dockerfile')
);

// Copy docker-compose.prod.yml
copyFile(
  path.join(process.cwd(), 'docker-compose.prod.yml'),
  path.join(packageDir, 'docker-compose.yml')
);

// Copy .env.example
copyFile(
  path.join(process.cwd(), '.env.example'),
  path.join(packageDir, '.env.example')
);

// Copy DEPLOY.md if it exists
const deployMdPath = path.join(process.cwd(), 'DEPLOY.md');
if (fs.existsSync(deployMdPath)) {
  copyFile(deployMdPath, path.join(packageDir, 'DEPLOY.md'));
}

// Step 4: Create quick-start script for Linux/Mac
console.log('\n📝 Creating deployment scripts...');
const deployScript = `#!/bin/bash
# Risager App Deployment Script

set -e

echo "🚀 Deploying Risager Application..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from .env.example..."
  cp .env.example .env
  echo "⚠️  IMPORTANT: Edit .env file and update passwords before continuing!"
  echo "   Run: nano .env"
  echo ""
  read -p "Press Enter after you've updated the .env file..."
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  echo "   Visit: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose first."
  echo "   Visit: https://docs.docker.com/compose/install/"
  exit 1
fi

# Pull latest images
echo "📥 Pulling Docker images..."
docker compose pull

# Build and start services
echo "🏗️  Building and starting services..."
docker compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
echo "✨ Deployment complete!"
echo ""
echo "📋 Access your application:"
echo "   - Application: http://localhost:5062"
echo "   - MinIO Console: http://localhost:9001"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker compose logs -f"
echo "   - Stop services: docker compose down"
echo "   - Restart services: docker compose restart"
echo ""
`;

fs.writeFileSync(path.join(packageDir, 'deploy.sh'), deployScript, { mode: 0o755 });
console.log('  ✓ Created deploy.sh (Linux/Mac)');

// Create Windows deployment script
const deployBat = `@echo off
REM Risager App Deployment Script for Windows

echo Deploying Risager Application...

REM Check if .env exists
if not exist .env (
  echo WARNING: No .env file found. Creating from .env.example...
  copy .env.example .env
  echo IMPORTANT: Edit .env file and update passwords before continuing!
  echo   Run: notepad .env
  echo.
  pause
)

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
  echo ERROR: Docker is not running. Please start Docker Desktop first.
  pause
  exit /b 1
)

REM Pull latest images
echo Pulling Docker images...
docker compose pull

REM Build and start services
echo Building and starting services...
docker compose up -d --build

REM Wait for services
echo Waiting for services to start...
timeout /t 10 /nobreak

REM Show service status
echo.
echo Service Status:
docker compose ps

echo.
echo Deployment complete!
echo.
echo Access your application:
echo   - Application: http://localhost:5062
echo   - MinIO Console: http://localhost:9001
echo.
echo Useful commands:
echo   - View logs: docker compose logs -f
echo   - Stop services: docker compose down
echo   - Restart services: docker compose restart
echo.
pause
`;

fs.writeFileSync(path.join(packageDir, 'deploy.bat'), deployBat);
console.log('  ✓ Created deploy.bat (Windows)');

// Step 5: Create the tarball
console.log('\n📦 Creating deployment package archive...');
const outputPath = path.join(process.cwd(), 'bin/risager-docker-deploy.tar.gz');

// Remove old archive if exists
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

const output = fs.createWriteStream(outputPath);
const archive = archiver('tar', {
  gzip: true,
  gzipOptions: { level: 9 }
});

output.on('close', () => {
  const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`\n🎉 Deployment package created successfully!`);
  console.log(`📦 Package: bin/risager-docker-deploy.tar.gz (${sizeInMB} MB)`);
  console.log('\n📋 Package contents:');
  console.log('   - bin/release/          Application binaries');
  console.log('   - Dockerfile            Container build instructions');
  console.log('   - docker-compose.yml    Service orchestration');
  console.log('   - .env.example          Configuration template');
  console.log('   - deploy.sh             Linux/Mac deployment script');
  console.log('   - deploy.bat            Windows deployment script');
  console.log('   - DEPLOY.md             Deployment instructions');
  console.log('\n🚀 Transfer this file to your server and extract it:');
  console.log('   tar -xzf risager-docker-deploy.tar.gz');
  console.log('   cd risager-docker-deploy');
  console.log('   ./deploy.sh             # On Linux/Mac');
  console.log('   deploy.bat              # On Windows');
  console.log('\n✨ Build completed successfully!');
});

output.on('error', (err) => {
  console.error('❌ Error creating output stream:', err);
  process.exit(1);
});

archive.on('error', (err) => {
  console.error('❌ Error creating archive:', err);
  process.exit(1);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('⚠️  Warning:', err);
  } else {
    throw err;
  }
});

archive.pipe(output);

// Add the entire package directory to the archive
// The second parameter 'risager-docker-deploy' will be the root folder name in the archive
archive.directory(packageDir, 'risager-docker-deploy');

archive.finalize();
