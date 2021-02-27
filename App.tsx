import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import NavigationService from "./src/common/NavigationService";
import AppNavigator from "./src/AppNavigator";
import {Provider} from 'react-redux';
import {store} from "./src/store/MyStore";


console.disableYellowBox = true;

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


// TODO: replace push plugin


// TODO: minSDK test: FastImage, Geocoder, Layout, Pull to Refresh...........
// TODO: minSDK: Use condition based for not supported devices.


// TODO: Fast Image Issue on /
// TODO: List loader not showing, change momumtun to true,


// TODO: white loader, allow style in toast loader,
// TODO: New Input Design, height, size, float background,
// TODO: Validation delay, on type gone
// TODO: SMS Login
// TODO: Invoke validation on submit, from utils file, custom validation and message
// TODO: info+html modal, all modal functions


// TODO: Filter page, price slider, Image Viewer,
// TODO: Route Active using Redux, Pull to refresh on seach page, header blinking,

// TODO: Cart item open with selected attribute or fresh, cart open details page with limited and back navigation with edit feature
// TODO: same item, multiple choice should show as different item
// TODO: Product Details page condition, from cart page, to cart page.
// TODO: Search ontype list show, delay
// TODO: Custom Header: back button, right button, scroll animation, list header,
// TODO: Custom Bottom Tabs
// TODO: Google Map Address complete
// TODO: blur,
// TODO: update cart api fetch all product by id, and calculate EVERYTHING,
// TODO: Render Optimize Home screen, use event and redux,
// TODO: No password change option for social login,
// TODO: Multi line input,
// TODO: Section List Content Loader
// TODO: Options: Modal with search, BottomSheet with scroll button search, Option page search, multi select, button confirm,

// TODO: Options: All Api calls, check for success but empty array to store.

// TODO: Loading cancel with alert and api call cancel
// TODO: Auto login: API call redirect or page redirect: go back to prev page or reroute


// TODO: Online Cart
// TODO: Auth Clear careful with tokens on logout


// No Internet Lottie



