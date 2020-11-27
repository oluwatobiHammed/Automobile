import express, { Request, Response }  from 'express';
import { currentUser } from '../../auth/current-user';
import { upload } from '../../../events/upload';
import { User } from '../../../models/user';
import { NotAuthorizedError, NotFoundError, requireAuth, } from '@sgtickets/common';
const router = express.Router();

router.delete('/api/users/me/avatar',  currentUser,upload.single('avatar'),
  async (req: Request, res:Response) => {
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

  user.set({avatar: undefined})

  await user.save()

  res.send(user)
})
router.delete('/api/users/me',  currentUser,
async (req: Request, res:Response) => {

 const email = req.currentUser!.email
 const user = await User.findOne({email})

if (!user) {
  throw new NotFoundError();
}
if (user.email !== req.currentUser!.email) {
  throw new NotAuthorizedError();
}

await user.remove()

res.send(user)
})



export { router as currentUserDeleteAvatarRouter };