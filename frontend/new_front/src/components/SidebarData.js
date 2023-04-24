import React from "react";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import {BiLogOutCircle} from 'react-icons/bi';
import {IoSettingsSharp} from 'react-icons/io5'


export const SidebarData = [
	{
		title: 'Dipper Ratman',
		path: '/',
		icon: <AiIcons.AiFillHome />,
		cName: 'nav-text'
	},
	{
		title: 'Game',
		path: '/products',
		icon: <FaIcons.FaGamepad/>,
		cName: 'nav-text'
	},
	{
		title: 'Messages',
		path: '/messages',
		icon: <FaIcons.FaEnvelopeOpenText/>,
		cName: 'nav-text'
	},
	{
		title: 'Social',
		path: '/team',
		icon: <IoIcons.IoMdPeople />,
		cName: 'nav-text'
	},
	{
		title: 'Settings',
		path: '/team',
		icon: <IoSettingsSharp />,
		cName: 'nav-text'
	},
	{
		title: 'Log out',
		path: '/team',
		icon: <BiLogOutCircle />,
		cName: 'nav-text'
	},
]