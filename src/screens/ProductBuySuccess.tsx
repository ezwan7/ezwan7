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

const ProductBuySuccess = ({route, navigation}: any) => {
    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ProductBuySuccess.name}. renderCount: `, renderCount);
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Go back to Login page:
                MyUtil.commonAction(false,
                                    null,
                                    MyConstant.CommonAction.navigate,
                                    MyConfig.routeName.Home,
                                    null,
                                    null,
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
                <LinearGradient style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0}]}
                                start = {MyStyle.LGWhitish.start}
                                end = {MyStyle.LGWhitish.end}
                                locations = {MyStyle.LGWhitish.locations}
                                colors = {MyStyle.LGWhitish.colors}
                >
                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                    >
                        <View style = {[{
                            alignItems      : "center",
                            marginBottom    : MyStyle.marginVerticalLogin,
                            marginHorizontal: MyStyle.marginHorizontalLogin,
                        }]}>
                            <LottieView source = {MyImage.lottie_check_in_success}
                                        autoPlay
                                        loop = {false}
                                        style = {styles.imageLottie}
                            />
                            <Text style = {styles.textOrderCompleted}>
                                {MyLANG.OrderCompleted}
                            </Text>
                            <Text style = {styles.textOrderCompletedDescription}>
                                {MyLANG.OrderCompletedDescription}
                            </Text>

                            <Text style = {styles.youOrderCompletedBackDesc}>
                                {MyLANG.OrderCompletedBackDesc}
                            </Text>

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.Close}
                                linearGradientStyle = {{marginTop: 10}}
                                onPress = {(e: any) => {
                                    MyUtil.commonAction(false,
                                                        null,
                                                        MyConstant.CommonAction.navigate,
                                                        MyConfig.routeName.Home,
                                                        null,
                                                        null,
                                    );
                                }}
                            />

                        </View>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    );
};

ProductBuySuccess.navigationOptions = {};

export default ProductBuySuccess;

const styles = StyleSheet.create(
    {
        imageLottie                  : {
            width: MyStyle.screenWidth * 0.5,

            marginTop: 10,
        },
        textOrderCompleted           : {
            marginTop: 44,
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge
        },
        textOrderCompletedDescription: {
            marginTop   : 2,
            marginBottom: 24,
            alignSelf   : "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        youOrderCompletedBackDesc    : {
            marginTop: 60,
            textAlign: "center",
            ...MyStyleSheet.subHeaderPage
        },
    }
);

