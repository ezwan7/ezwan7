import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from "@react-navigation/native";

import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import Splash from "react-native-splash-screen";

import {StyleSheet, View, Text, Image, SafeAreaView, ImageBackground, BackHandler} from 'react-native';
import {StatusBarLight} from "../components/MyComponent";

import MyImage from "../shared/MyImage";
import MyIcon from '../components/MyIcon';
import MyUtil from "../common/MyUtil";
import {MyConfig} from "../shared/MyConfig";
import {MyConstant} from "../common/MyConstant";
import MyColor from "../common/MyColor";
import {MyStyle} from "../common/MyStyle";
import MyAuth from "../common/MyAuth";
import MyLANG from "../shared/MyLANG";

let renderCount = 0;

const IntroScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${IntroScreen.name}. renderCount: `, renderCount);
    }

    const [slides, setSlides] = useState(MyConfig.Intro);

    useFocusEffect(
        useCallback(() => {

            const onBackPress = () => {
                return MyUtil.onBackButtonPress(navigation);
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${IntroScreen.name}. useEffect: `, null);

        // Get from redux and Update Local Intro Data:
        setSlides(MyConfig.Intro);

        if (route?.params?.splash !== false) { // If splash param is not false then hide splash:
            MyUtil.printConsole(true, 'log', `LOG: ${IntroScreen.name}. route?.params?.splash: `, route?.params?.splash);
            Splash.hide();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const _renderItem = ({item, dimensions}: any) => (
        <Fragment>
            <StatusBarLight/>
            <LinearGradient
                style = {[
                    styles.mainContent,
                    {
                        width: dimensions.width,
                    },
                ]}
                start = {item.start}
                end = {item.end}
                locations = {item.locations}
                colors = {item.colors}
            >
                <ImageBackground
                    source = {MyImage.electronics_pattern}
                    style = {styles.imgBackground}
                    resizeMode = "repeat"
                >
                    {/*<MyIcon.Ionicons
                    style={{backgroundColor: 'transparent'}}
                    name={item.icon}
                    size={200}
                    color="white"
                />*/}
                    <Image source = {item.image}
                           defaultSource = {MyImage.defaultSource}
                           style = {styles.image}
                           resizeMode = "contain"/>
                    <View>
                        <Text style = {styles.title}>{item.title}</Text>
                        <Text style = {styles.text}>{item.text}</Text>
                    </View>
                </ImageBackground>
            </LinearGradient>
        </Fragment>
    );

    const _renderNextButton = () => {
        return (
            <View style = {styles.buttonCircle}>
                <MyIcon.Ionicons
                    name = "md-arrow-round-forward"
                    color = {MyColor.Material.WHITE}
                    size = {24}
                />
            </View>
        );
    };
    const _renderDoneButton = () => {
        return (
            <View style = {styles.buttonCircle}>
                <MyIcon.Ionicons
                    name = "md-checkmark"
                    color = {MyColor.Material.WHITE}
                    size = {24}
                />
            </View>
        );
    };


    const _onDone = async () => {
        // Intro Flow Complete, Set APP_FRESH_INSTALL to True to not to show Intro page again:
        const storage: any = await MyUtil.AsyncStorageSet(MyConfig.AsyncStorage.APP_FRESH_INSTALL,
                                                          MyConstant.APP_FRESH_INSTALL.NO,
                                                          MyConstant.SHOW_MESSAGE.TOAST
        );
        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: await-response: ', {
            'key'    : MyConfig.AsyncStorage.APP_FRESH_INSTALL,
            'storage': storage,
        });

        // Check if Have Saved Login and Call Silent Background Login:
        MyAuth.isSavedLogin(false,
                            MyLANG.Loading + '...',
                            true,
                            null,
                            MyConstant.NAVIGATION_ACTIONS.SWITCH_APP_NAVIGATOR
        );
    }

    return (
        <AppIntroSlider
            slides = {slides}
            renderItem = {_renderItem}
            renderDoneButton = {_renderDoneButton}
            renderNextButton = {_renderNextButton}
            // bottomButton
            // showPrevButton
            // showSkipButton
            // hideNextButton
            // hideDoneButton
            // onSkip={() => console.log("skipped")}
            onDone = {_onDone}
        />
    );
}

export default IntroScreen;

const styles = StyleSheet.create(
    {
        mainContent  : {
            flex: 1,
        },
        imgBackground: {
            flex          : 1,
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'space-around',
            alignItems    : 'center',
        },
        image        : {
            width : MyStyle.screenWidth * 0.6,
            height: MyStyle.screenWidth * 0.6,
        },
        title        : {
            fontFamily  : MyStyle.FontFamily.OpenSans.semiBold,
            fontSize    : 21,
            color       : MyColor.Material.WHITE,
            textAlign   : 'center',
            marginBottom: 16,
        },
        text         : {
            fontFamily       : MyStyle.FontFamily.OpenSans.regular,
            fontSize         : 14,
            color            : MyColor.Material.GREY['15'],
            textAlign        : 'center',
            paddingHorizontal: 16,
        },
        buttonCircle : {
            width          : 48,
            height         : 48,
            borderRadius   : 100,
            justifyContent : 'center',
            alignItems     : 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
    }
)
