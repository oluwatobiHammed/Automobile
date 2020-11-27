import express, { NextFunction, Request, Response }  from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {  errorHandler, NotFoundError } from '@sgtickets/common';
import timeout from 'connect-timeout'
import { currentUserRouter } from './routes/auth/routes/current-user';

import { signoutRouter } from './routes/auth/routes/signout';
import { signupRouter } from './routes/auth/routes/signup';
import { signinRouter } from './routes/auth/routes/signin';
import { indexVehicleRouter } from './routes/vehicle//routes/index';
import { showVehicleRouter } from './routes/vehicle/routes/show';
import { updateVehicleRouter } from './routes/vehicle/routes/update';
import { currentUser } from './routes/auth/current-user';
import { createVehicleRouter } from './routes/vehicle/routes/new';
import { updateCurrentUserRouter } from './routes/profile/routes/update';
import { currentUserAvatarRouter } from './routes/profile/routes/avatar';
import { showOrderRouter } from './routes/order/routes/show';
import { indexOrderRouter } from './routes/order/routes';
import { newOrderRouter } from './routes/order/routes/new';
import { deleteOrderRouter } from './routes/order/routes/delete';
import { createChargeRouter } from './routes/payements/new';
import { currentUserPasswordUpdateRouter } from './routes/auth/routes/password';
import { currentUserDeleteAvatarRouter } from './routes/profile/routes/delete';
import { showcurrentUserProfileRouter } from './routes/profile/routes/show';
import { forgotPasswordRouter } from './routes/auth/routes/forgot-password';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);


app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);
app.use(updateCurrentUserRouter)
app.use(currentUserAvatarRouter)
app.use(currentUserPasswordUpdateRouter)
app.use(currentUserDeleteAvatarRouter)
app.use(showcurrentUserProfileRouter)
app.use(forgotPasswordRouter)
app.use(currentUser);

app.use(createVehicleRouter);
app.use(showVehicleRouter);
app.use(indexVehicleRouter);
app.use(updateVehicleRouter);

app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter)

app.use(createChargeRouter)
//var timeout = require('connect-timeout')

// example of using this top-level; note the use of haltOnTimedout
// after every middleware; it will stop the request flow on a timeout
//app.use(timeout('1000s'))

//app.use(haltOnTimedout)

// Add your routes here, etc.

function haltOnTimedout (req: Request, res:Response, next: NextFunction) {
  if (!req.timedout) next()
}
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
