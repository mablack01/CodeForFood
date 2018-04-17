var RenameDeviceForm = React.createClass({
	getInitialState: function() {
		return {
			device_id: undefined,
			device_name: "",
		}
	}
}
	handleChange: function(event) {
		this.setState({device_name: event.target.value});
	}

	_onChange: function(event){
		event.preventDefault();
		console.log("Device Name:" + this.state.device_name);
	}

	render: function(){
		return (
			<form method="post">
				<h2>Rename Device</h2>
				<input type="text" onChange="{this.handleChange}"/>
				<button onClick={this._onChange}Submit</button>
			</form>

		)
	}
	React.render(<RenameDeviceForm />, docuement.getElementById('container'));
