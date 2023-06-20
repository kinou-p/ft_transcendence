import Backdrop from "../Sidebar/Backdrop.tsx"
import { motion } from 'framer-motion'
import { GrTrophy } from "react-icons/gr";
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

function YellowAlert ({handleClose, text}: AlertProps) {
    return(
        <Backdrop onClick={handleClose}>
        <motion.div
                onClick={(e) => e.stopPropagation()}
                className="yellowAlert"
                // variant={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
            <GrTrophy/>
            <p>{text}</p>
            </motion.div>
            {setTimeout(handleClose, 3000)}
        </Backdrop>
    )
}

export default YellowAlert