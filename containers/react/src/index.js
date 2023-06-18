import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import reportWebVitals from './reportWebVitals';
import Header from './components/Header.tsx';
import Head from './pages/Head.tsx';
import App from './components/App.tsx';

import './styles/index.css';
import './styles/App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className="App">
	<Head />
	<BrowserRouter>
	<Header />
    	<App/>
  	</BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
