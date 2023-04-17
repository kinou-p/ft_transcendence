import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/index.css';
import App from './components/App';
import Header from './components/Header';
import Home from './components/Home';
import Head from './components/Head';
import Field from './components/Field';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes} from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	{/* <Router>
		<Route exact path="/">
    		<Header />
			<Field />
		</Route>
		<Route exact path="/pong">
    		<Header />
			<Field />
		</Route>
	</Router> */}
	<Head />
	<Header />
	<BrowserRouter>
    	<Routes>
			<Route exact path="/" element={<Home/>}/>
    			{/* <Header />
				<Field />
			</Route> */}
			<Route exact path="/pong" element={<Field />}/>
    			{/* <Header />
				<Field />
			</Route> */}
    	</Routes>
  	</BrowserRouter>,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
