import React from 'react';

export default class Selector extends React.Component {
    render() {
        return (
            <select
                className="transform-selector"
                value={this.props.selectedTransform.name}
                onChange={this.props.onChange}>
                {
                    this.props.transforms
                        .map(k => <option key={k.name} value={k.name}>{k.name}</option>)
                }
            </select>
        );
    }
}
