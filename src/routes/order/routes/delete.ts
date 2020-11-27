import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@sgtickets/common';
import { body, param } from 'express-validator';
import { Order } from '../../../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('VehicleId must be provided'),
  ],
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('vehicle');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();


    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
