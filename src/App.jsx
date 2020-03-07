import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { hot } from "react-hot-loader";
import Home from './pages/Home';
import Watch from './pages/Watch';
import 'semantic-ui-css/semantic.min.css'
import 'tailwindcss/dist/tailwind.min.css'
import './index.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/watch/:youtubeID" component={Watch} />
      </Switch>
    </Router>
  );
}

export default hot(module)(App);
