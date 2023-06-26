import Backdrop from "../Sidebar/Backdrop.tsx"
import { motion } from 'framer-motion'
import { GrTrophy } from "react-icons/gr";
import '../../styles/Messages.css'
import React from "react";
import { MdQrCodeScanner } from "react-icons/md";
import { GiCrownedSkull, GiWingedSword } from "react-icons/gi";

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
	text: string,
    icon: number
  }

function YellowAlert ({handleClose, text, icon}: AlertProps) {
    {setTimeout(handleClose, 3000)}
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

            {icon === 0 ? (
                <GrTrophy/>
            ):("")}
            {icon === 1 ? (
                <MdQrCodeScanner/>
            ):("")}

            {icon === 2 ? (
                <GiCrownedSkull/>
            ):("")}
            
            {icon === 3 ? (
                <GiWingedSword/>
            ):("")}

            <h5>{text}</h5>
            </motion.div>
        </Backdrop>
    )
}

export default YellowAlert