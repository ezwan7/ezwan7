import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import NavigationService from "./src/common/NavigationService";
import AppNavigator from "./src/AppNavigator";
import {Provider} from 'react-redux';
import {store} from "./src/store/MyStore";


const App = () => {

    if (__DEV__) {
        console.log(`LOG: ${App.name}. renderCount: `, 'App');
    }

    return (
        <Provider store = {store}>
            <NavigationContainer
                ref = {(navigatorRef: any) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                }}
            >

                <AppNavigator/>

            </NavigationContainer>
        </Provider>
    );
}

export default App;


// TODO: Increment/Decrement

// TODO: Back button break in jump or other

// TODO: copy to cart page
// TODO: white loader, allow style in toast loader,
// TODO: New Input Design, height, size, float background,
// TODO: FingerPrint, SMS Login
// TODO: Invoke validation on submit, from utils file, custom validation and message
// TODO: info+html modal, all modal functions
// TODO: Input Params default, input clear on page open


// TODO: Filter page, price slider, Image Viewer,
// TODO: Route Active using Redux, Pull to refresh on seach page, header blinking,

// TODO: Search ontype list show, delay
// TODO: Custom Header: back button, right button, scroll animation, list header,
// TODO: Custom Bottom Tabs
// TODO: blur,
// TODO: update cart api fetch all product by id, and calculate EVERYTHING,
// TODO: Render Optimize Home screen, use event and redux

// No Internet Lottie
// Validation delay, on type gone
// mask forced value

