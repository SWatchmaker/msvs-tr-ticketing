import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@swatch-tickets/common';
import express, { Request, Response } from 'express';

import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be grater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) throw new NotFoundError();

    if (ticket.orderId)
      throw new BadRequestError('Cannot edit a reserved ticket');

    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    ticket.title = title;
    ticket.price = price;
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
