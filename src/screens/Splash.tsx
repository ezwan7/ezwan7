import React from 'react';

import MyUtil from '../common/MyUtil';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import {MyConstant} from "../common/MyConstant";
import MyLANG from "../shared/MyLANG";
import MyColor from "../common/MyColor";
import MyAuth from "../common/MyAuth";
import {switchAppNavigator} from "../store/AppRedux";
import {useDispatch} from "react-redux";

// console.disableYellowBox = true;
// console.ignoredYellowBox = ['Require cycle: node_modules/react-native-paper'];

// Active Hermes, Uncomment gradle.properties

let renderCount = 0;

const SplashScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SplashScreen.name}. renderCount: `, renderCount);
    }

    const dispatch = useDispatch();

    React.useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${SplashScreen.name}. useEffect: `, '');

        // MyUtil.printConsole(true, 'log', 'LOG: HermesInternal: ', {'isHermes': global.HermesInternal});

        prepareData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const prepareData = async () => {

        // 1: App is New -> Show Intro Slide Page. 1: Show Online Data, 2: Show Local Data.
        // 2: App is Old ->
        //              Saved Login ->
        //                    1: Login Success: Check routeAction -> Back, Home, No Action.
        //                    1: Login Failed: Show Config Based ->
        //              Config ->
        //                    1: App Require Login: Show Login Page.
        //                    2: App don't require Login: Show Home Tab.
        //


        // Get Firebase Token
        // MyUtil.firebaseGetToken();


        // Get Current Location only if permission already given:


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
                                null,
                                MyConstant.NAVIGATION_ACTIONS.SWITCH_APP_NAVIGATOR
            );

        } else { // App is New:

            fetchIntroSlides();
        }

        /*const location: any = await MyUtil.GetCurrentPosition(
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
        }*/
    }

    const fetchIntroSlides = async () => {

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.intro_slides,
                    {
                        "app_ver"      : MyConfig.app_version,
                        "app_build_ver": MyConfig.app_build_version,
                        "platform"     : MyConfig.app_platform,
                        "device"       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, false, false, true
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : MyAPI.intro_slides,
            'response': response,
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response?.data?.data?.data?.slides > 0) {

            // If Slides Exists, Update Local Slide Data with Online Data:
            const slides     = response.data.data.data.slides;
            const Intro: any = [];

            //TODO: store in redux
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
            hideSplashAndSwitch(MyConfig.appNavigation.IntroStackScreen, null);

        } else {

            // No Intro Data Found, Show Default Text, Image:
            hideSplashAndSwitch(MyConfig.appNavigation.IntroStackScreen, null);

        }
    }

    const hideSplashAndSwitch = (navigatorName: any, actions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: hideSplashAndSwitch: ', {'navigatorName': navigatorName, 'actions': actions});

        dispatch(switchAppNavigator(navigatorName));

    };

    return null;
}

SplashScreen.navigationOptions = {};

export default SplashScreen;

