import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
