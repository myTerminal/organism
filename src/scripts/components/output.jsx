import React from 'react';

export default class Output extends React.Component {
    render() {
        return (
            <div className="output markdown-body"
                dangerouslySetInnerHTML={{ __html: this.props.text }}
            />
        );
    }
}
