import express, { Request, Response }  from 'express';
import { body } from 'express-validator';
import { User } from '../../../models/user';
import { BadRequestError, NotFoundError, validateRequest } from '@sgtickets/common';
import { Password } from '../services/password';
const router = express.Router();

router.patch('/api/users/me/forgot-password',
[
  body('email')
  .isEmail().trim().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Password must be between 7 and 20 characters'),
],
validateRequest,
  async (req:Request, res:Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['password', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
      throw new BadRequestError('Invalid updates!');
  }
  
  const { password, email }  = req.body
   const user = await User.findOne({email})

  if (!user) {
    throw new NotFoundError();
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

export { router as forgotPasswordRouter };