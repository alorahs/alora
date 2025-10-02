import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";

/**
 * Enhanced development launcher for Alora
 */

// ANSI color codes for better logging
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '='.repeat(50));
  log(`🏠 ${title}`, 'cyan');
  console.log('='.repeat(50) + '\n');
}

function checkDependencies(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  const packageJsonPath = path.join(dir, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    log(`❌ package.json not found in ${dir}`, 'red');
    return false;
  }
  
  if (!existsSync(nodeModulesPath)) {
    log(`⚠️  node_modules not found in ${dir}, will install dependencies...`, 'yellow');
    return false;
  }
  
  log(`✅ Dependencies check passed for ${dir}`, 'green');
  return true;
}

function run(command, cwd, name) {
  return new Promise((resolve, reject) => {
    log(`🚀 Starting ${name}...`, 'bright');
    log(`📁 Directory: ${cwd}`, 'blue');
    log(`⚡ Command: ${command}`, 'blue');
    
    const [cmd, ...args] = command.split(" ");
    const proc = spawn(cmd, args, { 
      cwd, 
      stdio: "inherit", 
      shell: true 
    });
    
    proc.on('error', (error) => {
      log(`❌ Error starting ${name}: ${error.message}`, 'red');
      reject(error);
    });
    
    proc.on('exit', (code) => {
      if (code === 0) {
        log(`✅ ${name} started successfully`, 'green');
        resolve(code);
      } else {
        log(`❌ ${name} exited with code ${code}`, 'red');
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    return proc;
  });
}

async function startServices() {
  try {
    logHeader('ALORA DEVELOPMENT LAUNCHER');
    
    log('� Checking project structure...', 'cyan');
    
    // Check if directories exist
    if (!existsSync('./backend')) {
      log('❌ Backend directory not found!', 'red');
      process.exit(1);
    }
    
    if (!existsSync('./myapp')) {
      log('❌ Frontend directory not found!', 'red');
      process.exit(1);
    }
    
    log('✅ Project structure verified', 'green');
    
    // Check dependencies
    log('\n🔍 Checking dependencies...', 'cyan');
    const backendDepsOk = checkDependencies('./backend');
    const frontendDepsOk = checkDependencies('./myapp');
    
    // Start backend
    log('\n' + '🔧 BACKEND SERVER'.padEnd(30, ' '), 'magenta');
    const backendCommand = backendDepsOk 
      ? 'nodemon server.js' 
      : 'npm install && nodemon server.js';
    
    const backendProc = spawn('npm', ['run', 'dev'], {
      cwd: './backend',
      stdio: 'inherit',
      shell: true
    });
    
    // Give backend time to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend
    log('\n' + '� FRONTEND SERVER'.padEnd(30, ' '), 'magenta');
    const frontendCommand = frontendDepsOk 
      ? 'npm run dev' 
      : 'npm install && npm run dev';
    
    const frontendProc = spawn('npm', ['run', 'dev'], {
      cwd: './myapp',
      stdio: 'inherit',
      shell: true
    });
    
    // Handle process cleanup
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down servers...', 'yellow');
      backendProc.kill();
      frontendProc.kill();
      process.exit(0);
    });
    
    log('\n✅ Both servers are starting up!', 'green');
    log('🌐 Frontend: http://localhost:8000', 'cyan');
    log('🔧 Backend: http://localhost:5000', 'cyan');
    log('\n💡 Press Ctrl+C to stop both servers', 'yellow');
    
  } catch (error) {
    log(`❌ Failed to start services: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Start the application
startServices();
