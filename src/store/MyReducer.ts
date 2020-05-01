import {persistCombineReducers} from "redux-persist";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage';

import AppNavigatorReducer from "./AppRedux";
import IntroReducer from "./IntroRedux";
import UserLocationReducer from "./UserLocation";
import AuthReducer from "./AuthRedux";
import AppInputReducer from "./AppInputRedux";
import AppInfoReducer from "./AppInfoRedux";
import AppDataReducer from "./AppDataRedux";
import CartReducer from "./CartRedux";
import CategoryReducer from "./CategoryRedux";
import AddressReducer from "./AddressRedux";
import OrderReducer from "./OrderRedux";
import NotificationReducer from "./NotificationRedux";

const persistConfig: any = {
    key    : 'root',
    storage: AsyncStorage,

    stateReconciler: autoMergeLevel2,

    blacklist: [
        "appNavigator",
        "intro",
        "user_location",
    ],
    whitelist: [
        'intro',
        'auth',
        'app_input',
        'app_info',
        'app_data',
        'cart',
        'category',
        'addresses',
        'orders',
        'notification',
    ]
}

const myReducer = persistCombineReducers(persistConfig, {
    appNavigator : AppNavigatorReducer,
    intro        : IntroReducer,
    user_location: UserLocationReducer,
    auth         : AuthReducer,
    app_input    : AppInputReducer,
    app_info     : AppInfoReducer,
    app_data     : AppDataReducer,
    cart         : CartReducer,
    category     : CategoryReducer,
    addresses    : AddressReducer,
    orders       : OrderReducer,
    notification : NotificationReducer,
});

export default myReducer;
