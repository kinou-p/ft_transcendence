import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
import '../../styles/Messages.css';
import { useState, useEffect } from "react";
import api from "../../script/axiosApi.tsx";
import React from "react";
import {User} from "../../../interfaces.tsx"

interface ModalGame {
	handleClose: Function,
}

const GameModal = ({ handleClose }: ModalGame) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tmpUsers = await api.get("/users");
        setUsers(tmpUsers.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleUserChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedUser(event.target.value);
  };


  const handleButtonClick = async () => {
	let path = `http://` + process.env.REACT_APP_BASE_URL + `/pong/play?`;
	

	const superpowerCheckbox = document.querySelector<HTMLInputElement>('input[value="superpower"]');
	if (superpowerCheckbox && superpowerCheckbox.checked) {
	  path += 'superpower=true&';
	}
  

	const speedCheckbox = document.querySelector<HTMLInputElement>('input[value="speed"]');
	if (speedCheckbox && speedCheckbox.checked) {
	  path += 'speed=true&';
	}

	if (selectedUser.length > 0)
		path += 'username=' + selectedUser;
  
	window.history.pushState({}, '', path);
	window.location.reload();

  };

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div>
          <select value={selectedUser} onChange={handleUserChange}>
            <option value="">Select a user</option>
            {users.map((user: User) => (
              <option key={user.id} value={user.username}>
                {user.nickname}
              </option>
            ))}
          </select>
        </div>

		<div className="notClicked" id="canvas_container">
			<div className='checkbox'>
				<p><input type="checkbox" value="superpower"/> Super Power </p>
				<p><input type="checkbox" value="speed"/> Faster and Faster </p>
			</div>
			<button className="playInvite" onClick={handleButtonClick} >Play</button>
		</div>
      </motion.div>
    </Backdrop>
  );
};

export default GameModal;
