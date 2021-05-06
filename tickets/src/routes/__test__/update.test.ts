import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import request from 'supertest';

it('returns a 404 if the provided id not exists', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(401);
});

it('returns a 401 if the user not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(201);

  const id = response.body.id;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(201);

  const id = response.body.id;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      price: 123,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(201);

  const id = response.body.id;
  const newTitle = 'new title';

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: 123,
    })
    .expect(200);

  const ticket = await Ticket.findById(id);
  expect(ticket?.title).toEqual(newTitle);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(201);

  const id = response.body.id;
  const newTitle = 'new title';

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: 123,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('reject updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfasdf',
      price: 123,
    })
    .expect(201);

  const id = response.body.id;
  const ticket = await Ticket.findById(id);

  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 123,
    })
    .expect(400);
});
