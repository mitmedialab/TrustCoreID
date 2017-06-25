import React, { Component } from 'react';
import styles from './List.css';
import PayloadItem from '../common/PayloadItem';
import ReactJson from 'react-json-view'

class ListItem extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        };

    }


    render() {

        const getSuffix = () => {
            if (this.props.item.signatures) {
                return (
                    <span className="float-right">
                    <i className="fa fa-key"></i>
                        {this.props.item.signatures.length}

                        {this.props.item.signatures.length < this.props.item.to.length + 1 ?
                            (<span className="link" onClick={this.props.sign}>
                        <i className="fa fa-check"></i>
                        Sign
                    </span>) : ''}
                </span>
                )
            } else {
                return (<span className="float-right">
                    <span className="link" onClick={this.props.send}>
                        <i className="fa fa-arrow-right"></i>
                        Send
                    </span>
                    <span className="link danger" onClick={this.props.remove}>
                        <i className="fa fa-remove"></i>
                        Delete
                    </span>
                    <span className="link" onClick={this.props.sign}>
                        <i className="fa fa-check"></i>
                        Sign
                    </span>

                </span>)
            }
        };

        const getDetailedView = () => {
            if (!this.state.expanded)
                return;

            //let payload = this.props.item.payload.constructor === Array ?
            //    this.props.item.payload : [this.props.item.payload];
            console.log(this.props.item);

            return (
                <div>
                    <label>To</label>
                    {this.props.item.to.join(',')}
                    <label>Signatures</label>
                    {this.props.item.signatures ? this.props.item.signatures.map((signature, index) => {
                        if (signature && signature.protected) {
                            return (
                                <div key={index}>
                                    <div className="listItem">
                                        <span className="listItemLabel">ALG:</span>
                                        {signature.protected.alg}</div>
                                    <div className="listItem">
                                        <span className="listItemLabel">Public Key:</span>
                                        <ReactJson src={signature.protected.jwk}/>
                                    </div>
                                    <div className="listItem">
                                        <span className="listItemLabel">Signature:</span>
                                        <div className="signature">{signature.signature}</div>
                                    </div>

                                </div>
                            )
                        }
                    }) : undefined}

                    { this.props.item._attachments ?
                        <span>
                            <label>Attachments</label>
                            {Object.keys(this.props.item._attachments).map((key)=> {
                                let att = this.props.item._attachments[key];
                                return (<PayloadItem
                                    key={key}
                                    name={key}
                                    document={this.props.item._id}
                                    download={true}
                                    item={att}/>)
                            })}
                        </span> : undefined}
                    <label>Payload</label>
                    <ReactJson src={this.props.item.payload}/>
                </div>
            )
        };

        const getPrefix = () => {
            if (this.props.item.malformed === true) {
                return (<span className="mr-2"><i className="fa fa-exclamation-triangle"
                                                  title="malformed"
                                                  style={{color: 'rgba(200,0,0,1)'}}></i></span>)
            } else {
                return (<span className="mr-2"><i className="fa fa-file-text-o"></i></span>)
            }
        };

        return (<div className={styles.item}>
            <div className={styles.summary}>
                <span onClick={() => {
                        this.setState({expanded: !this.state.expanded});
                    }}>
                    {getPrefix()}
                    {this.props.item.name}
                    </span>
                {getSuffix()}
            </div>
            {getDetailedView()}

        </div>)
    }
}

export default ListItem;