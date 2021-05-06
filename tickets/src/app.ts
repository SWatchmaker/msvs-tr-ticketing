import 'express-async-errors';

import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@swatch-tickets/common';

import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import express from 'express';
import { indexTicketRouter } from './routes/index';
import { showTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
