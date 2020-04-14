import {persistCombineReducers} from "redux-persist";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage';

import AppNavigatorReducer from "./AppRedux";
import IntroReducer from "./IntroRedux";
import AuthReducer from "./AuthRedux";
import AppDataReducer from "./AppDataRedux";
import AppInputReducer from "./AppInputRedux";
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
        'intro',
        'auth',
        'app_data',
        'app_input',
        'cart',
        'category',
    ]
}

const myReducer = persistCombineReducers(persistConfig, {
    appNavigator: AppNavigatorReducer,
    intro       : IntroReducer,
    auth        : AuthReducer,
    app_data    : AppDataReducer,
    app_input   : AppInputReducer,
    cart        : CartReducer,
    category    : CategoryReducer,
});

export default myReducer;
