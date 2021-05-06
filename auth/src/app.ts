import 'express-async-errors';

import { NotFoundError, errorHandler } from '@swatch-tickets/common';

import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import express from 'express';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';

const app = express();

// NEXT LINE NEEDED TO WORK WITH NGINX INGRESS
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
