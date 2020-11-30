import '../node_modules/bootstrap/dist/css/bootstrap.css';
import axios from '../node_modules/axios';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log(currentUser);
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};
export const getStaticProps = async (appContext) => {
  //const client = buildClient(appContext.ctx);
  const { data } = await axios.get(
    'http://localhost:3000/api/users/currentuser'
  );

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getStaticProps(
      appContext.ctx,
      data.currentUser
    );
  }

  return { props: { pageProps, ...data } };
};

export default AppComponent;
