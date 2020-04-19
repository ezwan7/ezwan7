import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {StatusBarLight} from '../components/MyComponent';


let renderCount = 0;

const OptionPage = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${OptionPage.name}. renderCount: `, {renderCount});
    }

    const [items, setItems]: any = useState([]);

    useLayoutEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${OptionPage.name}. useLayoutEffect: `, '');

        if (route?.params?.title) {
            navigation.setOptions(
                {
                    title: route?.params?.title,
                });
        }
    }, [navigation, route]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${OptionPage.name}. useEffect: `, '');

    }, []);


    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    {items?.id > 0 &&
                     <>
                         <ScrollView
                             contentInsetAdjustmentBehavior = "automatic"
                             contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                         >

                             <View>

                             </View>

                         </ScrollView>

                     </>
                    }

                </View>

            </SafeAreaView>
        </Fragment>
    )
}

OptionPage.navigationOptions = {}

export default OptionPage;

