
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Header from '../components/Header.tsx';
import Head from './Head.tsx';
import App from '../components/App.tsx';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';
import './styles/App.css'

ReactDOM.render(
  <html >
     	<Head />
   	<BrowserRouter>
   	<Header />
    	<App />
   	</BrowserRouter>
  </html>,
  document.getElementById('root') as HTMLElement
);


