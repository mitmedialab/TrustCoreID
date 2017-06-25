// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PayloadItem from '../common/PayloadItem';
import styles from './NewDocument.css';
import {remote} from 'electron'
import { JSONSchema } from '@trust/json-document'
import ComponentFactory from '../common/ComponentFactory';
import Input from '../common/Input';
import mmm from 'mmmagic';

const Magic = mmm.Magic;
const magic = new Magic(mmm.MAGIC_MIME_TYPE);
const fs = require('fs');

export default class NewDocument extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            name: 'Untitled-' + Math.round(Math.random() * 1e4),
            recipients: '',
            data: {},
            attachments: []
        };


        this.selectSchema = this.selectSchema.bind(this);
        this.getComponent = ComponentFactory.getComponent.bind(this);
        this.upload = this.upload.bind(this);
    }

    selectSchema(schema) {
        let clone = JSON.parse(JSON.stringify(schema))
        this.setState({schema: clone})
    }

    upload() {
        var dialog = remote.dialog;
        dialog.showOpenDialog((fileNames) => {
            if (fileNames) {
                fs.readFile(fileNames[0], 'utf-8', (err, data) => {
                    if (err) {
                        alert("An error ocurred reading the file :" + err.message);
                        return;
                    }

                    magic.detectFile(fileNames[0], (err, result) => {
                        let fileName = fileNames[0].substr(fileNames[0].lastIndexOf('/') + 1);


                        this.state.attachments.push({
                            fileName,
                            "content_type": result,
                            data: data
                        });


                        this.forceUpdate();
                    });
                });
            }
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

        if (this.state.schema && !this.schemaComponents) {
            const getSchemaComponents = (schema, path = 'schema', index = 0) => {
                return (
                    <span key={index}>
                    <div className="header">{schema.description}</div>
                        {
                            Object.keys(schema.properties).map((item, index)=> {
                                if (schema.properties[item].type === 'object') {
                                    return getSchemaComponents(schema.properties[item], `${path}.properties.${item}`, index);
                                } else {
                                    return (<div key={index}>
                                        {this.getComponent(item,
                                            schema.properties[item],
                                            `${path}.properties.${item}`)}</div>)
                                }
                            })
                        }
                </span>)
            }
            this.schemaComponents = getSchemaComponents(this.state.schema)
        }

        if (this.state.schema) {
            return (
                <div className="container white">
                    <Input label="Document Name"
                           type="text"
                           value={this.state.name}
                           onChange={ (e) => {
                            this.setState({name: e.target.value})
                           }}/>

                    <Input label="Recipients (CSV)"
                           type="text"
                           value={this.state.recipients}
                           onChange={ (e) => {
                            this.setState({recipients: e.target.value})
                           }}/>


                    <h4>File Attachments</h4>

                    {this.state.attachments.map((item, index)=> {
                        return (<PayloadItem
                            key={index}
                            name={item.fileName}
                            remove={() => {
                                    delete this.state.splice(index, 1);
                                    this.forceUpdate()
                                }}
                            item={item}/>)
                    })}

                    <div className="mt-2">
                        <span className="btn btn-primary-outline "
                              onClick={ () => {this.upload()}}>Add File</span>
                    </div>
                    <h4>{this.state.schema.title}</h4>
                    {this.schemaComponents}

                    <div className="text-right">
                        <span className="btn btn-primary-outline"
                              onClick={()=>{this.props.save(this.state.name, this.state.data, this.state.recipients, this.state.attachments)}}>
                            <i className="fa fa-save"/> Save
                        </span>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container white">
                    <div className="header">Select document type</div>
                    <input type="text"
                           value={this.state.search}
                           placeholder="Search document"
                           onChange={(e) => {this.setState({search: e.target.value})}}/>
                    <ul className="selection">
                        {this.props.newdoc.schemas.filter(item=> {
                            return item.title.indexOf(this.state.search) !== -1;
                        }).map((item, index)=> {
                            return (<li onClick={()=>{this.selectSchema(item)}}
                                        key={index}>{item.title}</li>)
                        })}
                    </ul>
                </div>
            );
        }


    }
}
