// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PayloadItem from '../common/PayloadItem';
import styles from './NewDocument.css';
import {remote} from 'electron'
import { JSONSchema } from '@trust/json-document'
import ComponentFactory from '../common/ComponentFactory';


export default class NewDocument extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            data: {}
        };

        this.selectSchema = this.selectSchema.bind(this);
        this.getComponent = ComponentFactory.getComponent.bind(this);


    }

    selectSchema(schema) {
        let clone = JSON.parse(JSON.stringify(schema))
        this.setState({schema: clone})
    }


    render() {


        if (this.state.schema && !this.schemaComponents) {
            const getSchemaComponents = (schema, path = 'schema') => {
                return (
                    <span key={path}>
                        <div className="header">{schema.description}</div>
                        {
                            Object.keys(schema.properties).map((item, index)=> {
                                if (schema.properties[item].type === 'object') {
                                    return getSchemaComponents(schema.properties[item], `${path}.properties.${item}`);
                                } else {
                                    return (<div key={index}>
                                        {this.getComponent(item,
                                            schema.properties[item],
                                            `${path}.properties.${item}`)}</div>)
                                }
                            })
                        }
                    </span>
                )
            };

            this.schemaComponents = getSchemaComponents(this.state.schema)
        }

        if (this.state.schema) {
            return (
                <div className="container white">
                    <h4>{this.state.schema.title}</h4>
                    {this.schemaComponents}
                    <div className="text-right">
                        <span className="btn btn-primary" onClick={ () => {this.props.sign(this.state.data)}}>
                            <i className="fa fa-check"></i>Sign
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
                        {this.props.schemas.filter(item=> {
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
