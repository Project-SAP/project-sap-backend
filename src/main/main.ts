import dotenv from "dotenv";
import startApplication from "./application";

const app = startApplication();
const port = process.env.SERVER_PORT;
dotenv.config();

// Start server
app.listen(port, async () => {
    // TODO: Remove
    // tslint:disable-next-line:no-console
    console.log(`started server at http://localhost:${ port }`);
});
