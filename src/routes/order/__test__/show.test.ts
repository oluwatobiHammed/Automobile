import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { BodyStyles } from '../../../events/types/BodyStyles';
import { SellingCondition } from '../../../events/types/SellingCondition';
import { Transmission } from '../../../events/types/Transmission';
import { Vehicle } from '../../../models/Vehicle';


it('fetches the order', async () => {
  // Create a vehicle
  const vehicle = Vehicle.build({
      id: mongoose.Types.ObjectId().toHexString(),
      make: 'Honda',
      price: 10,
      color:'red',
      condition: SellingCondition.locallyUsed,
      year: 2009,
      bodyStyles: BodyStyles.Coupe, 
      transmission: Transmission.Automatic,
      carRating: 1,
  });
  await vehicle.save();

  const user = global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ vehicleId: vehicle.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a vehicle
  const vehicle = Vehicle.build({
    id: mongoose.Types.ObjectId().toHexString(),
    make: 'Honda',
    price: 10,
    color:'red',
    condition: SellingCondition.locallyUsed,
    year: 2009,
    bodyStyles: BodyStyles.Coupe, 
    transmission: Transmission.Automatic,
    carRating: 1,
  });
  await vehicle.save();

  const user = global.signin();
  // make a request to build an order with this vehicle
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ vehicleId: vehicle.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
