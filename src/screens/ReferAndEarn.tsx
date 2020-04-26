import React, {useState, useEffect, Fragment} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from "lottie-react-native";

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
import {useSelector} from "react-redux";

let renderCount = 0;

const ReferAndEarn = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${ReferAndEarn.name}. renderCount: `, renderCount);
    }

    const user: any = useSelector((state: any) => state.auth.user);

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${ReferAndEarn.name}. useEffect: `, {user});

        if (!user?.referral_code?.length) {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.ReferralCodeNotFound, false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <StatusBarDark/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <LinearGradient
                    style = {[MyStyleSheet.SafeAreaView3, {}]}
                    start = {MyStyle.LGWhitish.start}
                    end = {MyStyle.LGWhitish.end}
                    locations = {MyStyle.LGWhitish.locations}
                    colors = {MyStyle.LGWhitish.colors}
                >

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{}}
                    >

                        <View style = {[MyStyleSheet.viewPageLogin, {alignItems: "center"}]}>
                            <LottieView
                                source = {MyImage.lottie_love}
                                autoPlay
                                loop = {true}
                                style = {styles.imageLottie}
                            />
                            <Text style = {styles.textReferAndEarn}>
                                {MyLANG.ReferAndEarn}
                            </Text>
                            <Text style = {styles.textReferAndEarnDescription}>
                                {MyLANG.ReferAndEarnDetails}
                            </Text>
                            <Text style = {styles.textCode}>
                                {user?.referral_code || '-'}
                            </Text>
                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.Share}
                                linearGradientStyle = {{marginTop: 10}}
                                onPress = {(e: any) => {
                                    if (user?.referral_code?.length > 0) {
                                        MyUtil.share(MyConstant.SHARE.TYPE.open,
                                                     false,
                                                     {
                                                         message: `${MyLANG.ShareRefereCodeDetails}\n${user?.referral_code}`,
                                                         url    : MyConfig.android_store_link,
                                                     },
                                                     false
                                        )
                                    } else {
                                        MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.ReferralCodeNotFound, false);

                                    }
                                }}
                            />
                        </View>

                    </ScrollView>

                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    );
};

ReferAndEarn.navigationOptions = {};

export default ReferAndEarn;

const styles = StyleSheet.create(
    {
        imageLottie                : {
            width: MyStyle.screenWidth * 0.5,

            marginTop   : 10,
            marginBottom: 10,
        },
        textReferAndEarn           : {
            marginTop: 44,
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge
        },
        textReferAndEarnDescription: {
            marginTop: 2,
            alignSelf: "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        textCode                   : {
            marginTop   : 48,
            marginBottom: 32,

            paddingHorizontal: 10,
            paddingVertical  : 14,
            minWidth         : MyStyle.screenWidth * 0.5,
            backgroundColor  : MyColor.Material.GREY["300"],
            borderRadius     : 4,
            textAlign        : 'center',

            fontFamily: MyStyle.FontFamily.Roboto.medium,
            fontSize  : 16,
            color     : MyColor.attentionDark,
        },
    }
);

