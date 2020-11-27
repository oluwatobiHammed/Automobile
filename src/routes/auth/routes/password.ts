import express, { Request, Response }  from 'express';
import { currentUser } from '../current-user';
import { body } from 'express-validator';
import { User } from '../../../models/user';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@sgtickets/common';
import { Password } from '../services/password';
const router = express.Router();

router.patch('/api/users/me',
currentUser,
[
  body('password')
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Password must be between 7 and 20 characters'),
 
],
validateRequest,
  async (req:Request, res:Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
      throw new BadRequestError('Invalid updates!');
  }
  if(req.currentUser === undefined){
    throw new NotAuthorizedError()
  }
  const email = req.currentUser!.email
  const { password}  = req.body
   const user = await User.findOne({email})

  if (!user) {
    throw new NotFoundError();
  }

  if (user.email !== req.currentUser!.email) {
    throw new NotAuthorizedError()
  }
  const passwordsMatch = await Password.compare(
    user.password,
    password
  );

  if (passwordsMatch) {
    throw new BadRequestError('Cannot use already used password');
  }

  user.set({password})

  await user.save()

  res.send(user)
})

export { router as currentUserPasswordUpdateRouter };