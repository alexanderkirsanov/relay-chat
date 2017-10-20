import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import {render} from 'react-dom';

render(<ChatApp />, document.getElementById('app-root'));
