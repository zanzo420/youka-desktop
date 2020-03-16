import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import ReactGA from 'react-ga';
import { hot } from 'react-hot-loader';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Eula, { accepted } from './pages/Eula'
import Init, { initialized } from './pages/Init'
import { ua } from './config'
import { stats, useUser } from './lib/hooks'
import 'semantic-ui-css/semantic.min.css'
import 'tailwindcss/dist/tailwind.min.css'
import './index.css'

function App() {
  if (!accepted()) {
    return <Eula />
  }

  if (!initialized()) {
    return <Init />
  }

  if (stats) {
    const user = useUser()
    ReactGA.initialize(ua, {
      gaOptions: {
        userId: user
      }
    });
  }

  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/watch/:youtubeID' component={Watch} />
      </Switch>
    </Router>
  );
}

export default hot(module)(App);
