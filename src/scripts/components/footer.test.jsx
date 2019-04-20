/* global describe it afterEach */

import React from 'react';
import { cleanup, render, fireEvent } from 'react-testing-library';
import sinon from 'sinon';

import Footer from './footer.jsx';

const should = require('chai').should();
const noOperation = () => {};

describe('footer', () => {
    afterEach(cleanup);

    it('renders without problems with usual props', () => {
        const { container } = render(<Footer layout="both" switchToLayout={noOperation} exportHtml={noOperation} reset={noOperation} />);
        const footerDom = container.querySelector('.footer');

        should.exist(footerDom);
    });

    it('switches layouts according to selection', () => {
        const switchToLayout = sinon.fake();

        const { container } = render(<Footer layout="both" switchToLayout={switchToLayout} exportHtml={noOperation} reset={noOperation} />);
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

    it('tries to export on user request', () => {
        const exportHtml = sinon.fake();

        const { container } = render(<Footer layout="both" switchToLayout={noOperation} exportHtml={exportHtml} reset={noOperation} />);
        const buttonToExport = container.querySelector('.fa-hdd-o');

        fireEvent.click(buttonToExport);
        exportHtml.called.should.equal(true);
    });

    it('tries to reset on user request', () => {
        const reset = sinon.fake();

        const { container } = render(<Footer layout="both" switchToLayout={noOperation} exportHtml={noOperation} reset={reset} />);
        const buttonToReset = container.querySelector('.fa-refresh');

        fireEvent.click(buttonToReset);
        reset.called.should.equal(true);
    });
});
