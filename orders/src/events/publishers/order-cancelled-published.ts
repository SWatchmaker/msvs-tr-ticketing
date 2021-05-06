import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@swatch-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
