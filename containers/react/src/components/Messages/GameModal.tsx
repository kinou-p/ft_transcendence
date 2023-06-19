import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
import '../../styles/Messages.css';
import { useState, useEffect } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import api from "../../script/axiosApi.tsx";
import React from "react";
// import { useNavigate } from "react-router-dom";

const dropIn = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 100,
      stiffness: 500,
    },
  },
  exit: { y: "100vh", opacity: 0 },
};

const GameModal = ({ handleClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [convs, setConvs] = useState([]);
  const [channel, setChannel] = useState('');

//   const history = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tmpUsers = await api.get("/users");
        const tmpConvs = await api.get("/convs");
        setUsers(tmpUsers.data);
        setConvs(tmpConvs.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const joinChannel = async () => {
    try {
      await api.post("/join", { convId: channel });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckButtonClick = () => {
    // Perform your check action here
    console.log("Checking user:", selectedUser);
  };

  const handleButtonClick = () => {
	// let path = `play?`;
	let path = `http://` + process.env.REACT_APP_BASE_URL + `/pong/play?`;
	
	const superpowerCheckbox = document.querySelector('input[value="superpower"]');
	if (superpowerCheckbox.checked) {
	  path += 'superpower=true&';
	}
  
	const obstacleCheckbox = document.querySelector('input[value="obstacle"]');
	if (obstacleCheckbox.checked) {
	  path += 'obstacle=true&';
	}
  
	const speedCheckbox = document.querySelector('input[value="speed"]');
	if (speedCheckbox.checked) {
	  path += 'speed=true&';
	}

	if (selectedUser.length > 0)
		path += 'username=' + selectedUser;//important here
  
	// Remove the trailing '&' character
	// path = path.slice(0, -1);
	// console.log(path)

	// console.log("path= ", path)
	// history(path, { replace: true });
	// window.location.replace(path);
	window.history.pushState({}, null, path);
	window.location.reload(false);

	// history(path);
  };

  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal"
        variant={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div>
          <select value={selectedUser} onChange={handleUserChange}>
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

		<div className="notClicked" id="canvas_container">
			{/* <button onClick={handleButtonClick}>Draw on Canvas</button> */}
			<div className='checkbox'>
				<p><input type="checkbox" value="superpower"/> Super Power </p>
				<p><input type="checkbox" value="obstacle"/> Obstacle </p>
				<p><input type="checkbox" value="speed"/> Faster and Faster </p>
			</div>
			<button className="submit" onClick={handleButtonClick} >Play</button>
          	<button className="submit" onClick={handleClose}>Cancel</button>
		</div>

        {/* <div className="div_submit">
          <button className="submit" onClick={handleCheckButtonClick}>
            Invite to play
          </button>
        </div> */}
      </motion.div>
    </Backdrop>
  );
};

export default GameModal;
