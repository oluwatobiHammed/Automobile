
require('dotenv').config({ path: '.env' })
import { app } from './app';
import { mongooseDB } from './db/mongoose';

const start = async () => {
  console.log('Starting up......')
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.PORT) {
    throw new Error('PORT must be defined');
  }
 if (!process.env.STRIPE_KEY) {
  throw new Error('STRIPE_KEY must be defined');
 }
  mongooseDB()
 console.log(process.env.STRIPE_KEY)

  app.listen(3000, () => {
    console.log(`Listening on port ${process.env.PORT}!!!!!!!!`);
  });
};

start();
