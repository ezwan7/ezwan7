import {persistCombineReducers} from "redux-persist";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage';

import AppNavigatorReducer from "./AppRedux";
import AuthReducer from "./AuthRedux";
import CartReducer from "./CartRedux";
import CategoryReducer from "./CategoryRedux";

const persistConfig: any = {
    key            : 'root',
    storage        : AsyncStorage,
    stateReconciler: autoMergeLevel2,
    blacklist      : [
        "appNavigator",
    ],
    whitelist      : [
        'cart',
        'auth',
        'category',
    ]
}

const myReducer = persistCombineReducers(persistConfig, {
    appNavigator: AppNavigatorReducer,
    cart        : CartReducer,
    auth        : AuthReducer,
    category    : CategoryReducer,
});

export default myReducer;
