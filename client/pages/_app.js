import "@/styles/globals.css";
import '../styles/globals.css'
import { Provider } from 'react-redux';
import store from "@/component/redux/store";
import '../component/sidebar/sidebar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.min.js');
  }, []);
  return  (   <Provider store={store}>
  <Component {...pageProps} />
  
  </Provider>
  );
}
