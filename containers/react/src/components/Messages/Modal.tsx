import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop.tsx";
import { Rank } from "../../DataBase/DataRank"
import '../../styles/Messages.css'
import { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";

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
    const [multi, setMulti] = useState(false);
    const [selectTags, setSelectTag] = useState([{ id: 1, selectedOption: ''}]);
    const [selectedOptionArray, setSelectedOptionArray] = useState([]);

    const handleOptionChange = (selectId, selectedOption) => {
        setSelectTag((prevTags) => 
            prevTags.map((tag) =>
                tag.id === selectId ? { ...tag, selectedOption } : tag
            )
        );
    };

    const addNewSelectedTag = () => {
        const newSelectedId = Math.max (...selectTags.map((tag) => tag.id)) + 1;
        setSelectTag([...selectTags, { id: newSelectedId, selectedOption: ''}]);
    };

    const saveSelectedOptions = () => {
        const selectedOptions = selectTags.map((tag) => tag.selectedOption);
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
                <p>New Convewrstion</p>

{/* First selection  */}

                <select className="custom-select"
                onChange={(e) => {
                    const selection = e.target.value;
                    selection === "group" ? setMulti(true) : setMulti(false)
                }}>
                    <option value="1v1">1v1</option>
                    <option value="group">Group</option>
                </select>

{/* Second selection  */}
                {selectTags.map((selectTag) =>(
                    <div key={selectTag.id}>

                    <select 
                        value={selectTag.selectedOption}
                        onChange={(a) => handleOptionChange(selectTag.id, a.target.value)}>
                    {Rank.map((item, index) => {
                        return (
                            <>
                            <option value={new_name}>{item.name}</option>
                            
                            </>
                        )
                    })}
                    </select>           
                    </div>
                ))
                }
                <div>
                    <h3>Selected Option:</h3>
                    <ul>
                        {selectedOptionArray.map((option, index) => (
                            <li key={index}>{option}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    {multi === true ? (
                    <GrAdd onClick={addNewSelectedTag}/>) : " "}
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