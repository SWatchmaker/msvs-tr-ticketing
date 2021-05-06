import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@swatch-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
