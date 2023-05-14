import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "../styles/App.css";
 
import Field from './Field';
import PlayButton from './PlayButton';
import SuccessToken from '../script/tokenSuccess'
import Home from './Home';

import api from '../script/axiosApi';

// import Login42 from './Login42';

//   const navigate = useNavigate();
  
//   const [isLoggedIn, setisLoggedIn] = useState(false);
//   useEffect(() => {
//     if (!localStorage.getItem('token'))
// 	{
//       navigate("/");
//     }
// 	else 
// 	{
// 		setisLoggedIn(true);
//     }
//   },);

function App() {
 
	useEffect(() => {
		const handleUnload = async (event) => {
			await api.post('/quit');
		  // Custom logic when the user is quitting the app
		  // You can perform any necessary cleanup or trigger actions here
		  // This function will be called when the user leaves the app
		};
	
		// Add the event listener when the component mounts
		window.addEventListener('beforeunload', handleUnload);
	
		// Remove the event listener when the component unmounts
		return () => {
		  window.removeEventListener('beforeunload', handleUnload);
		};
	  }, []);

	return (
	  <>
    	<Routes>
			<Route exact path="/" element={<Home/>}/>
			<Route exact path="/pong" element={<PlayButton />}/>
			<Route exact path="/pong/play" element={<Field />}/>
			<Route exact path="/token" element={<SuccessToken />}/>

			<Route path='*' element={<Navigate to='/' />} />

    	</Routes>
      </>
	);
}

export default App;

// {/* <Route path="*"><Navigate to="/" /></Route>
//  */}

// {/* Gestion des pages inexistantes */}

// {/* -------  ROUTE FOR CHAT APP HERE ---------  */}
// {/* <Route exact path="/chat" element={<NOM DU COMPONENT == index dans le tuto/>}/> */}


// {/* <Routes>
// {/* {redirectToUrl} */}
// <Route exact path="/" element={<Home/>}/>
// <Route exact path="/pong" element={<PlayButton />}/>
// <Route exact path="/pong/play" element={<Field />}/>
// <Route exact path="/token" element={<SuccessToken />}/>

// <Route path='*' element={<Navigate to='/' />} />

// {/* <Route path="*"><Navigate to="/" /></Route>
//  */}

// {/* Gestion des pages inexistantes */}

// {/* -------  ROUTE FOR CHAT APP HERE ---------  */}
// {/* <Route exact path="/chat" element={<NOM DU COMPONENT == index dans le tuto/>}/> */}



// </Routes> */}