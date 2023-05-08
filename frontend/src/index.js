import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/index.css';
import App from './components/App';
import Header from './components/Header';
import Home from './components/Home';
import Login42 from './components/Login42';
import Head from './components/Head';
import Field from './components/Field';
import PlayButton from './components/PlayButton';
import reportWebVitals from './reportWebVitals';
import SuccessToken from './script/tokenSuccess'
import { BrowserRouter, Route, Routes} from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
	<Head />
	<Header />
	<BrowserRouter>
    	<Routes>
			<Route exact path="/" element={<Home/>}/>
			<Route exact path="/pong" element={<PlayButton />}/>
			<Route exact path="/pong/play" element={<Field />}/>
			<Route exact path="/login42" element={<Login42 />}/>
			<Route exact path="/token" element={<SuccessToken />}/>
    	</Routes>
  	</BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
