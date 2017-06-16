import React from 'react';

const mappings = [
    {search: /\.(pdf)$/i, icon: 'fa-file-pdf-o'},
    {search: /\.(gif|jpg|jpeg|tiff|png)$/i, icon: 'fa-file-image-o'}
];

class PayloadItem extends React.Component {

    render() {
        let icon = '',
            {item} = this.props,
            name = item.meta.name;
        switch (item.meta.type) {
            case 'file':
                mappings.forEach(mapping => {
                    if (mapping.search.test(item.meta.name)) {
                        icon = mapping.icon;
                    }
                });
                break;
            case 'text':
                name = 'text';
                icon = 'fa-file-text-o';
                break;

        }

        if (!icon) {
            icon = 'fa-file-o';
        }

        icon = 'fa ' + icon;

        return (
            <div className="item">
                <i className={icon}/>
                <span className="ml-2">{name}</span>
            </div>)
    }

}

export default PayloadItem