// @flow
import React, { Component } from 'react';
import styles from './Anon.css';

export default class Anon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            panel: 0,
            email: '',
            password: '',
            name: '',
            password1: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(who) {

        return (e) => {
            let change = {};
            change[who] = e.target.value;
            this.setState(change);
        }

    }

    render() {
        if (this.state.panel === 0) {
            return (
                <div className={styles.anonWrapper}>
                    <div className={styles.container}>
                        <h1>Core ID</h1>

                        <input name="email"
                               value={this.state.email}
                               onChange={(e)=>{
                                    this.setState({email: e.target.value});
                               }}
                               type="text" placeholder="Email Address"/>
                        <input name="password"
                               type="password"
                               onChange={(e)=>{
                                    this.setState({password: e.target.value});
                               }}
                               placeholder="Password"/>
                        <div className="button full" onClick={()=>{this.props.login(this.state.email, 0)}}>Login</div>
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
                        <input name="fullname"
                               type="text"
                               value={this.state.name}
                               onChange={this.onChange('name')}
                               placeholder="Enter Your Name"/>
                        <input name="email"
                               type="text"
                               value={this.state.email}
                               onChange={this.onChange('email')}
                               placeholder="Email Address"/>
                        <input name="password1"
                               type="password"
                               value={this.state.password}
                               onChange={this.onChange('password')}
                               placeholder="Password"/>
                        <input name="password2"
                               type="password"
                               value={this.state.password1}
                               onChange={this.onChange('password1')}
                               placeholder="Re-enter Password"/>

                        <div className="button full"
                             onClick={ () => {
                                let {email, name} = this.state;
                                this.props.register(email, name);
                             }}>Register
                        </div>
                        <div className="text-center">
                            <a onClick={ () => {this.setState({panel: 0})}}>Back to login</a>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
