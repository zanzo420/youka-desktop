import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GA from 'react-ga';
import App from './App';

GA.initialize('UA-156962391-3');

ReactDOM.render(<App />, document.getElementById('root'));