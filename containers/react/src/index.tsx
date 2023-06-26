import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import Head from './pages/Head';
import App from './components/App';

import './styles/index.css';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <div className="App">
	<Head />
	<BrowserRouter>
	<Header />
    	<App/>
  	</BrowserRouter>
  </div>
);
