/* global describe it afterEach */

import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import sinon from 'sinon';

import Input from './input.jsx';

const should = require('chai').should();
const noOperation = () => {};

describe('input', () => {
    afterEach(cleanup);

    it('renders without problems with empty props', () => {
        const { container } = render(<Input text="" onChange={noOperation} />);
        const textArea = container.querySelector('textarea');

        should.exist(textArea);
    });

    it('renders text received through props', () => {
        const { container } = render(<Input text="Sample text" onChange={noOperation} />);
        const textArea = container.querySelector('textarea');

        textArea.innerHTML.should.equal('Sample text');
    });

    it.skip('reports text change', () => {
        const onTextChange = sinon.fake(),
            eventData = {
                target: {
                    value: 'New Text'
                }
            };

        const { container } = render(<Input text="Sample text" onChange={onTextChange} />);
        const textArea = container.querySelector('textarea');

        textArea.value = 'New Text';
        fireEvent.change(textArea);

        onTextChange.called.should.equal(true);
        onTextChange.calledWith(eventData).should.equal(true);
    });
});
