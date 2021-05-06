import 'express-async-errors';

import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@swatch-tickets/common';

import cookieSession from 'cookie-session';
import { deleteOrderRouter } from './routes/delete';
import express from 'express';
import { indexOrderRouter } from './routes/index';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();

// NEXT LINE NEEDED TO WORK WITH NGINX INGRESS
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

//ROUTES
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
