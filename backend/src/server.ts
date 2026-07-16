import app from "./app";
import { env } from "./config/env";
import { registerAutomationScheduler, registerPostingSchedulers } from './jobs/scheduler';
import { logger } from "./lib/logger.js";
import './workers/automation.worker.js'
import './workers/posting.worker.js'


const PORT = env.PORT;
const startServer = async() => {
  
  app.listen(PORT, () => {
   logger.info(`Server running at http://localhost:${PORT}`);
  });

  await registerAutomationScheduler();
  await registerPostingSchedulers()


logger.info("Automation Scheduler Registered");
};

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});