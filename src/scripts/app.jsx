/* global require document */

import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/styles.less';
import './service-worker-starter.js';
import packageDetails from '../../package.json';
import samples from './samples.js';

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
            transpiledText: this.transforms.Org.bind(this)(samples.Org)
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

    render() {
        return (
            <div className="root-container">
                <div className="header">
                    <b>organism</b>
                    - A live-preview editor for org and more (v{packageDetails.version})
                    <a className="source" href="https://github.com/myTerminal/organism" target="_blank">&nbsp;</a>
                </div>
                <div className="container">
                    <Input text={this.state.inputText}
                        onChange={this.handleTextChange.bind(this)} />
                    <Output text={this.state.transpiledText} />
                    <Selector transforms={this.transforms}
                        selectedTransform={this.state.selectedTransform}
                        onChange={this.handleTransformChange.bind(this)} />
                </div>
            </div>
        );
    }
}

class Input extends React.Component {
    render() {
        return (
            <textarea className="input"
                value={this.props.text}
                onChange={this.props.onChange}
            />
        );
    }
}

class Output extends React.Component {
    render() {
        return (
            <div className="output"
                dangerouslySetInnerHTML={{ __html: this.props.text }}
            />
        );
    }
}

class Selector extends React.Component {
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

ReactDOM.render(<App />, page);
