import request from 'supertest';
import { app } from '../../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'password',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'p',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(400);
});

it('returns a 400 with an invalid first name', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'p',
      fname: "",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(400);
});

it('returns a 400 with an invalid last name', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'p',
      fname: "Oluwatobi",
      lname:"",
      phonenumber: "+2347031367721"
    })
    .expect(400);
});

it('returns a 400 with an invalid phone number', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'alskdflaskjfd',
      password: 'p',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+234701"
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'alskjdf',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
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
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      fname: "Oluwatobi",
      lname:"Oladipupo",
      phonenumber: "+2347031367721"
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
