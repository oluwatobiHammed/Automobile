import request from 'supertest';
import { app } from '../../../app';



const createVehicle = async () => {
  
  return request(app).post('/api/vehicles').set('Cookie', global.signin()).send({
    make: "Honda",
    price: 1500,
    color : "Blue",
    year : 1995,
    condition: "Foreign Used",
    bodyStyles : "Convertible",
    transmission: "Automatic"
  });
};

it('can fetch a list of vehicles', async () => {
  await createVehicle();
  await createVehicle();
  await createVehicle();

  const response = await request(app).get('/api/vehicles').send().expect(200);

  expect(response.body.length).toEqual(3);
});
