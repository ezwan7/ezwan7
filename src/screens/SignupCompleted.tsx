import React, {useState, useEffect, Fragment, useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyUtil from '../common/MyUtil';
import MyAuth from '../common/MyAuth';

import {StatusBarDark} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";
import LottieView from "lottie-react-native";

let renderCount = 0;

const SignupCompletedScreen = ({route, navigation}: any) => {
    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SignupCompletedScreen.name}. renderCount: `, renderCount);
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Go back to Login page:
                MyUtil.stackAction(false,
                                   null,
                                   MyConstant.StackAction.pop,
                                   2,
                                   null,
                                   null
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const formSubmit = async (e: any) => {

    };

    return (
        <Fragment>
            <StatusBarDark/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <LinearGradient style = {[MyStyleSheet.SafeAreaView3, {}]}
                                start = {MyStyle.LGWhitish.start}
                                end = {MyStyle.LGWhitish.end}
                                locations = {MyStyle.LGWhitish.locations}
                                colors = {MyStyle.LGWhitish.colors}>
                    <ScrollView contentInsetAdjustmentBehavior = "automatic">
                        <View style = {[MyStyleSheet.mainView, {
                            alignItems      : "center",
                            marginBottom    : MyStyle.marginVerticalLogin,
                            marginHorizontal: MyStyle.marginHorizontalLogin,
                        }]}>
                            <LottieView source = {MyImage.lottie_confirmation}
                                        autoPlay
                                        loop = {false}
                                        style = {styles.imageLottie}
                            />
                            <Text style = {styles.textRegistrationCompleted}>
                                {MyLANG.RegistrationCompleted}
                            </Text>
                            <Text style = {styles.textRegistrationDescription}>
                                {MyLANG.RegistrationCompletedTitleDescription}
                            </Text>

                            {
                                MyConfig.registrationAction === MyConstant.RegistrationAction.welcome_screen_only &&
                                <>
                                    <Text style = {styles.youMayLoginNow}>
                                        {MyLANG.YouMayLoginNow}
                                    </Text>
                                    <MyButton
                                        color = {MyStyle.LGButtonPrimary}
                                        title = {MyLANG.Close}
                                        linearGradientStyle = {{marginTop: 10}}
                                        onPress = {(e: any) => {
                                            MyUtil.stackAction(false,
                                                               null,
                                                               MyConstant.StackAction.pop,
                                                               2,
                                                               null,
                                                               null
                                            );
                                        }}
                                    />
                                </>
                            }
                            {
                                MyConfig.registrationAction === MyConstant.RegistrationAction.verification_needed &&
                                <>
                                    <Text style = {styles.youMayLoginNow}>
                                        {MyLANG.WeWillVerify}
                                    </Text>
                                    <MyButton
                                        color = {MyStyle.LGButtonPrimary}
                                        title = {MyLANG.Close}
                                        linearGradientStyle = {{marginTop: 10}}
                                        onPress = {(e: any) => {
                                            MyUtil.stackAction(false,
                                                               null,
                                                               MyConstant.StackAction.pop,
                                                               2,
                                                               null,
                                                               null
                                            );
                                        }}
                                    />
                                </>
                            }
                            {
                                MyConfig.registrationAction === MyConstant.RegistrationAction.auto_login &&
                                <>
                                    <Text style = {styles.youMayLoginNow}>
                                        {MyLANG.PressToLogin}
                                    </Text>
                                    <MyButton
                                        color = {MyStyle.LGButtonPrimary}
                                        title = {MyLANG.LoginNow}
                                        linearGradientStyle = {{marginTop: 10}}
                                        onPress = {(e: any) => {
                                            //TODO: auto login
                                        }}
                                    />
                                </>
                            }

                        </View>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    );
};

SignupCompletedScreen.navigationOptions = {};

export default SignupCompletedScreen;

const styles = StyleSheet.create(
    {
        imageLottie                : {
            width: MyStyle.screenWidth * 0.5,

            marginTop: 10,
        },
        textRegistrationCompleted  : {
            marginTop: 44,
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge
        },
        textRegistrationDescription: {
            marginTop   : 2,
            marginBottom: 24,
            alignSelf   : "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        youMayLoginNow             : {
            marginTop: 60,
            textAlign: "center",
            ...MyStyleSheet.subHeaderPage
        },
    }
);

