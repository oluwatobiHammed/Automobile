import { BodyStyles } from "../../events/types/BodyStyles";
import { SellingCondition } from "../../events/types/SellingCondition";
import { Transmission } from "../../events/types/Transmission";
import { Vehicle } from "../Vehicle";



it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const vehicle = Vehicle.build({
    make: 'toyota',
    price: 20,
    userId: '123',
    color:'red',
    condition: SellingCondition.foreignUsed,
    year: 2009,
    bodyStyles: BodyStyles.Bus, 
    transmission: Transmission.Automatic,
    carRating: 0
  });

  // Save the ticket to the database
  await vehicle.save();

  // fetch the ticket twice
  const firstInstance = await Vehicle.findById(vehicle.id);
  const secondInstance = await Vehicle.findById(vehicle.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  secondInstance!.set({ make: 'toyota' });
  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const vehicle = Vehicle.build({
    make: 'toyota',
    price: 20,
    userId: '123',
    color:'red',
    condition: SellingCondition.foreignUsed,
    year: 2009,
    bodyStyles: BodyStyles.Bus, 
    transmission: Transmission.Automatic,
    carRating: 0

  });

  await vehicle.save();
  expect(vehicle.version).toEqual(0);
  await vehicle.save();
  expect(vehicle.version).toEqual(1);
  await vehicle.save();
  expect(vehicle.version).toEqual(2);
});
