import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Vehicle } from '../../../models/Vehicle';



it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/vehicles/${id}`)
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: '2009',
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/vehicles/${id}`)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: '2009',
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(401);
});

it('returns a 401 if the user does not own the vehicle', async () => {
  const response = await request(app)
    .post('/api/vehicles')
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: '2009',
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    });

  await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: '2009',
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title, price, color, condition, year, bodyStyles, transmission ', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/vehicles')
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    });

  await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: '',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(400);

  await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: -10,
      color:'red',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(400);

    await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'',
      condition: 'Foreign Used',
      year: 2009,
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(400);

    await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: '',
      year: 2009,
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(400);

    await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 1992,
      bodyStyles: 'Bus', 
      transmission: 'Automatic'
    })
    .expect(400);

    await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 1992,
      bodyStyles: '', 
      transmission: 'Automatic'
    })
    .expect(400);
    await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 1992,
      bodyStyles: 'Bus', 
      transmission: ''
    })
    .expect(400);
});

it('updates the vehicle provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/vehicles')
    .set('Cookie', cookie)
    .send({
      make: 'toyota',
      price: 10,
      color:'red',
      condition: 'Foreign Used',
      year: 2007,
      bodyStyles: 'Convertible', 
      transmission: 'Automatic'
    });

  await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: "honda",
      price: 1500,
      color : "blue",
      year : 2009,
      condition: "Locally Used",
      bodyStyles: "Bus",
      transmission: "Manual"
    })
    .expect(200);

  const vehicleResponse = await request(app)
    .get(`/api/vehicles/${response.body.id}`)
    .send();

  expect(vehicleResponse.body.make).toEqual('honda');
  expect(vehicleResponse.body.price).toEqual(1500);
  expect(vehicleResponse.body.color).toEqual('blue');
  expect(vehicleResponse.body.condition).toEqual('Locally Used');
  expect(vehicleResponse.body.year).toEqual(2009);
  expect(vehicleResponse.body.bodyStyles).toEqual( 'Bus');
  expect(vehicleResponse.body.transmission).toEqual('Manual');
});

it('rejects updates if the vehicles is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/vehicles')
    .set('Cookie', cookie)
    .send({
      make: "honda",
      price: 1500,
      color : "blue",
      year : 2009,
      condition: "Locally Used",
      bodyStyles: "Bus",
      transmission: "Manual"
    });

  const vehicle = await Vehicle.findById(response.body.id);
  vehicle!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await vehicle!.save();

  await request(app)
    .put(`/api/vehicles/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      make: "Toyota",
      price: 500,
      color : "red",
      year : 2015,
      condition: "Foreign Used",
      bodyStyles: "Convertible",
      transmission: "Automatic"
    })
    .expect(400);
});
