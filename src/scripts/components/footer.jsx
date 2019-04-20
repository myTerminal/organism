import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
                <div
                    className={'control-button fa fa-columns fa-2x' + (this.props.layout === 'both' ? ' active' : '')}
                    title="Markup and Preview"
                    onClick={() => this.props.switchToLayout('both')}
                />
                <div
                    className={'control-button fa fa-file-image-o fa-2x' + (this.props.layout === 'right' ? ' active' : '')}
                    title="Preview only"
                    onClick={() => this.props.switchToLayout('right')}
                />
                <div
                    className={'control-button fa fa-file-code-o fa-2x' + (this.props.layout === 'left' ? ' active' : '')}
                    title="Markup only"
                    onClick={() => this.props.switchToLayout('left')}
                />
                <div
                    className="control-separator"
                />
                <div
                    className="control-button fa fa-hdd-o fa-2x"
                    title="Export HTML"
                    onClick={() => this.props.exportHtml()}
                />
                <div
                    className="control-button fa fa-refresh fa-2x"
                    title="Reset"
                    onClick={() => this.props.reset()}
                />
            </div>
        );
    }
}
