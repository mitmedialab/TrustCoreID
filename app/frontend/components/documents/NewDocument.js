// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PayloadItem from '../common/PayloadItem';
import styles from './NewDocument.css';
import {remote} from 'electron'
var fs = require('fs');



export default class NewDocument extends Component {

    constructor(props) {
        super(props)
        this.state = {
            "iss": "https://authority.com",
            "sub": "https://subject.com",
            "iat": new Date(),
            "exp": new Date(),
            "atr": {
                "name": "",
                "payload": [],
                "signatures": []
            }
        };
        this.upload = this.upload.bind(this);
        this.addToPayload = this.addToPayload.bind(this);


    }

    addToPayload(content, meta) {
        if (!this.state.atr.payload) {
            this.state.atr.payload = {meta, content};
        } else if (this.state.atr.payload.constructor === Array) {
            this.state.atr.payload.push({meta, content});
        } else {
            this.state.atr.payload = [this.state.atr.payload, {meta, content}]
        }
        this.forceUpdate();
    }

    upload() {
        var dialog = remote.dialog;
        dialog.showOpenDialog((fileNames) => {
            fs.readFile(fileNames[0], 'utf-8', (err, data) => {
                if (err) {
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                }

                this.addToPayload(data, {type: 'file', name: fileNames[0]});
            });
        });
    }

    render() {

        const getContentItem = (item, index) => {

            let icon = '';
            switch (item.meta.type) {
                case 'file':
                    mappings.forEach(mapping => {
                        console.log(mapping.search, item.meta.name);
                        if (mapping.search.test(item.meta.name)) {
                            icon = mapping.icon;
                        }
                    })
            }

            if (!icon) {
                icon = 'fa-file-o';
            }

            icon = 'fa ' + icon;

            return (<div key={index} className="item">
                <i className={icon}/>
                <span className="ml-2">{item.meta.name}</span>
            </div>)
        }

        return (
            <div className="container white">
                <div className="header">Document Summary</div>
                <div className="form-element">
                    <label htmlFor="name">Name</label>
                    <input name="name" value={this.state.atr.name}
                           onChange={(e) => {this.setState({atr: {name: e.target.value}})}}/>

                </div>
                <div className="form-element">
                    <label htmlFor="rec">Recipients</label>
                    <input name="rex" value={this.state.rec}
                           onChange={(e) => {this.setState({rec: e.target.value})}}/>

                </div>
                <div className="form-element">
                    <label htmlFor="sub">Subject</label>
                    <input name="sub" value={this.state.sub}
                           onChange={(e) => {this.setState({sub: e.target.value})}}/>

                </div>
                <div className="form-element">
                    <label htmlFor="exp">Expiry Date</label>
                    <input name="exp" type="date" value={this.state.exp}
                           onChange={(e) => {this.setState({exp: e.target.value})}}/>
                </div>

                <div className="header">Content</div>
                {
                    this.state.atr.payload.map((item, index) => {
                       return (<PayloadItem item={item} key={index} />)
                    })
                }

                <div className="text-right mt-4">
                    <span className="btn btn-primary-outline ml-2"
                          onClick={ () => {this.upload()}}>Add File</span>
                    <span className="btn btn-primary-outline ml-2">Add Text Box</span>
                </div>
            </div>
        );
    }
}
