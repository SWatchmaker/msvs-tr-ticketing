import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import mongoose from 'mongoose';
import request from 'supertest';

it('fetches the order', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

it('returns an error if a user tries to fetch another users order ', async () => {
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
