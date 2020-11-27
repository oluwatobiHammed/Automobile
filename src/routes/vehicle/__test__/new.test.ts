import request from 'supertest';
import { app } from '../../../app';
import { BodyStyles } from '../../../events/types/BodyStyles';
import { SellingCondition } from '../../../events/types/SellingCondition';
import { Transmission } from '../../../events/types/Transmission';
import { Vehicle } from '../../../models/Vehicle';


it('has a route handler listening to /api/s for post requests', async () => {
  const response = await request(app).post('/api/vehicles').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/vehicles').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid make is provided', async () => {
  await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: '',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Convertible', 
      transmission: 'Automatic'
    })
    .expect(400);

  await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: 'Honda',
      price: -10,
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Convertible', 
      transmission: 'Automatic'
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      price: - 10,
      color:'red',
      condition: SellingCondition.foreignUsed,
      year: 2009,
      bodyStyles: BodyStyles.Bus, 
      transmission: Transmission.Automatic
    })
    .expect(400);

  await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Convertible', 
      transmission: 'Automatic'
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let vehicles = await Vehicle.find({});
  expect(vehicles.length).toEqual(0);

  const make = 'toyota';

  await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      price: 20,
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Convertible', 
      transmission: 'Automatic'
    })
    .expect(201);

  vehicles = await Vehicle.find({});
  expect(vehicles.length).toEqual(1);
  expect(vehicles[0].price).toEqual(20);
  expect(vehicles[0].make).toEqual('toyota');
  expect(vehicles[0].color).toEqual('red');
  expect(vehicles[0].condition).toEqual('Foreign Used');
  expect(vehicles[0].year).toEqual(2009);
  expect(vehicles[0].bodyStyles).toEqual('Convertible');
  expect(vehicles[0].transmission).toEqual('Automatic');
  
});


