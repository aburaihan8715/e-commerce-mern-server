import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { serverPort } from "./secret.js";

app.listen(serverPort, async () => {
  console.log(`Server is running at http://localhost:${serverPort}`);
  await connectDb();
});
