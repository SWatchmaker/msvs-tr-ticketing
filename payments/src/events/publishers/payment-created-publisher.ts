import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@swatch-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
