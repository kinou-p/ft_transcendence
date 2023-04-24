import React from "react"
import styled from "styled-components"
import DefaultPic from '../../assets/profile.jpg'
import '../../Style/Messages.css'

const MeStyleP = styled.p`
	background-color: lightgray;
	padding 10px 20px;
	border-radius 10px 0px 10px 10px;
	color: black;
	margin-right: 20px;
`

function MessageMe(){
	return (
		<div className="meMessage">
			<div>
				<img className="messageInfo" src={DefaultPic} alt="profile" />
			</div>
			<div className="messageContent">
				<MeStyleP>bonjours ca va</MeStyleP>
			</div>
		</div>
	)
}

export default MessageMe