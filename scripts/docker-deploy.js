const { execSync } = require('child_process');

console.log('🐳 Starting Docker deployment...');

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

// Step 1: Build the release package
runCommand('npm run build-release', 'Building release package');

// Step 2: Stop the existing app container if running
console.log('\n🛑 Stopping existing app container...');
try {
  execSync('docker compose stop app', { stdio: 'inherit', cwd: process.cwd() });
  execSync('docker compose rm -f app', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Existing app container stopped and removed');
} catch (error) {
  console.log('ℹ️  No existing app container to remove');
}

// Step 3: Build and start the app container
runCommand('docker compose up -d --build app', 'Building and starting app container');

console.log('\n✨ Docker deployment completed successfully!');
console.log('📋 Application is now running at: http://localhost:5062');
console.log('   - PostgreSQL: localhost:5432');
console.log('   - MinIO API: localhost:9000');
console.log('   - MinIO Console: localhost:9001');
