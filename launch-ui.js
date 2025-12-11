// Use ES Module syntax to import the necessary function
import { exec } from 'child_process';

// The command that successfully runs the server locally
const command = 'npx http-server dist -a 0.0.0.0 -p 5174 -c-1';

console.log(`Starting UI Server with command: ${command}`);

exec(command, (error, stdout, stderr) => {
    if (error) {
        // Output the error to PM2 error log
        console.error(`Execution error: ${error.message}`);
        return;
    }
    if (stderr) {
        // Output the stderr to PM2 error log
        console.error(`Stderr: ${stderr}`);
        return;
    }
    // Output the success message to PM2 out log
    console.log(`Stdout: ${stdout}`);
});

// Keep the process alive indefinitely
setInterval(() => {}, 1000);