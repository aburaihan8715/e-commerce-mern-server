import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { logger } from "./controllers/loggerController.js";
import { serverPort } from "./config/secret.js";

app.listen(serverPort, async () => {
  logger.log("info", `Server is running at http://localhost:${serverPort}`);
  await connectDb();
});
