import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AppContainer from "./src/NavContainer";
import NavigationService from "./src/common/NavigationService";
import Splash from "react-native-splash-screen";

const App = () => {
    Splash.hide();

    return <NavigationContainer
        ref = {(navigatorRef: any) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
        }}
    >
        <AppContainer/>
    </NavigationContainer>;
}

export default App;


// New Navigation: Push Pop Animation, Switch From Stack to Stack, Splash Show Until Ready
// Git
// Custom Header: list header, back button, scroll animation
// blur, back button handeler, nav animation, header blinking, extra shadow component,
// New React Navigation, switch replace, combine stack drawer tabs, toptab style, header shadow,

// Google Map key replace
// Facebook and Google+ Login Replace
// Drawer Item on press style, padding of items, border radius,
// Custom Bottom Drawer and Sidebar Item
// Button Input Icon Left Right
