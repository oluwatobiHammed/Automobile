import { NotAuthorizedError, NotFoundError, requireAuth } from '@sgtickets/common';
import express from 'express';
import { User } from '../../../models/user';
import { currentUser } from '../../auth/current-user';


const router = express.Router();

router.get('/api/users/me', currentUser,
async (req, res) => {
 
  if(req.currentUser === undefined){
    throw new NotAuthorizedError()
  }
  const email = req.currentUser!.email
   const user = await User.findOne({email})

   if (!user) {
    throw new NotFoundError();
  }


  if (user.email !== req.currentUser!.email) {
    throw new NotAuthorizedError();
  }
  res.send(user);
});

router.get('/api/users/me/avatar', 
async (req, res) => {
 
  if(req.currentUser === undefined){
    throw new NotAuthorizedError()
  }
   const email = req.currentUser!.email
   const user = await User.findOne({email})

   if (!user) {
    throw new NotFoundError();
  }


  if (user.email !== req.currentUser!.email) {
    throw new NotAuthorizedError();
  }
  res.set('Content-Type', 'image/jpg')
   res.send(user.avatar);
});

export { router as showcurrentUserProfileRouter };