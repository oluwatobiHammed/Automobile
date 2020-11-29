import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@sgtickets/common';
import { Vehicle } from '../../../models/Vehicle';
import { vehicleConditionValid, vehicleBodyStyleValid, vehicleTransmissionValid } from '../../../events/types/isValid';
import { currentUser } from '../../auth/current-user';
const router = express.Router();

router.post(
  '/api/vehicles',
  requireAuth,
  [
    body('make').not().isEmpty().withMessage('make is required'),
    body('color').not().isEmpty().withMessage('color is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('year')
      .isFloat({ gt: 1994 })
      .withMessage('Year of car must not be less than 1995'),
    body('condition')
       .not()
       .trim()
      .isEmpty()
      .custom((input: string) => vehicleConditionValid(input))
      .withMessage('Vehicle condition must be provided here  are the avaliable selection: Brand New, Locally Used, Foreign Used'),
    body('bodyStyles')
      .not()
     .isEmpty()
     .trim()
     .custom((input: string) => vehicleBodyStyleValid(input))
     .withMessage('Vehicle body Style selected is not avaliable on the system here are the available selection: Bus, Convertible, Coupe, Crossover, hatchback, Minivan, Pickup, Sedan, Other, Station Wagon'),
    body('transmission')
     .not()
    .isEmpty()
    .custom((input: string) => vehicleTransmissionValid(input))
    .withMessage('Vehicle Transmission selected is not avaliable on the system here are the available selection: Automatic, Manual'),
  ],
  validateRequest, currentUser,
  async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['make', 'color','price','year', 'condition','bodyStyles', 'transmission','phonenumber', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      throw new BadRequestError('Invalid Request!');
  }
  if (!req.currentUser) {
    throw new NotAuthorizedError()
    }

       // Find the vehicle the user is trying to order in the database
    const { make, price, color, year, condition, carRating, bodyStyles, transmission} = req.body;
    const vehicle = Vehicle.build({
      make,
      price,
      userId: req.currentUser!.id,
      color,
      condition,
      year,
      carRating, bodyStyles, transmission
    });
    await vehicle.save();

    res.status(201).send(vehicle);
  }
);

export { router as createVehicleRouter };
