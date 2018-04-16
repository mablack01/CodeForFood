import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {

	constructor() {
		super()
		this.state = {
			username: 'yo'
		}
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		console.log("Success")
		axios.get('https://api.github.com/users/maecapozzi')
		.then(response => this.setState({username:response.data.name}))
	}



	render() {
		return (
	 
			<div className='button_container'>
				<button className='button' onClick={this.handleClick}>
					Click Me
				</button>
				<p>{this.state.username}</p>
			</div>

		);
	}
}



export default App;
