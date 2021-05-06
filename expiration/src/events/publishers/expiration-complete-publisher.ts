import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@swatch-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
