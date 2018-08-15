/* global describe it */

import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Input from './input.jsx';

const should = require('chai').should();

describe('input', function () {
    it('renders without problems', function () {
        const noOperation = function () {},
            input = TestUtils.renderIntoDocument(<Input value="" onChange={noOperation} />);

        should.exist(input);
    });
});
