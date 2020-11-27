import mongoose from 'mongoose';

export const mongooseDB = async () => {
    if (!process.env.MONGODB_URL) {
        throw new Error('MONGO_URI_AUTH must be defined');
      }
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        });
         console.log('Connected to  MongoDB');
      } catch (err) {
        console.error(err);
      }
}





