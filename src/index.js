import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import 'jspdf/dist/polyfills.es';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { rootSaga } from './store';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { enableES5 } from 'immer';
enableES5();

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('ajoonamu'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
