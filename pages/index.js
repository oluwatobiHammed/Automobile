import Link from 'next/link';
import axios from 'axios';

const LandingPage = ({ currentUser, vehicles }) => {
  const vehicleList = vehicles.results.map((vehicle) => {
    return (
      <tr key={vehicle.id}>
        <td>{vehicle.make}</td>
        <td>{vehicle.price}</td>
        <td>{vehicle.color}</td>
        <td>{vehicle.condition}</td>
        <td>{vehicle.bodyStyles}</td>
        <td>{vehicle.transmission}</td>
        <td>{vehicle.year}</td>
        <td>
          <Link href="/vehicles/[vehicleId]" as={`/vehicles/${vehicle.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Vehicles</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Make</th>
            <th>Price</th>
            <th>Color</th>
            <th>Condition</th>
            <th>BodyStyles</th>
            <th>Transmission</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>{vehicleList}</tbody>
      </table>
    </div>
  );
};

export const getStaticProps = async (context, currentUser) => {
  const { data } = await axios.get('http://localhost:3000/api/vehicles');

  return { props: { vehicles: data } };
};

export default LandingPage;
