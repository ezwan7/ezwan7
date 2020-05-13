import React from 'react';
import {useSelector} from "react-redux";
import {SplashStackScreen, IntroStackScreen, LoginStackScreen, BottomTabNavigator} from "./NavContainer";

import {MyConfig} from "./shared/MyConfig";

const AppNavigator = () => {

    let navigator: any = undefined;

    const appNavigator = useSelector((state: any) => state.appNavigator);

    if (__DEV__) {
        console.log(`LOG: ${AppNavigator.name}. renderCount: `, 'AppNavigator');
        // console.log(`LOG: ${AppNavigator.name}. renderCount: `, {appNavigator});
    }

    switch (appNavigator) {
        case MyConfig.appNavigation.HomeNavigator:
            navigator = <BottomTabNavigator/>;
            break;
        case MyConfig.appNavigation.LoginStackScreen:
            navigator = <LoginStackScreen/>;
            break;
        case MyConfig.appNavigation.IntroStackScreen:
            navigator = <IntroStackScreen/>;
            break;
        case MyConfig.appNavigation.SplashStackScreen:
        default:
            navigator = <SplashStackScreen/>;
            break;
    }

    return navigator;
};

export default AppNavigator;
