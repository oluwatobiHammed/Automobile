import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { SellingCondition } from '../../../events/types/SellingCondition';
import { BodyStyles } from '../../../events/types/BodyStyles';
import { Transmission } from '../../../events/types/Transmission';

it('returns a 404 if the vehicle is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/vehicles/${id}`).send().expect(404);
});

it('returns the vehicle if the vehicle is found', async () => {

  const response = await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: SellingCondition.foreignUsed,
      year: 2009,
      bodyStyles: BodyStyles.Bus, 
      transmission: Transmission.Automatic
    })
    .expect(201);

  const vehicleResponse = await request(app)
    .get(`/api/vehicles/${response.body.id}`)
    .send()
    .expect(200);

  expect(vehicleResponse.body.make).toEqual('toyota');
  expect(vehicleResponse.body.price).toEqual(10);
  expect(vehicleResponse.body.color).toEqual('red');
  expect(vehicleResponse.body.condition).toEqual(SellingCondition.foreignUsed);
  expect(vehicleResponse.body.year).toEqual(2009);
  expect(vehicleResponse.body.bodyStyles).toEqual(BodyStyles.Bus);
  expect(vehicleResponse.body.transmission).toEqual(Transmission.Automatic);
});
