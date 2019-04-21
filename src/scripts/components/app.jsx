/* global require Blob document */

import React from 'react';
import FileSaver from 'file-saver';
import localforage from 'localforage';

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

localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'organism'
});

export default class App extends React.Component {
    constructor() {
        super();

        const context = this;

        this.transforms = [
            {
                name: 'Org',
                transformFunction: function (text) {
                    return this.orgParser
                        .parse(text)
                        .convert(org.ConverterHTML, { headerOffset: 0 })
                        .toString();
                }
            },
            {
                name: 'Markdown',
                transformFunction: text => markdown.makeHtml(text)
            },
            {
                name: 'ReStructuredText',
                transformFunction: text => markdown.makeHtml(rst2mdown(text))
            },
            {
                name: 'TxStyle',
                transformFunction: text => textilejs(text)
            },
            // {
            //     name: 'AsciiDoc',
            //     transformFunction: text => asciidoctor.convert(text)
            // },
            {
                name: 'Creole',
                transformFunction: text => creole.parse(text)
            },
            {
                name: 'BBCode',
                transformFunction: text => bbcodeParser.parseString(text)
            }
        ];

        this.orgParser = new org.Parser();

        this.state = {
            inputText: samples.Org,
            selectedTransform: this.transforms[0],
            layout: 'both'
        };

        Promise
            .all(
                [
                    localforage.getItem('inputText'),
                    localforage.getItem('transform'),
                    localforage.getItem('layout')
                ]
            )
            .then(
                (
                    [
                        inputText,
                        storedTransformName,
                        layoutCode
                    ]
                ) => {
                    context.setState(state => ({
                        inputText: inputText || '',
                        selectedTransform: context.getTransformByName(storedTransformName)
                                        || context.transforms[0],
                        layout: layoutCode || 'both'
                    }));
                }
            );
    }

    getTransformByName(n) {
        return this.transforms.filter(t => t.name === n)[0];
    }

    handleTextChange(e) {
        const input = e.target.value;

        this.setState(previousState => ({
            inputText: input
        }));

        localforage.setItem('inputText', input);
    }

    handleTransformChange(e) {
        const selectedTransformName = e.target.value;

        this.setState(() => ({
            inputText: samples[selectedTransformName],
            selectedTransform: this.getTransformByName(selectedTransformName)
        }));

        localforage.setItem('inputText', samples[selectedTransformName]);
        localforage.setItem('transform', selectedTransformName);
    }

    switchToLayout(layoutCode) {
        this.setState({
            layout: layoutCode
        });

        localforage.setItem('layout', layoutCode);
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

    reset() {
        const inputText = samples[this.state.selectedTransform.name];

        this.setState(state => ({
            inputText
        }));

        localforage.setItem('inputText', inputText);
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
                    <Input
                        text={this.state.inputText}
                        onChange={(e) => this.handleTextChange(e)}
                    />
                    <Output
                        text={
                            this.state.selectedTransform.transformFunction
                                .bind(this)(this.state.inputText)
                        }
                    />
                    <Selector
                        transforms={this.transforms}
                        selectedTransform={this.state.selectedTransform}
                        onChange={(t) => this.handleTransformChange(t)}
                    />
                </div>
                <Footer
                    layout={this.state.layout}
                    switchToLayout={(l) => this.switchToLayout(l)}
                    exportHtml={() => this.exportHtml()}
                    reset={() => this.reset()}
                />
            </div>
        );
    }
}
