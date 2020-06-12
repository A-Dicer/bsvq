import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Controller from "./pages/Controller";
import Display from "./pages/Display";
import Receiver from "./pages/Receiver";
import Info from "./pages/Info";

const App = () =>
  <Router>
    <div>
      <Switch>
        <Route exact path="/controller/:id" component={Controller} />
        <Route exact path="/display/:id" component={Display} />
        <Route exact path="/receiver/:id" component={Receiver} />
        <Route component={Info} />
      </Switch>
    </div>
  </Router>;

export default App;
