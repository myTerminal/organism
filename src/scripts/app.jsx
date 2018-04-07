/* global require */

import '../styles/styles.less';
import './service-worker-starter.js';

const React = require('react');
const ReactDOM = require('react-dom');

const org = require('org');
const markdown = new (require('showdown')).Converter();
const rst2mdown = require('rst2mdown');
const textilejs = require('textile-js');
// const asciidoctor = require('asciidoctor.js')();
const creole = new (require('npm-creole'))();
const BBCodeParser = require('bbcode-parser');
const bbcodeParser = new BBCodeParser(BBCodeParser.defaultTags());

import samples from './samples.js';

const page = document.getElementById('page');

const defaultTranspiledText = 'Type text or paste a document on the left to view it in HTML form here';

class App extends React.Component {
    constructor() {
        super();

        this.transforms = {
            'Org': function (text) {
                return this.orgParser
                    .parse(text)
                    .convert(org.ConverterHTML, {
                        headerOffset: 0
                    })
                    .toString();
            },
            'Markdown': function (text) {
                return markdown.makeHtml(text);
            },
            'ReStructuredText': function (text) {
                return markdown.makeHtml(rst2mdown(text));
            },
            'TxStyle': function (text) {
                return textilejs(text);
            },
            // 'AsciiDoc': function (text) {
            //     return asciidoctor.convert(text);
            // }
            'Creole': function (text) {
                return creole.parse(text);
            },
            'BBCode': function (text) {
                return bbcodeParser.parseString(text);
            }
        };

        this.orgParser = new org.Parser();

        this.state = {
            inputText: samples['Org'],
            selectedTransform: 'Org',
            transpiledText: this.transforms['Org'].bind(this)(samples['Org'])
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
            transpiledText: this.transforms[selectedTransform].bind(this)(samples[selectedTransform])
        }));
    }

    render() {
        return (
            <div className="container">
              <Input text={this.state.inputText} onChange={this.handleTextChange.bind(this)} />
              <Output text={this.state.transpiledText} />
              <Selector transforms={this.transforms} selectedTransform={this.state.selectedTransform} onChange={this.handleTransformChange.bind(this)} />
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
            <div
              className="output"
              dangerouslySetInnerHTML={{__html: this.props.text}}
              />
        );
    }
}

class Selector extends React.Component {
    render() {
        return (
            <select className="transform-selector" value={this.props.selectedTransform} onChange={this.props.onChange}>
              {
                  Object.keys(this.props.transforms).map(k => <option key={k} value={k}>{k}</option>)
            }
            </select>
        );
    }
}

ReactDOM.render(<App />, page);
