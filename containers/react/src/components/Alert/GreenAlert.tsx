import Backdrop from "../Sidebar/Backdrop.tsx"
import { motion } from 'framer-motion'
import { AiOutlineCheckCircle } from "react-icons/ai";
import '../../styles/Messages.css'
import React from "react";


const dropIn = {
    hidden: {
		y: "-100vh",
	},
	visible: {
		y: "0",
	},
	exit: {
		y: "-100vh",
	},
};

interface AlertProps {
	handleClose: Function,
	text: string
  }

function GreenAlert ({handleClose, text}: AlertProps){
        
        return(
            <Backdrop onClick={handleClose}>
        <motion.div
                onClick={(e) => e.stopPropagation()}
                className="greenAlert"
                // variant={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <AiOutlineCheckCircle/>
               <p>{text}</p>
            </motion.div>
               {setTimeout(handleClose, 1500)}
        </Backdrop>
    )
}

export default GreenAlert