/* global require Blob document */

import React from 'react';
import FileSaver from 'file-saver';

import Input from './input.jsx';
import Output from './output.jsx';
import Selector from './selector.jsx';
import Footer from './footer.jsx';

import packageDetails from '../../../package.json';
import samples from '../samples.js';

const org = require('org');

const showdown = require('showdown');

const markdown = new showdown.Converter();

const rst2mdown = require('rst2mdown');

const textilejs = require('textile-js');

// const asciidoctor = require('asciidoctor.js')();

const creole = new (require('npm-creole'))();

const BBCodeParser = require('bbcode-parser');

const bbcodeParser = new BBCodeParser(BBCodeParser.defaultTags());

export default class App extends React.Component {
    constructor() {
        super();

        this.transforms = {
            Org: function (text) {
                return this.orgParser
                    .parse(text)
                    .convert(org.ConverterHTML, { headerOffset: 0 })
                    .toString();
            },
            Markdown: text => markdown.makeHtml(text),
            ReStructuredText: text => markdown.makeHtml(rst2mdown(text)),
            TxStyle: text => textilejs(text),
            // AsciiDoc: text => asciidoctor.convert(text),
            Creole: text => creole.parse(text),
            BBCode: text => bbcodeParser.parseString(text)
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
        const input = e.target.value;

        this.setState((previousState) => ({
            inputText: input,
            transpiledText: this.transforms[previousState.selectedTransform].bind(this)(input)
        }));
    }

    handleTransformChange(e) {
        const selectedTransform = e.target.value;

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

    exportHtml() {
        const innerHtml = document.querySelector('.output').innerHTML,
            title = innerHtml.match(/<h1(.*?)>(.*?)<\/h1>/g)[0] || '',
            trimmedTitle = title.replace(/<h1(.*?)>/g, '').replace(/<\/h1>/g, ''),
            appendedTitle = trimmedTitle ? trimmedTitle + ' - organism' : 'organism',
            entireHtml = `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />

        <title>${appendedTitle}</title>
    </head>
    <body>
        ${innerHtml}
        <hr>
        <p id="export-footer">
            Created with
            <a href="https://myTerminal.github.io/organism" target="_blank">
                https://myTerminal.github.io/organism
            </a>
        </p>
    </body>
</html>`,
            blob = new Blob([entireHtml], { type: 'text/html;charset=utf-8' });

        FileSaver.saveAs(blob, `${trimmedTitle}.html`);
    }

    render() {
        return (
            <div className={'root-container layout-' + this.state.layout}>
                <div className="header">
                    <b>organism</b>
                    &nbsp;- A live-preview editor for org and more (v
                    {packageDetails.version}
                    )
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
                <Footer
                    layout={this.state.layout}
                    switchToLayout={(l) => this.switchToLayout(l)}
                    exportHtml={() => this.exportHtml()}
                />
            </div>
        );
    }
}
