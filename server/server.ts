import express from "express";
import bodyParser from "body-parser";
import errorMiddleware from "./errors/errorMiddleware";
import {bindRoutes} from "./routes";

const app = express();
const port = process.env.PORT || 5000;

function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next
) {
  console.log(`${request.method} ${request.path}`);
  next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(loggerMiddleware);

bindRoutes(app);
app.use(errorMiddleware);
app.listen(port, () => console.log(`Listening on port ${port}`));
