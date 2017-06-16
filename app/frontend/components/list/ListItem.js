import React, { Component } from 'react';
import styles from './List.css';
import PayloadItem from '../common/PayloadItem';

class ListItem extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }


    render() {

        const getSuffix = () => {
            if (this.props.item.atr.signatures) {
                return (<span className="float-right">
                    <i className="fa fa-key"></i>
                    {this.props.item.atr.signatures.length}
                </span>)
            } else {
                return (<span className="float-right">
                    <span onClick={this.props.sign}>
                        <i className="fa fa-check"></i>
                        Sign
                    </span>

                </span>)
            }
        };

        const getDetailedView = () => {
            if (!this.state.expanded)
                return;

            let payload = this.props.item.atr.payload.constructor === Array ?
                this.props.item.atr.payload : [this.props.item.atr.payload];

            return (
                <div>
                    <label>Signatures</label>
                    {this.props.item.atr.signatures ? this.props.item.atr.signatures.map((signature, index) => {
                        return (
                            <div key={index}>
                                <div className="listItem">
                                    <span className="listItemLabel">ISS:</span>
                                    {signature.protected.iss}</div>
                                <div className="listItem">
                                    <span className="listItemLabel">ALG:</span>
                                    {signature.protected.alg}</div>
                                <div className="listItem">
                                    <span className="listItemLabel">TYP:</span>
                                    {signature.protected.typ}</div>
                                <div className="listItem">
                                    <span className="listItemLabel">KID:</span>
                                    {signature.protected.kid}</div>
                                <div className="listItem">
                                    <span className="listItemLabel">Signature:</span>
                                    <div className="signature">{signature.signature}</div>
                                </div>

                            </div>)
                    }) : undefined}

                    <label>Payload</label>
                    {
                        payload.map((item, index) => {
                            return (<PayloadItem item={item} key={index}/>)
                        })
                    }
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
            <div className={styles.summary} onClick={() => {
                this.setState({expanded: !this.state.expanded});
            }}>
                {getPrefix()}
                {this.props.item.atr.name}
                {getSuffix()}
            </div>
            {getDetailedView()}

        </div>)
    }
}

export default ListItem;