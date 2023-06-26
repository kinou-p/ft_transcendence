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

function GreenAlert({ handleClose, text }: AlertProps) {
    { setTimeout(handleClose, 1500) }
    return (

        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="greenAlert"
                // variant={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <AiOutlineCheckCircle />
                <div className="text_alert">
                    <h5>{text}</h5>
                </div>
            </motion.div>
        </Backdrop>
    )
}

export default GreenAlert