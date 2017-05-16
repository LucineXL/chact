import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { test } from 'actions/test';
class Chact1 extends Component {
    // componentWillMount() {
    //     this.props.test();
    // }
    render() {
        return (
            <div>
                This is Chact1.
            </div>
        );
    }
}
function mapStateToProps(state) {
    const app = state.get('app');
    return { app }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chact1)
