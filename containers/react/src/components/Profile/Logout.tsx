import React from "react";
import api from "../../script/axiosApi"


function Logout(){
	const logout = async () =>{

		try {
			await api.post("/logout")	
		} catch (err) {
			console.log(err);
		}
	}

	logout();
	localStorage.clear();
	const path = 'http://' + process.env.REACT_APP_BASE_URL + '/'; 
	// history(path, { replace: true });
	// window.location.replace(path);
	// window.history.pushState({}, '', path);
	window.history.pushState({}, '', path);
	window.location.reload();
	return (<></>)
}

export default Logout;