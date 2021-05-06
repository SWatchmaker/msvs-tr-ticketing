import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher conneted to NATS');
  const data = {
    id: '123',
    title: 'concert',
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish(data);
  } catch (error) {
    console.log(error);
  }
});
