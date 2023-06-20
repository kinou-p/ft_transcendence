import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import queryString from 'query-string';
import api from "./axiosApi.tsx";
import axios from 'axios';

function SuccessToken() {
	const location = useLocation();
	const { data } = queryString.parse(location.search);
	const [code, setCode] = useState('');
	const [user, setUser] = useState(false);
  
	useEffect(() => {
	  if (!data) {
		console.log("No data");
		return;
	  }
  
	  const cleanData = data.slice(1, -1); // Declare cleanData here
  
	  const getUser = async () => {
		try {
		  const tmpUser = await axios({
			method: 'GET',
			url: 'http://' + process.env.REACT_APP_BASE_URL + '/api/profile',
			headers: {
			  Authorization: `Bearer ${cleanData}`,
			},
			withCredentials: true,
		  });
		  setUser(tmpUser.data);
		} catch (err) {
		  console.log(err);
		}
	  };
  
	  getUser();
	}, [data]);
  
	const handleKeyPress = async (e)=>{
		// console.log(`e in press= ${e.key}`)
		if (e.key !== "Enter")
			return ;
		try{
			console.log("code= ", code)
			// const res = await api.post("/verifyOtp", {token: code})


			const res = await axios({
				method: 'POST',
				url: 'http://' + process.env.REACT_APP_BASE_URL + '/api/verifyOtp',
				headers: {
				  Authorization: `Bearer ${cleanData}`,
				},
				withCredentials: true,
				data: { token: code }
			  });

			console.log("res= ", res.data)
			console.log("res= ", res)
			if (res.data === 1)
			{
				console.log("registered")
				// history.push('/login')
	
				localStorage.setItem('token', `${cleanData}`);
				console.log(`prout token2= ${localStorage.getItem('token')}`);
				window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");

				// const path = 'http://' + process.env.REACT_APP_BASE_URL + '/'; 
				// window.history.pushState({}, '', path);
				// window.location.reload();
	
			}
			else
			{
				console.log("bad code")
				//alert ?? retry
			}
			// redirect('/test')
		} 
		catch(err){
			 console.log(err)
		}
	}


  
	if (!user) {
	  // Render a loading indicator or return null while user is being fetched
	  return <h1>Loading...</h1>;
	}
  
	const cleanData = data.slice(1, -1); // Declare cleanData here as well
  
	if (!user.otp_verified) {
	  console.log("false");
	  localStorage.setItem('token', `${cleanData}`);
	  console.log(`prout token2= ${localStorage.getItem('token')}`);
	  window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
	  return null; // or return a message or component indicating not verified
	}
  
	return (
		<>
		  <h1>Double Auth</h1>
		  <input
			onKeyDown={handleKeyPress}
			type="text"
			className="qr"
			placeholder="6 Digits Code"
			value={code}
			onChange={(e) => setCode(e.target.value)}
		  />
		</>
	  );
	}
	
	export default SuccessToken;

// function SuccessToken() {

//   const location = useLocation();
//   const { data } = queryString.parse(location.search);

//   if ( !data)
//   {
// 	console.log("no data")
//   	return ;
//   }
//   const cleanData = data.slice(1, -1);


//   const [code, setCode] = useState('');
//   const [user, setUser] = useState(false);

//   useEffect(()=> {

// 	const getUser = async ()=>{
// 		try {
// 			// const tmpUser = await api.get("/profile");

// 			const tmpUser = await axios({
// 				method: 'GET',
// 				url: 'http://' + process.env.REACT_APP_BASE_URL + '/api/profile',
// 				headers: {
// 				  Authorization: `Bearer ${cleanData}`,
// 				},
// 				withCredentials: true,
// 			  });
// 			  setUser(tmpUser.data);

// 			// setUser(tmpUser.data);
// 			// if (tmpUser.data.otp_verified)
// 			// {
// 			// 	console.log("true");
// 			// 	return (
// 			// 		<>
// 			// 		<h1>Double Auth</h1>
// 			// 		<input
// 			// 		  onKeyDown={handleKeyPress}
// 			// 		  type="text"
// 			// 		  className="qr"
// 			// 		  placeholder="6 Digits Code"
// 			// 		  value={code}
// 			// 		  onChange={(e) => setCode(e.target.value)}
// 			// 		/>
// 			// 	  </>
// 			// 	)
// 			// }
// 			// else 
// 			// {
// 			// 	console.log("false");
// 			// 	localStorage.setItem('token', `${cleanData}`);
// 			// 	console.log(`prout token2= ${localStorage.getItem('token')}`)
// 			// 	window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
// 			// }
// 		} catch(err) {
// 			console.log(err)
// 		}
// 	}
// 	getUser();
//   }, []);

//   const handleKeyPress = async (e)=>{
// 	// console.log(`e in press= ${e.key}`)
// 	if (e.key !== "Enter")
// 		return ;
// 	try{
// 		console.log("code= ", code)
// 		const res = await api.post("/verifyOtp", {token: code})
// 		console.log("res= ", res.data)
// 		console.log("res= ", res)
// 		if (res.data === 1)
// 		{
// 			console.log("registered")
// 			// history.push('/login')

// 			const path = 'http://' + process.env.REACT_APP_BASE_URL + '/'; 
// 			window.history.pushState({}, '', path);
// 			window.location.reload();

// 		}
// 		else
// 		{
// 			console.log("bad code")
// 			//alert ?? retry
// 		}
// 		// redirect('/test')
// 	} 
// 	catch(err){
// 		 console.log(err)
// 	}
//   }


//   console.log("start while...")
//   while(user === false)
//   	;
//   console.log("end while")
//   if (!user.otp_verified)
//   {
// 	console.log("false");
// 	localStorage.setItem('token', `${cleanData}`);
// 	console.log(`prout token2= ${localStorage.getItem('token')}`)
// 	window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
// 	return ;
//   }
  
//   return (
// 	  <>
// 		<h1>Double Auth</h1>
// 		<input
// 		  onKeyDown={handleKeyPress}
// 		  type="text"
// 		  className="qr"
// 		  placeholder="6 Digits Code"
// 		  value={code}
// 		  onChange={(e) => setCode(e.target.value)}
// 		/>
// 	  </>
//   )


// }

// export default SuccessToken;
