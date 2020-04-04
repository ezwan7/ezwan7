import React, {useState, useEffect, Fragment} from 'react';
import {StatusBarDark, StatusBarLight} from '../components/MyComponent';
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
            <StatusBarDark/>
            <SafeAreaView>
                <LinearGradient start = {MyStyle.LGWhitish.start}
                                end = {MyStyle.LGWhitish.end}
                                locations = {MyStyle.LGWhitish.locations}
                                colors = {MyStyle.LGWhitish.colors}>
                    <View style = {MyStyleSheet.layoutView1}>
                        <ScrollView contentInsetAdjustmentBehavior = "automatic">
                            <View style = {MyStyleSheet.layoutView2}>
                                <View style = {MyStyleSheet.layoutView3}>
                                    <Text style = {styles.textStyle}>
                                        Notification View
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </LinearGradient>
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

