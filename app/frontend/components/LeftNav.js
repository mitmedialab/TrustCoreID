// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './LeftNav.css';

export default class LeftNav extends Component {

    list = [
        {name: "Inbox", icon: "fa fa-inbox"},
        {name: "Drafts", icon: "fa fa-sticky-note-o"},
        {name: "Pending", icon: "fa fa-clock-o"},
        {name: "Signed", icon: "fa fa-check", style: {color: 'rgba(0,200,0,1)'}},
        {name: "Declined", icon: "fa fa-exclamation-circle fa-red", style: {color: 'rgba(200,0,0,1)'}}
    ];

    render() {

        const getCountFor = (index) => {
            return this.props.list[index] ? this.props.list[index].length : 0;
        };

        const isSelected = (index) => {
            return `/runtime/documents/${index}` === this.props.router.location.pathname ? styles.selected : '';
        };

        return (

            <div className={styles.nav}>
                <ul className={styles.list}>
                    {this.list.map((item, index) => {
                        return (
                            <li key={index} className={isSelected(index)}>
                                <Link to={`/runtime/documents/${index}`}>
                                    <i className={item.icon}
                                       style={item.style}
                                       aria-hidden="true"></i>
                                    {item.name}
                                    <span className={styles.bullet}>{getCountFor(index)}</span>
                                </Link>
                            </li>)
                    })}
                </ul>
            </div>
        );
    }
}
