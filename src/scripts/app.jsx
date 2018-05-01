/* global require document */

import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/styles.less';
import './service-worker-starter.js';
import packageDetails from '../../package.json';
import samples from './samples.js';

import Input from './components/input.jsx';
import Output from './components/output.jsx';
import Selector from './components/selector.jsx';

const org = require('org');

const showdown = require('showdown');

const markdown = new showdown.Converter();

const rst2mdown = require('rst2mdown');

const textilejs = require('textile-js');

// const asciidoctor = require('asciidoctor.js')();

const creole = new (require('npm-creole'))();

const BBCodeParser = require('bbcode-parser');

const bbcodeParser = new BBCodeParser(BBCodeParser.defaultTags());

const page = document.getElementById('page');

class App extends React.Component {
    constructor() {
        super();

        this.transforms = {
            Org: function (text) {
                return this.orgParser
                    .parse(text)
                    .convert(org.ConverterHTML, {
                        headerOffset: 0
                    })
                    .toString();
            },
            Markdown: function (text) {
                return markdown.makeHtml(text);
            },
            ReStructuredText: function (text) {
                return markdown.makeHtml(rst2mdown(text));
            },
            TxStyle: function (text) {
                return textilejs(text);
            },
            // AsciiDoc: function (text) {
            //     return asciidoctor.convert(text);
            // }
            Creole: function (text) {
                return creole.parse(text);
            },
            BBCode: function (text) {
                return bbcodeParser.parseString(text);
            }
        };

        this.orgParser = new org.Parser();

        this.state = {
            inputText: samples.Org,
            selectedTransform: 'Org',
            transpiledText: this.transforms.Org.bind(this)(samples.Org),
            layout: 'both'
        };
    }

    handleTextChange(e) {
        var input = e.target.value;

        this.setState(() => ({
            inputText: input,
            transpiledText: this.transforms[this.state.selectedTransform].bind(this)(input)
        }));
    }

    handleTransformChange(e) {
        var selectedTransform = e.target.value;

        this.setState(() => ({
            inputText: samples[selectedTransform],
            selectedTransform: selectedTransform,
            transpiledText: this.transforms[selectedTransform]
                .bind(this)(samples[selectedTransform])
        }));
    }

    switchToLayout(layoutCode) {
        this.setState({
            layout: layoutCode
        });
    }

    render() {
        return (
            <div className={'root-container layout-' + this.state.layout}>
                <div className="header">
                    <b>organism</b>
                    &nbsp;- A live-preview editor for org and more (v{packageDetails.version})
                    <a className="source fa fa-github fa-lg" href="https://github.com/myTerminal/organism" target="_blank">&nbsp;</a>
                </div>
                <div className="container">
                    <Input text={this.state.inputText}
                        onChange={this.handleTextChange.bind(this)} />
                    <Output text={this.state.transpiledText} />
                    <Selector transforms={this.transforms}
                        selectedTransform={this.state.selectedTransform}
                        onChange={this.handleTransformChange.bind(this)} />
                </div>
                <div className="footer">
                    <div className={'control-button fa fa-columns fa-2x' + (this.state.layout === 'both' ? ' active' : '')}
                        title="Markup and Preview"
                        onClick={() => this.switchToLayout('both')}
                    />
                    <div className={'control-button fa fa-file-image-o fa-2x' + (this.state.layout === 'right' ? ' active' : '')}
                        title="Preview only"
                        onClick={() => this.switchToLayout('right')}
                    />
                    <div className={'control-button fa fa-file-code-o fa-2x' + (this.state.layout === 'left' ? ' active' : '')}
                        title="Markup only"
                        onClick={() => this.switchToLayout('left')}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, page);
