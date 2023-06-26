import React, { ReactNode } from "react";
import { motion } from "framer-motion"
import "../../styles/Header.css"

interface backProps {
	children: ReactNode,
	onClick: any
}

const Backdrop = ({ children, onClick }: backProps) => {
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