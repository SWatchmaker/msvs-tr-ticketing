import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketCreatedEvent } from '@swatch-tickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    price: 50,
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
