/* global describe it afterEach */

import React from 'react';
import { cleanup, render } from 'react-testing-library';
import sinon from 'sinon';

import Output from './output.jsx';

const should = require('chai').should();

describe('output', () => {
    afterEach(cleanup);

    it('renders without problems with empty props', function () {
        const { container } = render(<Output text="" />);
        const outputDiv = container.querySelector('.output');

        should.exist(outputDiv);
    });

    it('renders text received through props', function () {
        const { container } = render(<Output text="<h1>Sample text</h1>" />);
        const outputDiv = container.querySelector('.output');

        outputDiv.innerHTML.should.equal('<h1>Sample text</h1>');
    });
});
