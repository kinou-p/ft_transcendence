import React from "react"
import styled from "styled-components"
import DefaultPic from '../../assets/profile.jpg'
import { useRef } from "react"
import { useEffect } from "react"
import '../../styles/Messages.css'

const StyleP = styled.p`
	background-color: white;
	padding 10px 20px;
	border-radius 0px 10px 10px 10px;
	color: black;
	margin-left: 20px;
`

function MessageYou(){
	const scrollRef = useRef();

	useEffect(() => {
	scrollRef.current?.scrollIntoView({ behavior: "smooth"})
}, [])
	return (
		<div className="youMessage" ref={scrollRef}>
			<div>
				<img className="messageInfo" src={DefaultPic} alt="profile" />
			</div>
			<div className="messageContent">
				<StyleP>bonjours ca va</StyleP>
			</div>
		</div>
	)
}

export default MessageYou