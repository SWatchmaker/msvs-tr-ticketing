import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@swatch-tickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 50,
    title: 'concert',
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 40,
    version: ticket.version + 1,
    userId: mongoose.Types.ObjectId().toHexString(),
    title: 'new concert',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does no call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
