import { app } from "./app.js";
import { serverPort } from "./secret.js";

app.listen(serverPort, () => {
  console.log(`Server is running at http://localhost:${serverPort}`);
});
