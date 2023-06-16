import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop";
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

const ModalSetting = ({handleClose, text}) => {
    const [password, setPassword] = useState(false);

    const handleCheckpass = (e) => {
        setPassword(e.target.checked);
    }
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
                className="modalSetting"
                variant={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* <p>New Convewrstion</p> */}

{/* First selection  */}
                <div className="settingFirstPart">
                    <div>
                        <p className="checkbox">Private  <input class="check"type="checkbox" value="private"/></p>
                        <p className="checkbox">PassW <input type="checkbox" value="password" checked={password} onChange={handleCheckpass}/> </p>
                        {password ? (<input type="text" className="in" placeholder="password"/>):("")}
                    </div>
                    <div className="forName">
                        <input type="text" className="in" placeholder="group name"/>
                    </div>
                </div>

                {/* <select
                onChange={(e) => {
                    const selection = e.target.value;
                    selection === "group" ? setMulti(true) : setMulti(false)
                }}>
                    <option value="1v1">1v1</option>
                    <option value="group">Group</option>
                </select> */}

{/* Second selection  */}
                
                <div className="settingSecondPart">
                    <Link to="#" className="submit" onClick={handleClose}>Send</Link>

                    {selectTags.map((selectTag) =>(
                    <div key={selectTag.id}>

                    <select 
                        value={selectTag.selectedOption}
                        onChange={(a) => handleOptionChange(selectTag.id, a.target.value)}>
                    {Rank.map((item, index) => {
                        return (
                            <>
                            <option >Select a name</option>
                            <option value={new_name}>{item.name}</option>
                            
                            </>
                        )
                    })}
                    </select>           
                    </div>
                ))
                }
                <div>
                    <Link to="#" className="submit">Ban</Link>
                    <Link to="#" className="submit">Mute</Link>
                    <Link to="#" className="submit">Admin</Link>
                </div>

                </div>
                {/* {selectTags.map((selectTag) =>(
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
                </div> */}

            </motion.div>
        </Backdrop>
    )
}

export default ModalSetting