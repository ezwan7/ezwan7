import React, {useState, useEffect, Fragment} from 'react';
import {ListEmptyViewLottie, StatusBarDark, StatusBarLight} from '../components/MyComponent';
import LinearGradient from 'react-native-linear-gradient';

import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from "../common/MyConstant";

let renderCount = 0;

const NotificationViewScreen = ({}) => {

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${NotificationViewScreen.name}. useEffect: `, '');
    })

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${NotificationViewScreen.name}. renderCount: `, renderCount);
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.Material.WHITE}]}>
                    <ListEmptyViewLottie
                        source = {MyImage.lottie_bus}
                        message = {MyLANG.ComingSoon}
                        style = {{view: {}, image: {width: MyStyle.screenWidth}, text: {}}}
                    />
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

NotificationViewScreen.navigationOptions = {
    title: 'Notification View',
}

export default NotificationViewScreen

const styles = StyleSheet.create(
    {
        textStyle: {
            color     : MyColor.Primary.first,
            fontSize  : 40,
            fontWeight: 'bold',
            alignSelf : 'center',
        },
    })

