import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import { ProtectedRoute } from './protected.route';




function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login} />
        <ProtectedRoute exact path='/home' component={Home} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>

    </Router>
  )
}

export default App;