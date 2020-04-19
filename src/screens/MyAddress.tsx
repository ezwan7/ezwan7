import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView, RefreshControl,
} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {ActivityIndicatorLarge, ListEmptyViewLottie, StatusBarLight} from '../components/MyComponent';
import {useSelector} from "react-redux";
import {MyButton} from "../components/MyButton";


let renderCount = 0;

const MyAddress = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${MyAddress.name}. renderCount: `, {renderCount});
    }

    const user: any = useSelector((state: any) => state.auth.user);

    const [firstLoad, setFirstLoad]                                               = useState(true);
    const [loading, setLoading]                                                   = useState(true);
    const [refreshing, setRefreshing]                                             = useState(false);
    const [loadingMore, setLoadingMore]                                           = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
    const [address, setProduct]: any                                              = useState([]);

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${MyAddress.name}. useEffect: `, '');

        fetchAddress(address?.length > 0 ? address.length : 0,
                     MyConfig.ListLimit.addressList,
                     false,
                     false,
                     false,
                     MyConstant.DataSetType.fresh
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchAddress(0, MyConfig.ListLimit.addressList, MyLANG.Loading + '...', true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        }, MyConstant.DataSetType.fresh);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEndReached = () => {
        MyUtil.printConsole(true, 'log', 'LOG: onEndReached: ', {
            'loadingMore'                     : loadingMore,
            'onEndReachedCalledDuringMomentum': onEndReachedCalledDuringMomentum
        });

        if (!loadingMore && !onEndReachedCalledDuringMomentum) {

            setLoadingMore(true);

            fetchAddress(address && address.length > 0 ? address.length : 0,
                         MyConfig.ListLimit.addressList,
                         false,
                         true,
                         false,
                         MyConstant.DataSetType.addToEndUnique
            );
        }
    }

    const ListEmptyComponent = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListEmptyComponent: ', {
            'address.length': address.length,
            'firstLoad'     : firstLoad,
        });

        if (firstLoad || (address && address.length > 0)) return null;

        return <ListEmptyViewLottie
            source = {MyImage.lottie_empty_lost}
            message = {MyLANG.NoCategoryFound}
            style = {{view: {}, image: {}, text: {}}}
        />;
    }

    const ListFooter = () => {
        MyUtil.printConsole(true, 'log', 'LOG: ListFooter: ', {'loadingMore': loadingMore});

        if (!loadingMore) return null;

        return <ActivityIndicatorLarge/>;
    }

    const fetchAddress = async (skip: number = 0, take: number = MyConfig.ListLimit.addressList, showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false, DataSetType: string = MyConstant.DataSetType.fresh) => {

        setLoading(true);

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, MyAPI.user_addresses,
                    {
                        'language_id' : MyConfig.LanguageActive,
                        'customers_id': user?.id,
                        'skip'        : skip,
                        'take'        : take,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.user_addresses, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data?.data?.data) {

            const data = response.data.data.data;
            if (data.length > 0) {

            }

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
        }

        setFirstLoad(false);
        setLoading(false);
        setLoadingMore(false);
        setOnEndReachedCalledDuringMomentum(true);
        if (setRefresh === true) {
            setRefreshing(false);
        }

        if (showInfoMessage !== false) {
            MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                        refreshControl = {
                            <RefreshControl
                                refreshing = {refreshing}
                                onRefresh = {onRefresh}
                                progressViewOffset = {MyStyle.headerHeightAdjusted}
                                colors = {[MyColor.Primary.first]}
                            />
                        }
                    >

                        <View style = {{marginVertical: 32, marginHorizontal: 32}}>

                            <MyButton
                                fill = "solid"
                                color = {MyColor.Material.RED["700"]}
                                display = "inline"
                                title = "Google Map"
                                linearGradientStyle = {{flex: 0.32, height: 46}}
                                onPress = {
                                    (e: any) =>
                                        MyUtil.commonAction(false,
                                                            null,
                                                            MyConstant.CommonAction.navigate,
                                                            MyConfig.routeName.GoogleMap,
                                                            {
                                                                mapPageSource: MyConstant.MapPageSource.params,
                                                                location     : {
                                                                    // latitude : 23.8103,
                                                                    // longitude: 90.4125,
                                                                    formatted_address: 'petronas twin towers',
                                                                }
                                                            },
                                                            null
                                        )
                                }
                            />
                        </View>

                    </ScrollView>

                </View>

            </SafeAreaView>
        </Fragment>
    )
}

MyAddress.navigationOptions = {}

export default MyAddress;

