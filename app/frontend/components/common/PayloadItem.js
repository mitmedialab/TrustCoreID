import React from 'react';
import {remote} from 'electron'

const {Storage, Wallet} = remote.require('./backend');
const fs = require('fs');
const shell = remote.shell;

const mappings = [
    {
        search: /\.(pdf)$/i, icon: 'fa-file-pdf-o', preview: (buf)=> {

        fs.writeFile('temp.pdf', buf, function (err, data) {
            if (err) {
                return console.log(err);
            } else {
                var path = require("path");
                var absolutePath = path.resolve("temp.pdf");
                shell.openItem(absolutePath);
            }
        });
    }
    },
    {
        search: /\.(gif|jpg|jpeg|tiff|png)$/i,
        icon: 'fa-file-image-o',
        preview: (buf) => {
            var blob = new Blob([buf], {type: 'image/png'});
            let str = URL.createObjectURL(blob);
            return (<img src={str}/>)
        }
    }
];

class PayloadItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            preview: undefined
        };
        this.download = this.download.bind(this);
        this.showPreview = this.showPreview.bind(this);
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

    showPreview(previewFunction) {
        console.log('showCalled')
        Storage.open().then(store => {
            store.getAttachment(this.props.document, this.props.name).then(buf => {
                this.setState({preview: previewFunction(buf)});
            })
        });
    }

    render() {
        let icon = '',
            previewFunction = false,
            {item} = this.props,
            name = this.props.name;

        mappings.forEach(mapping => {
            if (mapping.search.test(name)) {
                icon = mapping.icon;
                previewFunction = mapping.preview
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

                {previewFunction ? (<i className="float-right fa fa-eye mr-2"
                                       onClick={()=>{this.showPreview(previewFunction)}}></i>) : undefined}
                {this.state.preview ? (<div className="preview">
                    <span className="content">{this.state.preview}</span>
                    <i className="fa fa-close" onClick={()=>{ this.setState({preview: undefined})}}/>
                </div>) : undefined}
            </span>)
    }

}

export default PayloadItem