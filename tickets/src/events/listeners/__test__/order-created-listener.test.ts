import { OrderCreatedEvent, OrderStatus } from '@swatch-tickets/common';

import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 50,
    userId: 'asdf',
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdfasdf',
    expiresAt: 'asdfasdf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the user id of the ticke', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
