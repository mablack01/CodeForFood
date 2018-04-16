class RenameDeviceForm = React.createClass({
	getInitialState: function() {
		return {
			device_id: undefined,
			device_name: "",
		}
	}
}
	handleSubmit: function(e) {
		e.preventDefault();

		var device_id = this.state.device_id;
		var device_name  = this.state.device_name.trim();
	}

	setValue: function(field, event){
		var object = {};
		object[field] = event.target.value;
		this.setState(object);
	}

	render: function(){
		return (
			<form className="renameDeviceForm" onSubmit={this.handleSubmit}>
				<h2>Rename Device</h2>

				<TextInput
					value={this.state.device_name}
					uniqueName="device_name"
					text="Device Name"
					textArea={false}
					required={true}
					maxCharacters={10}
					onChange={this.setValue.bind(this, 'device_name')} >
				<input type="submit" value="Submit"/>
			</form>

		)
	}
