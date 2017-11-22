/* global require */

import '../styles/styles.less';

const React = require('react');
const ReactDOM = require('react-dom');

const org = require('org');
const markdown = require('markdown').markdown;
const rst2mdown = require('rst2mdown');
const textilejs = require('textile-js');

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
                return markdown.toHTML(text);
            },
            'ReStructuredText': function (text) {
                return markdown.toHTML(rst2mdown(text));
            },
            'TxStyle': function (text) {
                return textilejs(text);
            }
        };

        this.orgParser = new org.Parser();

        this.state = {
            selectedTransform: 'Org',
            transpiledText: defaultTranspiledText
        };
    }

    handleTextChange(e) {
        var input = e.target.value;

        this.setState(() => ({
            transpiledText: this.transforms[this.state.selectedTransform].bind(this)(input)
        }));
    }

    handleTransformChange(e) {
        var selectedTransform = e.target.value;

        this.setState(() => ({
            selectedTransform: selectedTransform,
            transpiledText: defaultTranspiledText
        }));
    }

    render() {
        return (
            <div className="container">
              <Input onChange={this.handleTextChange.bind(this)} />
              <Output text={this.state.transpiledText} />
              <Selector transforms={this.transforms} selectedTransform={this.state.selectedTransform} onChange={this.handleTransformChange.bind(this)} />
            </div>
        );
    }
}

class Input extends React.Component {
    render() {
        return <textarea className="input" onChange={this.props.onChange} />;
    }
}

class Output extends React.Component {
    render() {
        return (
            <div
              className="output"
              dangerouslySetInnerHTML={{ __html: this.props.text }}
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
