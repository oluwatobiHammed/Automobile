import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';
require('dotenv').config({ path: '.env' })

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      signinAuth(): Promise<string[]>;
    }
  }
}

process.env.STRIPE_KEY = 'sk_test_51HklRLLBtrFc51DoZ8fK4pwxstbYA4Bdi4EI5npJWd0ZeaLyEPofVoaTKbPKj9dxE0TaTgAM6OgCptFKzlcxjLZ900OuzPSIah';
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY! = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };



  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};

global.signinAuth = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
