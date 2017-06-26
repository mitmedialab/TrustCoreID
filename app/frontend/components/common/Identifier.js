import React from 'react';


class Identifier extends React.Component {

    constructor(props) {
        super(props);

        let getSecondLetter = (text, separator) => {
            let split = text.split(separator);
            if (split.length > 1) {
                return split[1][0];
            } else {
                return '';
            }
        };

        let initials;

        if (this.props.initials && this.props.initials.length > 0) {
            initials = this.props.initials[0];
            let from = this.props.initials.split('@')[0];

            if (this.props.initials.length > 1) {
                initials += getSecondLetter(from, ' ');

                if (initials.length === 1) {
                    initials += getSecondLetter(from, '.');
                }

                if (initials.length === 1) {
                    initials += this.props.initials[1];
                }
            }
        } else {
            initials = '  '
        }

        function hashCode(str) { // java String#hashCode
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 3) - hash);
            }
            return hash;
        }

        function intToRGB(i) {
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();

            return "00000".substring(0, 6 - c.length) + c;
        }

        this.initials = initials.toUpperCase();
        if (this.props.initials) {
            this.style = {
                display: 'inline-block',
                position: 'relative',
                width: this.props.size,
                height: this.props.size,
                backgroundColor: '#' + intToRGB(hashCode(this.props.initials)),
                color: '#FFFFFF',
                borderRadius: '50%',
                textAlign: 'center',
                overflow: 'hidden',
                verticalAlign: 'middle',
                margin: 3
            };
        } else {
            this.style = {
                display: 'none'
            }
        }

        this.initialsStyle = {
            position: 'absolute',
            top: this.props.size / 5,
            fontSize: this.props.size * 0.5,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontWeight: 100
        }

    }

    render() {


        return (
            <span style={this.style}>
                <span style={this.initialsStyle}>{this.initials}</span>
            </span>
        )


    }


}

export default Identifier;