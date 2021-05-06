import { OrderCreatedEvent, OrderStatus } from '@swatch-tickets/common';

import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: 'asdfasdf',
    version: 0,
    expiresAt: 'asdfasdfas',
    status: OrderStatus.Created,
    ticket: {
      id: 'asdfasdfafasd',
      price: 20,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.userId).toEqual(data.userId);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
