import { app } from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import { serverPort } from "./src/config/secret.js";

app.listen(serverPort, async () => {
  console.log(`Server is running at http://localhost:${serverPort}`);
  await connectDb();
});
