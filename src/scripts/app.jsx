/* global require */

import '../styles/styles.less';

const React = require('react');
const ReactDOM = require('react-dom');
const org = require('org');

const page = document.getElementById('page');

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            transpiledText: 'Paste an org document on the left to view it in HTML form here'
        };

        this.parser = new org.Parser();
    }

    handleChange(e) {
        var input = e.target.value;

        this.setState(() => ({
            transpiledText: this.parser
                .parse(input)
                .convert(org.ConverterHTML, {
                    headerOffset: 0
                })
                .toString()
        }));
    }

    render() {
        return (
            <div className="container">
              <Input onChange={this.handleChange.bind(this)} />
              <Output text={this.state.transpiledText} />
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

ReactDOM.render(<App />, page);
