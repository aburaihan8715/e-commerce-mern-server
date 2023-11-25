import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { serverPort } from "./config/secret.js";
import { logger } from "./controllers/loggerController.js";

app.listen(serverPort, async () => {
  logger.log("info", `Server is running at http://localhost:${serverPort}`);
  await connectDb();
});
