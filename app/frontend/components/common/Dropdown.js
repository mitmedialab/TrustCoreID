import React from 'react';


class Dropdown extends React.Component {


    render() {
        return (
            <div className="form-element">
                <label>{this.props.label}</label>
                <select
                    value={this.props.value}
                    onChange={this.props.onChange}>
                    {this.props.options.map( (item, index)=> {
                        return (<option key={index}>{item}</option>)
                    })}
                </select>
            </div>
        )
    }

}

export default Dropdown