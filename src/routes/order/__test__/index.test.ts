import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { BodyStyles } from '../../../events/types/BodyStyles';
import { SellingCondition } from '../../../events/types/SellingCondition';
import { Transmission } from '../../../events/types/Transmission';
import { Vehicle } from '../../../models/Vehicle';


const buildVehicle = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const vehicle = Vehicle.build({
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

  return vehicle;
};

it('fetches orders for a particular user', async () => {
  // Create three vehicles
  const vehicleOne = await buildVehicle();
  const vehicleTwo = await buildVehicle();
  const vehicleThree = await buildVehicle();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ vehicleId: vehicleOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ vehicleId: vehicleTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ vehicleId: vehicleThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].vehicle.id).toEqual(vehicleTwo.id);
  expect(response.body[1].vehicle.id).toEqual(vehicleThree.id);
});
