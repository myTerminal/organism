/* global require */

import '../styles/styles.less';

const React = require('react');
const ReactDOM = require('react-dom');

const page = document.getElementById('page');

var Test = React.createClass({
    render: function () {
        return <div className='test'>This is a test!</div>;
    }
});

ReactDOM.render(<Test />, page);
