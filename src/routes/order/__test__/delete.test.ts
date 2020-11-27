import mongoose from 'mongoose';
import request from 'supertest'; 
import { app } from '../../../app';
import { BodyStyles } from '../../../events/types/BodyStyles';
import { SellingCondition } from '../../../events/types/SellingCondition';
import { Transmission } from '../../../events/types/Transmission';
import { Order, OrderStatus } from '../../../models/order';
import { Vehicle } from '../../../models/Vehicle';

it('marks an order as cancelled', async () => {
  // create a vehicle with Vehicle Model
  const vehicles = Vehicle.build({
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
  await vehicles.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ vehicleId: vehicles.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


