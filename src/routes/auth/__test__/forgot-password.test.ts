import request from 'supertest';
import { app } from '../../../app';


it('returns a 400 for invalid request', async () => {
  await request(app)
    .patch('/api/users/me/forgot-password')
    .send({
      email: "test@test.com",
      password: ''
    }).expect(400);

    await request(app)
    .patch('/api/users/me/forgot-password')
    .send({
      email: " ",
      password: 'password'
    }).expect(400);
   
});


it('returns a 400 if the user want to use already used password', async () => {
   await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password',
    fname: "Oluwatobi",
    lname:"Oladipupo",
    phonenumber: "+2347031367721"
  })
  .expect(201);

  await request(app)
    .patch('/api/users/me/forgot-password')
    .send({
      email: "test@test.com",
      password: 'password'
    })
    .expect(400);
});

it('returns a 404 if the user password you want to update does not exist', async () => {
  await request(app)
 .post('/api/users/signup')
 .send({
   email: 'test@test.com',
   password: 'password',
   fname: "Oluwatobi",
   lname:"Oladipupo",
   phonenumber: "+2347031367721"
 })
 .expect(201);

 await request(app)
   .patch('/api/users/me/forgot-password')
   .send({
     email: "test@test12.com",
     password: 'password'
   })
   .expect(404);
});