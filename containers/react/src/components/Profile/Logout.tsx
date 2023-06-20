import React from "react";



function Logout(){

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