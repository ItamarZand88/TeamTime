import { exec } from 'child_process';

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

async function installPythonDependencies() {
  try {
    console.log('Installing Python dependencies...');
    await executeCommand('pip install pulp');
    console.log('Python dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install Python dependencies:', error);
    process.exit(1); 
  }
}

installPythonDependencies();
