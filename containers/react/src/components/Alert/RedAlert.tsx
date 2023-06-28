import Backdrop from "../Sidebar/Backdrop.tsx"
import { motion } from 'framer-motion'
import { BiErrorCircle } from "react-icons/bi";
import '../../styles/Messages.css'
import React from "react";

interface AlertProps {
	handleClose: Function,
	text: string
  }

function RedAlert ({handleClose, text}: AlertProps) {
    {setTimeout(handleClose, 1500)}
    return(
        <Backdrop onClick={handleClose}>
        <motion.div
                onClick={(e) => e.stopPropagation()}
                className="redAlert"
                initial="hidden"
                animate="visible"
                exit="exit"
                >
            <BiErrorCircle/>
            <div className="text_alert">
                <h5>{text}</h5>
            </div>
            </motion.div>
        </Backdrop>
    )
}

export default RedAlert