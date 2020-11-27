import request from 'supertest';
import { app } from '../../../app';


it('returns a 400 for invalid request', async () => {
  const cookie = await global.signinAuth();
  await request(app)
    .patch('/api/users/me')
    .set('Cookie', cookie)
    .send({
      password: ''
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
    const cookie = await global.signin();
  await request(app)
    .patch('/api/users/me')
    .set('Cookie', cookie)
    .send({
      password: 'password'
    }).expect(400);
  
});

it('returns a 401 if the unatheticated user what to change password', async () => {
 
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
    .patch('/api/users/me')
    .send({
      password: 'password'
    }).expect(401);
  
});