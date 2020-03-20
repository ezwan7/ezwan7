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
import MyAuth from "../common/MyAuth";

let renderCount = 0;

const NotificationScreen = ({}) => {

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${NotificationScreen.name}. useEffect: `, '');
    })

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${NotificationScreen.name}. renderCount: `, renderCount);
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView>
                <LinearGradient start = {MyStyle.LGWhite.start}
                                end = {MyStyle.LGWhite.end}
                                locations = {MyStyle.LGWhite.locations}
                                colors = {MyStyle.LGWhite.colors}>
                    <View style = {MyStyleSheet.layoutView1}>
                        <ScrollView contentInsetAdjustmentBehavior = "automatic">
                            <View style = {MyStyleSheet.layoutView2}>
                                <View style = {MyStyleSheet.layoutView3}>

                                    <View style = {{
                                        width          : '100%',
                                        height         : 200,


                                    }}>

                                        <Text style = {styles.textStyle}
                                              onPress = {() => MyUtil.reactNavigate(MyConfig.routeName.NotificationView,
                                                                                    {user: 'test user'},
                                                                                    null
                                              )}>
                                            Notifications3
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    )
}

NotificationScreen.navigationOptions = {
    title: 'Notificationsa',
}

export default NotificationScreen

const styles = StyleSheet.create(
    {
        textStyle: {
            color     : MyColor.Primary.first,
            fontSize  : 40,
            fontWeight: 'bold',
            alignSelf : 'center',
        },
    })

