
import express, { Request, Response } from 'express';
import { paginatedResults } from '../../../middleware/paginatedResults';
import { Vehicle } from '../../../models/Vehicle';


const router = express.Router();

router.get('/api/vehicles',paginatedResults(Vehicle), async (req: Request, res: Response) => {

  res.send(res.paginatedResults);
});

export { router as indexVehicleRouter };
