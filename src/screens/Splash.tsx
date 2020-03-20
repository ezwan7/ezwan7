import React, {useState, useEffect, Fragment} from 'react';
import {StatusBarLight} from '../components/MyComponent';
import Splash from 'react-native-splash-screen';

import MyUtil from '../common/MyUtil';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import {MyConstant} from "../common/MyConstant";
import MyLANG from "../shared/MyLANG";
import MyImage from "../shared/MyImage";
import MyColor from "../common/MyColor";
import MyAuth from "../common/MyAuth";

console.disableYellowBox = true;
// console.ignoredYellowBox = ['Require cycle: node_modules/react-native-paper'];

// declare var global: { HermesInternal: null | {} };
// const isHermes = () => global.HermesInternal != null;

// Active Hermes, Uncomment gradle.properties

const SplashScreen = ({}) => {

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        MyUtil.printConsole(true, 'log', 'LOG: SplashScreen: useEffect: ', {});
        // MyUtil.printConsole(true, 'log', 'LOG: HermesInternal: ', {'isHermes': global.HermesInternal});
        prepareData();
    }, [])

    return null
    /*<Fragment>
        <StatusBarLight/>
        <View style={styles.viewStyles}>
            <Text style={styles.textStyles}>
                Splash Screen
            </Text>
        </View>
    </Fragment>*/
    /*<SafeAreaView>
        <Image
            source={MyImage.splashScreen}
            style={styles.imageStyles}
            resizeMode='cover'
        />
    </SafeAreaView>*/
    // )
}

/**
 * All necessary task like: pre-load data from server, checking local resource, configure settings,...
 * Should be done in this function and redirect to other screen when complete.
 */
const prepareData = async () => {

    // Get Firebase Token
    // MyUtil.firebaseGetToken();

    // 1: App is New -> Show Intro Slide Page. 1: Show Online Data, 2: Show Local Data.
    // 2: App is Old ->
    //              Saved Login ->
    //                    1: Login Success: Check routeAction -> Back, Home, No Action.
    //                    1: Login Failed: Show Config Based ->
    //              Config ->
    //                    1: App Require Login: Show Login Page.
    //                    2: App don't require Login: Show Home Tab.
    //


    // Check if App is New or Old:
    const storage: any = await MyUtil.AsyncStorageGet(MyConfig.AsyncStorage.APP_FRESH_INSTALL, false);

    MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageGet: await-response: ', {
        'key'    : MyConfig.AsyncStorage.APP_FRESH_INSTALL,
        'storage': storage
    });

    if (storage === MyConstant.APP_FRESH_INSTALL.NO) { // App is Old:

        // Check if Have Saved Login and Call Silent Background Login:
        MyAuth.isSavedLogin(false,
                            MyLANG.Loading + '...',
                            true,
                            MyConstant.LOGIN_REDIRECT.ROUTE_TO_HOME,
                            MyConstant.NAVIGATION_ACTIONS.HIDE_SPLASH
        );

    } else { // App is New:

        fetchIntroSlides();
    }

    const location: any = await MyUtil.GetCurrentPosition(
        {
            enableHighAccuracy  : true,
            timeout             : 15000,
            maximumAge          : 0,
            forceRequestLocation: true
        }, MyConstant.SHOW_MESSAGE.ALERT);
    MyUtil.printConsole(true, 'log', 'LOG: GetCurrentPosition: await-response: ', {
        'location': location,
    });
    if (location && location.data.coords && location.data.coords.latitude && location.data.coords.longitude) {
        //TODO:
    }
}


const fetchIntroSlides = async () => {

    const response: any = await MyUtil
        .myHTTP(false, MyConstant.HTTP_POST, MyAPI.INTRO_SLIDES,
                {
                    "app_ver"      : MyConfig.app_version,
                    "app_build_ver": MyConfig.app_build_version,
                    "platform"     : MyConfig.app_platform,
                    "device"       : null,
                }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, false, false, true
        );

    MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
        'apiURL'  : MyAPI.INTRO_SLIDES,
        'response': response,
    });

    if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data && response.data.data.data.slides && response.data.data.data.slides > 0) {

        // If Slides Exists, Update Local Slide Data with Online Data:
        const slides     = response.data.data.data.slides;
        const Intro: any = [];
        for (const [index, slide] of slides.entries()) {
            Intro.push(
                {
                    key            : index.toString(),
                    title          : slide.header,
                    text           : slide.text,
                    icon           : 'ios-images',
                    image          : {'uri': MyAPI.mediaServer + 'slides/' + slide.img},
                    backgroundColor: MyColor.Primary.first,
                    colors         : MyColor.PrimaryGradient.first,
                }
            )
        }

        // Intro Data Exists, Show Online Text, Image:
        hideSplashAndNavigate(MyConfig.routeName.IntroStack, {}, null);

    } else {

        // No Intro Data Found, Show Default Text, Image:
        hideSplashAndNavigate(MyConfig.routeName.IntroStack, {}, null);

    }
}


const hideSplashAndNavigate = (routeName: any, params: any, actions: any) => {
    MyUtil.reactNavigate(routeName, params, actions);
    Splash.hide();
};


SplashScreen.navigationOptions = {
    headerShown: false,
}

export default SplashScreen;

