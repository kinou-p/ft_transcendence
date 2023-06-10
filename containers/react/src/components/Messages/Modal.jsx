import { motion } from "framer-motion";
import Backdrop from "../Sidebar/Backdrop";
import { Rank } from "../../DataBase/DataRank"
import '../../styles/Messages.css'
import { useState } from "react";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import AddSelectTag from "./AddSelectTag";

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
    // const addButton = document.getElementById('addButton');
    // const selectContainer = document.getElementById('selectContainer');
    // let selectCount = 0;
    // function addSelectTag(){
    //     selectCount++;
    //     const select = document.createElement('select');
    //     select.name = `select${selectCount}`;

    //     const opt1 = document.createElement('option');
    //     opt1.value = 'opt1';
    //     opt1.text = 'opt1';

    //     const opt2 = document.createElement('option');
    //     opt2.value = 'opt2';
    //     opt2.text = 'opt2';

    //     select.appendChild(opt1);
    //     select.appendChild(opt2);

    //     selectContainer.appendChild(select);
    // }
    function try_me()
    {

        for (let i = 0; i < 2; i++)
        {
            AddSelectTag();
        }
    }
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

                <select>
                    {Rank.map((item, index) => {
                        return (
                            <option value="data">{item.name}
                            {/* <input type="checkbox" /> */}
                            </option>
                        )
                    })}
                </select>
                {/* <button id="addButton">Add</button> */}
                {/* addButton.addEventListener('click', addSelectTag); */}
                <div id="selectContainer" onClick={() => (try_me())}>
                    {multi === true ? <GrAdd/> : " "}
                </div>
                <div className="div_submit">
                    <Link to="#" className="submit" onClick={handleClose}>Submit</Link>
                    
                    <Link to="#" className="submit" onClick={handleClose}>Cancel</Link>
                </div>

            </motion.div>
        </Backdrop>
    )
}

export default Modal