import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    SafeAreaView,
    ScrollView,
} from 'react-native';

import HTML from 'react-native-render-html';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';

import {
    StatusBarDark,
    StatusBarGradientPrimary,
    StatusBarLight
} from '../components/MyComponent';
import MyLANG from "../shared/MyLANG";


let renderCount = 0;

const InfoPage = ({route, navigation}: any) => {
    // const addCartItem    = (item: any) => dispatch(addCartItem(item));

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${InfoPage.name}. renderCount: `, {renderCount});
    }

    useLayoutEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${InfoPage.name}. useLayoutEffect: `, '');

        if (route?.params?.title) {
            navigation.setOptions(
                {
                    title: route?.params?.title,
                });
        }
    }, [navigation, route]);


    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${InfoPage.name}. useEffect: `, route?.params);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <StatusBarGradientPrimary/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.Material.WHITE}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                    >
                        <HTML
                            html = {route?.params?.text ? route?.params?.text : MyLANG.NoText}
                            tagsStyles = {MyStyle.textHTMLBody}
                            containerStyle = {{marginHorizontal: MyStyle.marginHorizontalPage}}
                        />

                    </ScrollView>

                </View>

            </SafeAreaView>
        </Fragment>
    )
}

InfoPage.navigationOptions = {}

export default InfoPage;

