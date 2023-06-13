import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop";
import { Rank } from "../../DataBase/DataRank"
import '../../styles/Messages.css'
import { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import api from "../../script/axiosApi";

const dropIn = {
    hidden:{y:"-100vh",
            opacity: 0,},
    visible:{y: "0",
            opacity: 0,
            transotion:{
                duration:0.1,
                type:"spring",
                damping: 100,
                stiffness: 500,
            }},
    exit:{y: "100vh",
            opacity: 0,},

};

const Modal = ({handleClose, text}) => {
    // const [multi, setMulti] = useState(false);
    const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: ''}]);
    const [selectedOptionArray, setSelectedOptionArray] = useState([]);

    const handleOptionChange = (selectId, selectedOption) => {
		console.log("selected Option=", selectedOption)
        setSelectTag((prevTags) => 
            prevTags.map((tag) =>
                tag.id === selectId ? { ...tag, selectedOption } : tag
            )
        );
    };

    const addNewSelectedTag = () => {
        const newSelectedId = Math.max (...selectTags.map((tag) => tag.id)) + 1;
        setSelectTag([...selectTags, { id: newSelectedId, selectedOption: ''}]);
		console.log(selectTags)
    };

    const saveSelectedOptions = () => {
        // const selectedOptions = selectTags.map((tag) => tag.selectedOption);
		const selectedOptions = selectTags.map((tag) => tag.selectedOption).filter((option) => option !== '');

		console.log("selected= ", selectedOptions);
		//do db stuff here
		const data = {
			members: selectedOptions,
			name: "prout"
		}
		try{
			api.post("/conv", data);
			handleClose();
		} catch(err) {
			console.log(err);
		}
        setSelectedOptionArray(selectedOptions);

    }
    let new_name;
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
                {/* <p>New Conversation</p> */}

				{selectTags.map((selectTag) => (
				  <div key={selectTag.id}>
				    <select
				      value={selectTag.selectedOption}
				      onChange={(a) => handleOptionChange(selectTag.id, a.target.value)}
				    >
				      <option value="">{
				        selectTag.selectedOption ? selectTag.selectedOption : "Select an option"
				      }</option>
				      {Rank.filter((item) => !selectTags.some((tag) => tag.selectedOption === item.name)).map((item, index) => (
				        <option key={index} value={item.name}>
				          {item.name}
				        </option>
				      ))}
				    </select>
				  </div>
				))}


            	<div>
            	    <GrAdd onClick={addNewSelectedTag}/>
            	</div>
            	<div>
            	    <h3>Selected Option:</h3>
            	    <ul>
            	        {selectedOptionArray.map((option, index) => (
            	            <li key={index}>{option}</li>
            	        ))}
            	    </ul>
            	</div>
            	<div className="div_submit">
            	    <Link to='#' className="submit" onClick={ saveSelectedOptions}>Submit</Link>
						
            	    <Link to="#" className="submit" onClick={handleClose}>Cancel</Link>
            	</div>

            </motion.div>
        </Backdrop>
    )
}

export default Modal