import Backdrop from "../Sidebar/Backdrop.tsx"
import { motion } from 'framer-motion'
import { BiErrorCircle } from "react-icons/bi";
import '../../styles/Messages.css'


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

function RedAlert ({handleClose, text}) {
    return(
        <Backdrop>
        <motion.div
                onClick={(e) => e.stopPropagation()}
                className="redAlert"
                variant={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
            <BiErrorCircle/>
            <p>{text}</p>
            </motion.div>
            {setTimeout(handleClose, 3000)}
        </Backdrop>
    )
}

export default RedAlert