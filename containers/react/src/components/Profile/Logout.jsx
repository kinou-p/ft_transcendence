


function Logout(){

	localStorage.clear();
	const path = `http://localhost/`; 
	// history(path, { replace: true });
	// window.location.replace(path);
	// window.history.pushState({}, '', path);
	window.history.pushState({}, null, path);
	window.location.reload(false);
}

export default Logout;