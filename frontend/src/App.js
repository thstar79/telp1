import React, {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {Route, Switch} from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignUpFormPage";
import * as sessionActions from "./store/session";
import Top from "./components/Top";
import Navigation from "./components/Navigation";
import BusinessSignupFormPage from "./components/BusinessSignUpFormPage";
import BusinessHome from "./components/BusinessHome";
import BusinessDetail from "./components/BusinessDetail";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(()=>{
    dispatch(sessionActions.restoreUser()).then(()=>setIsLoaded(true));
  },[dispatch]);

  return (
    <>
    <Top isLoaded={isLoaded} />
    {isLoaded && (
      <div className="main">
        <div className='main-left'></div>
        <div className='main-center'>
          <Switch>
            <Route exact path="/">
              <BusinessHome />
            </Route>
            <Route path='/login'>
              <LoginFormPage />
            </Route>
            <Route path="/signup">
              <SignupFormPage />
            </Route>
            <Route path="/business/signup">
              <BusinessSignupFormPage />
            </Route>
            <Route exact path='/business'>
              <BusinessHome />
            </Route>
            <Route path="/business/:businessId">
              <BusinessDetail />
            </Route>
            <Route>
              404 Error
            </Route>
          </Switch>
        </div>
        <div className='main-right'></div>
      </div>
    )}
    </>
  );
}

export default App;
