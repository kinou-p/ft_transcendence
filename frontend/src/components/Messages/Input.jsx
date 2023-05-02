import { TbSend } from 'react-icons/tb';
import '../../styles/Messages.css'

function Input(){
	return (
		<div className="input">
			<input type="text" placeholder="What do you want to say"/>
			<div className="send">
				<TbSend/>
			</div>
		</div>
	)
}

export default Input