import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/index.css';
import App from './components/App';
import Header from './components/Header';
// import Home from './components/Home';
// import Login42 from './components/Login42';
import Head from './components/Head';
// import Field from './components/Field';
// import PlayButton from './components/PlayButton';
import reportWebVitals from './reportWebVitals';
// import SuccessToken from './script/tokenSuccess'
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'

// let redirectToUrl;
//       if (localStorage.getItem('token') !== null) //check condition
//       {
//         redirectToUrl = <Navigate to='/'/>;
//       }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
	<Head />
	<Header />
	<BrowserRouter>
		<App></App>
  	</BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

{/* <Route exact path="/login42" element={<Login42 />}/> */}
    	// <Routes>
		// 	{/* {redirectToUrl} */}
		// 	<Route exact path="/" element={<Home/>}/>
		// 	<Route exact path="/pong" element={<PlayButton />}/>
		// 	<Route exact path="/pong/play" element={<Field />}/>
		// 	<Route exact path="/token" element={<SuccessToken />}/>

		// 	<Route path='*' element={<Navigate to='/' />} />

		// 	{/* <Route path="*"><Navigate to="/" /></Route>
		// 	 */}
        	
		// 	{/* Gestion des pages inexistantes */}

		// 	{/* -------  ROUTE FOR CHAT APP HERE ---------  */}
		// 	{/* <Route exact path="/chat" element={<NOM DU COMPONENT == index dans le tuto/>}/> */}



    	// </Routes>