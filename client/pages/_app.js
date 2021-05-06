import 'bootstrap/dist/css/bootstrap.css';

import Header from '../components/header';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const response = await client.get('/api/users/currentuser');

  let pageProps;

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(
      ctx,
      client,
      response.data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: response.data.currentUser,
  };
};

export default AppComponent;
