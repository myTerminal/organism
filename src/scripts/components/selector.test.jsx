/* global describe it afterEach */

import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import sinon from 'sinon';
import Selector from './selector.jsx';

const should = require('chai').should(),
    noOperation = function () {};

describe('selector', function () {
    afterEach(cleanup);

    it('renders provided options', function () {
        const transforms = {
            first: 'first-one',
            second: 'second-one',
            third: 'third-one'
        };

        const { container } = render(<Selector selectedTransform="first" onChange={noOperation} transforms={transforms} />);
        const select = container.querySelector('select');

        select.options.length.should.equal(3);

        select.options[0].value.should.equal('first');
        select.options[1].value.should.equal('second');
        select.options[2].value.should.equal('third');
    });

    it('selects the default provided option at the start', function () {
        const transforms = {
            first: 'first-one',
            second: 'second-one',
            third: 'third-one'
        };

        const { container } = render(<Selector selectedTransform="first" onChange={noOperation} transforms={transforms} />);
        const select = container.querySelector('select');

        select.value.should.equal('first');
    });

    it('reports selection change', function () {
        const onSelectionChange = sinon.fake(),
            transforms = {
                first: 'first-one',
                second: 'second-one',
                third: 'third-one'
            };

        const { container } = render(<Selector selectedTransform="first" onChange={onSelectionChange} transforms={transforms} />);
        const select = container.querySelector('select');

        fireEvent.change(select);

        onSelectionChange.called.should.equal(true);
    });
});
