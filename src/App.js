import './App.css';
import AllRoute from './components/AllRoute';
import { ContextProvider } from './context/ContextProvider';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setupFetchInterceptor } from './Inteceptor/setupFetchInterceptor';

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const token = Cookies.get("token");
  //   const profile = Cookies.get("profile");
  //   if (token && profile) {
  //     dispatch({ type: "LOGIN_SUCCESS", payload: { token: token, result: JSON.parse(profile) } });
  //   } else {
  //     dispatch({ type: "LOGIN_FAILURE", error: "No token or profile found" });
  //   }
  // }, []);
  useEffect(() => {
    setupFetchInterceptor(); 
  }, []);
  return (
    <ContextProvider>
      <AllRoute />
    </ContextProvider>
  );
}

export default App;

