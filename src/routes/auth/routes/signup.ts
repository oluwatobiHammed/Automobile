import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@sgtickets/common';
import { User } from '../../../models/user';
import { sendWelcomeEmail} from '../../../emails/account'
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('fname').not().isEmpty().withMessage('First Name must be valid'),
    body('lname').not().isEmpty().withMessage('Last Name must be valid'),
    body('phonenumber')
    .trim()
    .isLength({ min: 11, max: 15 })
    .withMessage('Phone Number must be between 12 and 15 characters'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['fname', 'lname', 'phonenumber', 'password', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      throw new BadRequestError('Invalid Request!');
  }
    const { email, password, fname, lname,phonenumber,referralcode } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    
    const user = User.build({ email, password, fname, lname, phonenumber, referralcode });
    await user.save();
    
    sendWelcomeEmail(user.email)
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };
    
    res.status(201).send(user);
  }
);

export { router as signupRouter };
