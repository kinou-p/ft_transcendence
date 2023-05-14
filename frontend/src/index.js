import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/index.css';
// import App from './components/App';
// import Header from './pages/Header';
import Header from './components/Header';
// import Home from './pages/Home.jsx';
// import Login42 from './pages/Login42';
import Head from './pages/Head';
// import Field from './pages/Field';
// import PlayButton from './pages/PlayButton';
import reportWebVitals from './reportWebVitals';
// import Messages from './pages/Messages';
import { BrowserRouter } from 'react-router-dom';
import AnimatedRoute from './components/App';
import './styles/App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className='App'>
	<Head />
	<BrowserRouter>
	<Header />
    	<AnimatedRoute/>
  	</BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
