import 'express-async-errors';

import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@swatch-tickets/common';

import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';
import express from 'express';

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
app.use(currentUser);

//ROUTES
app.use(createChargeRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
