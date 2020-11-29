import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@sgtickets/common';
import { body } from 'express-validator';
import { Vehicle } from '../../../models/Vehicle';
import { Order } from '../../../models/order';



const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('vehicleId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('VehicleId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['vehicleId']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      throw new BadRequestError('Invalid request!');
  }
    const { vehicleId } = req.body;

    // Find the vehicle the user is trying to order in the database
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await vehicle.isReserved();
    if (isReserved) {
      throw new BadRequestError('Vehicle is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      vehicle,
      price: vehicle.price
    });
    await order.save();



    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
