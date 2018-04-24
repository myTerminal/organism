import React from 'react';

export default class Input extends React.Component {
    render() {
        return (
            <textarea className="input"
                value={this.props.text}
                onChange={this.props.onChange}
            />
        );
    }
}