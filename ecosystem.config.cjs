module.exports = {
  apps: [
    {
      name: "meal-planner-ui",
      // CRITICAL CHANGE: Tell PM2 to run the simple JS file
      script: "launch-ui.js", 
      
      // Use the standard Node interpreter
      interpreter: "node", 
      
      // Set the working directory explicitly
      cwd: "D:/meal-planner-ui", 
      
      // No extra args needed, the JS file handles the command
      args: [], 
      
      watch: false, 
      env: {
        NODE_ENV: "production",
      },
    }
  ]
};