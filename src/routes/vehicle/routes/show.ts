import express, { Request, Response } from 'express';
import { NotFoundError } from '@sgtickets/common';
import { Vehicle } from '../../../models/Vehicle';


const router = express.Router();

router.get('/api/vehicles/:id', async (req: Request, res: Response) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    throw new NotFoundError();
  }

  res.send(vehicle);
});

export { router as showVehicleRouter };
