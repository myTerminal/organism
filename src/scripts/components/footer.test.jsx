/* global describe it afterEach */

import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import sinon from 'sinon';
import Footer from './footer.jsx';

const should = require('chai').should(),
      noOperation = function () {};

describe('footer', function () {
    afterEach(cleanup);

    it('renders without problems with usual props', function () {
        const { container } = render(<Footer layout="both" switchToLayout={noOperation} exportHtml={noOperation} />);
        const footerDom = container.querySelector('.footer');

        should.exist(footerDom);
    });

    it('switches layouts according to selection', function () {
        const switchToLayout = sinon.fake();
        const { container } = render(<Footer layout="both" switchToLayout={switchToLayout} exportHtml={noOperation} />);
        const buttonForBoth = container.querySelector('.fa-columns');
        const buttonForPreview = container.querySelector('.fa-file-image-o');
        const buttonForCode = container.querySelector('.fa-file-code-o');

        fireEvent.click(buttonForBoth);
        switchToLayout.called.should.equal(true);
        switchToLayout.calledWith('both').should.equal(true);

        fireEvent.click(buttonForPreview);
        switchToLayout.called.should.equal(true);
        switchToLayout.calledWith('right').should.equal(true);

        fireEvent.click(buttonForCode);
        switchToLayout.called.should.equal(true);
        switchToLayout.calledWith('left').should.equal(true);
    });

    it('tries to export on user request', function () {
        const exportHtml = sinon.fake();
        const { container } = render(<Footer layout="both" switchToLayout={noOperation} exportHtml={exportHtml} />);
        const buttonToExport = container.querySelector('.fa-hdd-o');

        fireEvent.click(buttonToExport);
        exportHtml.called.should.equal(true);
    });
});
