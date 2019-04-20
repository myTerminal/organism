/* global describe it afterEach */

import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import sinon from 'sinon';

import Selector from './selector.jsx';

const should = require('chai').should();
const noOperation = () => {};

describe('selector', () => {
    afterEach(cleanup);

    it('renders provided options', () => {
        const transforms = [
            {
                name: 'first',
                transformFunction: 'first-one'
            },
            {
                name: 'second',
                transformFunction: 'second-one'
            },
            {
                name: 'third',
                transformFunction: 'third-one'
            }
        ];

        const { container } = render(<Selector selectedTransform="first" onChange={noOperation} transforms={transforms} />);
        const select = container.querySelector('select');

        select.options.length.should.equal(3);

        select.options[0].value.should.equal('first');
        select.options[1].value.should.equal('second');
        select.options[2].value.should.equal('third');
    });

    it('selects the default provided option at the start', () => {
        const transforms = [
            {
                name: 'first',
                transformFunction: 'first-one'
            },
            {
                name: 'second',
                transformFunction: 'second-one'
            },
            {
                name: 'third',
                transformFunction: 'third-one'
            }
        ];

        const { container } = render(<Selector selectedTransform="first" onChange={noOperation} transforms={transforms} />);
        const select = container.querySelector('select');

        select.value.should.equal('first');
    });

    it('reports selection change', () => {
        const onSelectionChange = sinon.fake(),
            transforms = [
                {
                    name: 'first',
                    transformFunction: 'first-one'
                },
                {
                    name: 'second',
                    transformFunction: 'second-one'
                },
                {
                    name: 'third',
                    transformFunction: 'third-one'
                }
            ];

        const { container } = render(<Selector selectedTransform="first" onChange={onSelectionChange} transforms={transforms} />);
        const select = container.querySelector('select');

        fireEvent.change(select);

        onSelectionChange.called.should.equal(true);
    });
});
