import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Immutable from 'immutable'
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import socket from 'store/socket';
import configureStore from './store';
import route from './routes';
import 'antd/dist/antd.css';
const store = configureStore(Immutable.Map());
const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
        return state.get('routing').toJS();
    }
});
if (location.hash.slice(2)) {
    location.replace('/');
}
class App extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        socket.emit('connection', () => {
            console.log('connect');
        })
        socket.emit('disconnect', () => {
          console.log('duankai');
            sessionStorage.clear();
        })
        socket.on('systemInfo', (message) => {
            console.log(message);
        })
        // socket.on('message', (message) => {
        //     console.log(message)
        // })
    }
    render() {
        return (
            <Provider store={store}>
                <Router routes={route} history={history}>
                </Router>
            </Provider >
        )
    }
}
render(<App />, document.getElementById('app'));
