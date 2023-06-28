import api from "../../script/axiosApi"


function Logout(){
	
	const logout = async () =>{
		
		try {
			await api.post("/logout");	
			localStorage.clear();
			const path = 'http://' + process.env.REACT_APP_BASE_URL + '/'; 
			window.history.pushState({}, '', path);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	}
	logout();
}

export default Logout;