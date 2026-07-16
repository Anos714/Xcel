import app from "./app";
import { env } from "./config/env";
import { registerAutomationScheduler, registerPostingSchedulers } from './jobs/scheduler';
import './workers/automation.worker.js'
import './workers/posting.worker.js'


const PORT = env.PORT;
const startServer = async() => {
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  await registerAutomationScheduler();
  await registerPostingSchedulers()


console.log("Automation Scheduler Registered");
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});