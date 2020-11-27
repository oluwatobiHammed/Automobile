import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@sgtickets/common';
import { vehicleConditionValid, vehicleBodyStyleValid, vehicleTransmissionValid } from '../../../events/types/isValid';
import { Vehicle } from '../../../models/Vehicle';

const router = express.Router();

router.put(
  '/api/vehicles/:id',
  requireAuth,
  [
    body('make').not().isEmpty().withMessage('Make is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
      body('year')
      .isFloat({ gt: 1994 })
      .withMessage('Year of car must not be less than 1995'),
      body('color').not().trim().isEmpty().withMessage('color is required'),
      body('condition')
      .not()
      .trim()
     .isEmpty()
     .custom((input: string) => vehicleConditionValid(input))
     .withMessage('Vehicle condition must be provided'),
   body('bodyStyles')
     .not()
    .isEmpty()
    .trim()
    .custom((input: string) => vehicleBodyStyleValid(input))
    .withMessage('Vehicle body Style selected is not avaliable on the system'),
   body('transmission')
    .not()
   .isEmpty()
   .trim()
   .custom((input: string) => vehicleTransmissionValid(input))
   .withMessage('Vehicle Transmission selected is not avaliable on the system'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['make', 'color','price','year', 'condition','bodyStyles', 'transmission']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      throw new BadRequestError('Invalid Update!');
  }
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      throw new NotFoundError();
    }

    if (vehicle.orderId) {
      throw new BadRequestError('Cannot edit a reserved vehicle');
    }

    if (vehicle.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    vehicle.set({
      make: req.body.make,
      price: req.body.price,
      year: req.body.year,
      color: req.body.color,
      condition: req.body.condition,
      carRating: req.body.carRating,
      bodyStyles: req.body.bodyStyles,
      transmission: req.body.transmission

    });
    await vehicle.save();


    res.send(vehicle);
  }
);

export { router as updateVehicleRouter };
