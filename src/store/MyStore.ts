import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore} from "redux-persist";

import myReducer from "./MyReducers";

const middleware = [
    thunk,
    // more middleware
];

const store = createStore(myReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export {store, persistor};
