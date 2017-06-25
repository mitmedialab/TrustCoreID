import React from 'react';
import {remote} from 'electron'

const {Storage, Wallet} = require('electron').remote.require('./backend');
const fs = require('fs');

const mappings = [
    {search: /\.(pdf)$/i, icon: 'fa-file-pdf-o'},
    {search: /\.(gif|jpg|jpeg|tiff|png)$/i, icon: 'fa-file-image-o'}
];

class PayloadItem extends React.Component {

    constructor(props) {
        super(props);

        this.download = this.download.bind(this);
    }

    download() {
        Storage.open().then(store => {
            store.getAttachment(this.props.document, this.props.name).then(buf => {
                remote.dialog.showSaveDialog({defaultPath: this.props.name}, (fileName) => {
                    if (fileName === undefined) return;
                    fs.writeFile(fileName, buf, (err) => {
                        console.log(err);
                    });
                });
            })
        });

    }

    render() {
        let icon = '',
            {item} = this.props,
            name = this.props.name;

        mappings.forEach(mapping => {
            if (mapping.search.test(name)) {
                icon = mapping.icon;
            }
        });


        if (!icon) {
            icon = 'fa-file-o';
        }

        icon = 'fa ' + icon;

        return (
            <span className="item">
                <i className={icon}/>
                <span className="ml-2">{name}</span>
                {this.props.remove ? (
                    <i className="float-right fa fa-remove" onClick={this.props.remove}></i>) : undefined}
                {this.props.download ? (
                    <i className="float-right fa fa-download" onClick={()=>{this.download()}}></i>) : undefined}
            </span>)
    }

}

export default PayloadItem