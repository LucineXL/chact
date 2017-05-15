import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { test } from 'actions/test';

class JoinGroup extends Component {
    // componentWillMount() {
    //     this.props.test();
    // }
    render() {
        return (
            <div className='group'>
                
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

export default connect(mapStateToProps, mapDispatchToProps)(JoinGroup)
