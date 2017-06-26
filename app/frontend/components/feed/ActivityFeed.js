import React, { Component } from 'react';

export default class ActivityFeed extends Component {

    constructor(props) {
        super(props);
        this.props.loadFeed(this.props.lastIndex, 8);
        this.onScroll = this.onScroll.bind(this);
        this.blocked = false;
    }


    onScroll(e) {
        if (!this.blocked && e.target.scrollHeight - e.target.scrollTop < e.target.offsetHeight + 30) {
            this.blocked = true;
            this.props.loadFeed(this.props.lastIndex, 10);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.blocked && nextProps.items.length > this.props.items.length) {
            this.blocked = false;
        }
    }

    render() {

        const getDateString = (date) => {
            return new Date(date).toLocaleString()
        };

        return (<div onScroll={(e)=>{this.onScroll(e)}} className="container" data-tid="container">
            {this.props.items.map((item) => {
                return (<div className="activityItem" key={item.id}>
                    <span className="activityDate">{getDateString(item.doc.sent)}</span>
                    <span className="activityContent">
                        <div>
                            <b>{item.doc && item.doc.doc ? item.doc.doc.name : 'Untitled'}</b>
                        </div>
                        <div>
                            <span className="label">from:</span>
                            {item.doc.from}</div>
                        <div>
                            <span className="label">to:</span>
                            {item.doc.to}</div>
                    </span>
                </div>)
            })}
        </div>)
    }
}
