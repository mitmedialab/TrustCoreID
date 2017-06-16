// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Anon.css';

export default class Anon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            panel: 0
        }
    }

    render() {
        if (this.state.panel === 0) {
            return (
                <div className={styles.anonWrapper}>
                    <div className={styles.container}>
                        <h1>Core ID</h1>

                        <input name="username" type="text" placeholder="Email Address"/>
                        <input name="password" type="password" placeholder="Password"/>
                        <Link to="/runtime/documents/0"><div className="button full">Login</div></Link>
                        <div className="text-center">
                            Don't have an account? <a onClick={ () => {this.setState({panel: 1})}}>Sign Up</a>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={styles.anonWrapper}>
                    <div className={styles.container}>
                        <h1>Core ID</h1>
                        <input name="fullname" type="text" placeholder="Enter Your Email"/>
                        <input name="username" type="text" placeholder="Email Address"/>
                        <input name="password1" type="password" placeholder="Password"/>
                        <input name="password2" type="password" placeholder="Re-enter Password"/>

                        <div className="button full">Register</div>
                        <div className="text-center">
                            <a onClick={ () => {this.setState({panel: 0})}}>Back to login</a>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
