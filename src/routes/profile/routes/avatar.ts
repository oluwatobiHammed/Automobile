import express, { NextFunction, Request, Response }  from 'express';
import { currentUser } from '../../auth/current-user';
import sharp from 'sharp'
import { upload } from '../../../events/upload';
import { User } from '../../../models/user';
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@sgtickets/common';
const router = express.Router();

router.patch('/api/users/me/avatar',  currentUser,upload.single('avatar'),
  async (req: Request, res:Response) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['avatar']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
      throw new BadRequestError('Invalid Request!');
  }
if(req.file.size > 1000000){
  throw new BadRequestError('image File too large');
}
    if (!req.file.buffer) {
      throw new BadRequestError('image file not found');
    }
  const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
 

  if(req.currentUser === undefined){
    throw new NotAuthorizedError()
  }
  const email = req.currentUser!.email
   const user = await User.findOne({email})

  if (!user) {
    throw new NotFoundError();
  }


  if (user.id !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  user.set({avatar: buffer})

  await user.save()

  res.send(user)
}, (error:Error, req:Request, res:Response, next:NextFunction) =>{
  throw new BadRequestError(error.message);
} )

export { router as currentUserAvatarRouter };