import React from 'react';


class Input extends React.Component {


    render() {
        return (
            <div className="form-element">
                <label>{this.props.label}</label>
                <input type={this.props.type}
                       value={this.props.value}
                       onChange={this.props.onChange}/>
            </div>
        )
    }

}

export default Input