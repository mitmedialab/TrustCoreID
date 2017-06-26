// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './TopBar.css';

export default class TopBar extends Component {
    render() {


        return (
            <div className={styles.topbar}>
                <Link to="/runtime/documents">
                    <i className="fa fa-file-text-o"></i>
                    Documents
                </Link>
                <Link to="/attestations">
                    <i className="fa fa-quote-right"></i>
                    Attestations
                </Link>

                <Link to="/runtime/activity">
                    <i className="fa fa-list"></i>
                    Activity Feed
                </Link>

                <span className="float-right">
                    <Link to="/runtime/newdoc">
                        <i className="fa fa-plus"></i>
                        Create New
                    </Link>
                </span>
            </div>
        );
    }
}
