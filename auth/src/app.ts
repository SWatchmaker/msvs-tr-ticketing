import { errorHandler, NotFoundError } from "@swatch-tickets/common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

const app = express();

// NEXT LINE NEEDED TO WORK WITH NGINX INGRESS
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
