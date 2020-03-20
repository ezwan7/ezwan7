import React, {useState, useEffect, Fragment} from 'react';
import {StatusBarLight} from '../components/MyComponent';
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

const TabFoodItemScreen = ({}) => {

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${TabFoodItemScreen.name}. useEffect: `, '');
    })

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${TabFoodItemScreen.name}. renderCount: `, renderCount);
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView>
                <LinearGradient start={MyStyle.LGWhite.start} end={MyStyle.LGWhite.end}
                                locations={MyStyle.LGWhite.locations}
                                colors={MyStyle.LGWhite.colors}>
                    <View style={MyStyleSheet.layoutView1}>
                        <ScrollView contentInsetAdjustmentBehavior='automatic'>
                            <View style={MyStyleSheet.layoutView2}>
                                <View style={MyStyleSheet.layoutView3}>
                                    <Text style={styles.textStyle}>
                                        FoodItem
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

TabFoodItemScreen.navigationOptions = {
    title: 'FoodItem',
}

export default TabFoodItemScreen

const styles = StyleSheet.create({
    textStyle: {
        color     : MyColor.Primary.first,
        fontSize  : 40,
        alignSelf : 'center',
        fontFamily: MyStyle.FontFamily.Roboto.thin
    },
})

