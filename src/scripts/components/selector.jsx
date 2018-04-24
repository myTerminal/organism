import React from 'react';

export default class Selector extends React.Component {
    render() {
        return (
            <select className="transform-selector"
                value={this.props.selectedTransform}
                onChange={this.props.onChange}>
                {
                    Object.keys(this.props.transforms)
                        .map(k => <option key={k} value={k}>{k}</option>)
                }
            </select>
        );
    }
}