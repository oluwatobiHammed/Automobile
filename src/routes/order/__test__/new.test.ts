import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { BodyStyles } from '../../../events/types/BodyStyles';
import { SellingCondition } from '../../../events/types/SellingCondition';
import { Transmission } from '../../../events/types/Transmission';
import { Order, OrderStatus } from '../../../models/order';
import { Vehicle } from '../../../models/Vehicle';


it('returns an error if the ticket does not exist', async () => {
  const vehicleId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ vehicleId })
    .expect(404);
});

it('returns an error if the vehicle is already reserved', async () => {
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
    userId:id
  });
  await vehicle.save();
  const order = Order.build({
    vehicle,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    price: vehicle.price
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ vehicleId: vehicle.id })
    .expect(400);
});

it('reserves a ticket', async () => {
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
    userId:id
  });
  await vehicle.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ vehicleId: vehicle.id })
    .expect(201);
});


