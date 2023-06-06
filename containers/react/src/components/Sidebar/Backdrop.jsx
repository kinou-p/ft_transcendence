import { motion } from "framer-motion"
import "../../styles/Header.css"

const Backdrop = ({ children, onClick }) => {
	return (
		<motion.div className="backdrop"
					onClick={onClick}
					initial={{ opacity: -1}}
					animate={{ opacity: 1}}
					exit={{ opacity: -1}}>
			{children}
		</motion.div>
	)
}

export default Backdrop