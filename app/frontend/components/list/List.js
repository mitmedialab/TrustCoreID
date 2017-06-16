import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './List.css';

import ListItem from './ListItem';

export default class List extends Component {

    constructor(props) {
        super(props);

    }

    render() {


        let data;
        let group = this.props.match.params.id || 0;
        if (this.props.list && this.props.list[group].length > 0) {
            data = this.props.list[group];
            return (

                <div className="container" data-tid="container">
                    <div className={styles.group}>
                        {data.map((item, index) => {
                            return <ListItem key={index} item={item} sign={ ()=> {this.props._sign(item)}}/>
                        })}
                    </div>
                </div>
            )
        } else {
            return (
                <div id="wrapper">
                    <div className="smiley">
                        <div className="left-eye eye">&nbsp;</div>
                        <div className="right-eye eye">&nbsp;</div>
                        <div className="mouth">&nbsp;</div>
                    </div>
                </div>
            )
        }


    }
}
