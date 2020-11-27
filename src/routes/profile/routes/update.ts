import express, { Request, Response } from 'express';
import { currentUser } from '../../auth/current-user';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, NotFoundError, requireAuth, NotAuthorizedError } from '@sgtickets/common';
import { User } from '../../../models/user';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.put('/api/users/currentuser',
  [
    body('fname').not().isEmpty().withMessage('First Name must be valid'),
    body('lname').not().isEmpty().withMessage('Last Name must be valid'),
    body('phonenumber')
    .trim()
    .isLength({ min: 11, max: 15 })
    .withMessage('Phone Number must be between 4 and 20 characters'),
  ],
  validateRequest, currentUser,requireAuth,
  async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['fname', 'lname', 'phonenumber']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      throw new BadRequestError('Invalid updates!');
  }
    const { fname, lname,phonenumber,referralcode } = req.body;
    if(req.currentUser === undefined){
      throw new NotAuthorizedError()
    }
    const email = req.currentUser!.email
    const existingUser = await User.findOne({ email });
  
    if (!existingUser) {
      throw new NotFoundError();
    }
  
      existingUser.set({
        fname,
        lname,
        phonenumber,
        referralcode
      })
      await existingUser.save();
  
       // Generate JWT
       const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );
  
      // Store it on session object
      req.session = {
        jwt: userJwt,
      };
  
      res.send(existingUser);
    
   
     
    
 
});

export { router as updateCurrentUserRouter };
