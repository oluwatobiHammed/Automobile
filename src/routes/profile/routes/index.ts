import express, { Request, Response } from 'express';
import { currentUser } from '../../auth/current-user';
import { paginatedResults } from '../../../middleware/paginatedResults';
import { NotAuthorizedError, NotFoundError } from '@sgtickets/common';
import { Vehicle } from '../../../models/Vehicle';


const router = express.Router();

router.get('/api/users/me/vehicles/:id', currentUser,paginatedResults(Vehicle), async (req: Request, res: Response) => {
if (req.currentUser!.id !== req.params.id) {
throw new NotAuthorizedError()
}
res.send(res.paginatedResults);
  
});

export { router as indexUserVehiclesRouter };