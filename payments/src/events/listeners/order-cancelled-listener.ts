import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@swatch-tickets/common';
import { Order, OrderStatus } from '../../models/order';

import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent({
      id: data.id,
      version: data.version,
    });

    if (!order) throw new Error('Order not found!');

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
