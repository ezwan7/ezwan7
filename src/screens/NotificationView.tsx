import React, {useState, useEffect, Fragment, useLayoutEffect, useCallback} from 'react';
import {ListEmptyViewLottie, StatusBarDark, StatusBarLight} from '../components/MyComponent';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from "react-redux";

import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, RefreshControl} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from "../common/MyConstant";
import {ImageSliderBanner, NotificationDetailsContentLoader, ProductListItemContentLoader} from "../shared/MyContainer";
import {MyImageViewer} from "../components/MyImageViewer";


let renderCount = 0;

const NotificationViewScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${NotificationViewScreen.name}. renderCount: `, {renderCount});
    }

    const user: any = useSelector((state: any) => state.auth.user);

    const [refreshing, setRefreshing] = useState(false);
    const [firstLoad, setFirstLoad]   = useState(true);

    const [data, setData]: any = useState([]);

    const [imageViewerVisible, setImageViewerVisible] = useState(false);

    useLayoutEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${NotificationViewScreen.name}. useLayoutEffect: `, route?.params);

        if (route?.params?.title) {
            navigation.setOptions(
                {
                    title: route?.params?.title,
                });
        }
    }, [navigation, route]);


    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${NotificationViewScreen.name}. useEffect: `, {data});

        fetchNotification(false, false, false);

        // setData(route?.params?.item);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        MyUtil.printConsole(true, 'log', 'LOG: onRefresh: ', {});

        setRefreshing(true);

        fetchNotification(false, true, {
            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
            'message'    : MyLANG.PageRefreshed
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNotification = async (showLoader: any = MyLANG.Loading + '...', setRefresh: boolean = false, showInfoMessage: any = false) => {
        if (route?.params?.id) {
            const response: any = await MyUtil
                .myHTTP(false, MyConstant.HTTP_POST, MyAPI.notification,
                        {
                            'language_id': MyConfig.LanguageActive,

                            'id'          : route?.params?.id,
                            'customers_id': user?.id,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.notification, 'response': response
            });

            if (response.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

                const data = response.data.data.data?.[0];
                if (data) {
                    setData(data);

                    markReadNotification(data);

                }

            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
            }

            setFirstLoad(false);
            if (setRefresh === true) {
                setRefreshing(false);
            }

            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
            }
        }
    }

    const markReadNotification = async (data: any, showInfoMessage: any = false) => {
        if (data?.read_status === 0) {
            const response: any = await MyUtil
                .myHTTP(false, MyConstant.HTTP_POST, MyAPI.notification_read,
                        {
                            'language_id': MyConfig.LanguageActive,

                            'id'          : data?.id,
                            'customers_id': user?.id,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, false, true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.notification_read, 'response': response
            });

            if (response.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {


            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);
            }
        }
    }

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.Material.WHITE}]}>

                    {data?.id > 0 ?
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
                         <View>
                             {
                                 ((Array.isArray(data?.images) && data?.images?.length > 0) || data?.image?.length > 0) &&
                                 <ImageSliderBanner
                                     item = {(Array.isArray(data?.images) && data?.images?.length > 0) ? data?.images : [{image: data?.image}]}
                                     onPress = {(prop: any) => prop?.image?.length ? setImageViewerVisible(true) : null}
                                     style = {{height: MyStyle.screenWidth / 1.5}}
                                 />
                             }
                             <Text
                                 style = {[MyStyleSheet.textPageTitleLarge, {
                                     textAlign        : 'center',
                                     paddingHorizontal: MyStyle.marginHorizontalPage,
                                     paddingVertical  : MyStyle.marginVerticalPage,
                                 }]}
                             >
                                 {data?.title}
                             </Text>
                             <Text
                                 style = {{
                                     fontFamily       : MyStyle.FontFamily.Roboto.regular,
                                     fontSize         : 12,
                                     color            : MyColor.textDarkSecondary,
                                     textAlign        : "right",
                                     paddingBottom    : MyStyle.marginVerticalPage / 1.5,
                                     paddingHorizontal: MyStyle.marginHorizontalPage / 2,
                                 }}
                             >
                                 {MyUtil.momentFormat(data?.created_on, MyConstant.MomentFormat["1st Jan, 1970 12:01 am"])}
                             </Text>
                             <Text
                                 style = {[MyStyleSheet.textPageInfoSecondary, {
                                     paddingHorizontal: MyStyle.marginHorizontalPage,
                                     paddingVertical  : MyStyle.marginVerticalPage,
                                     backgroundColor  : MyColor.backgroundGrey,
                                 }]}
                             >
                                 {data?.body}
                             </Text>
                         </View>

                     </ScrollView>
                                  :
                     firstLoad ?
                     <ScrollView
                         contentInsetAdjustmentBehavior = "automatic"
                         contentContainerStyle = {{flexGrow: 1}}
                     >
                         {<NotificationDetailsContentLoader/>}
                     </ScrollView>
                               :
                     !firstLoad ?
                     <ListEmptyViewLottie
                         source = {MyImage.lottie_empty_lost}
                         message = {MyLANG.NoNotificationDetailsFound}
                         style = {{view: {}, image: {}, text: {}}}
                     />
                                :
                     null
                    }

                </View>

                {
                    ((Array.isArray(data?.images) && data?.images?.length > 0) || data?.image?.length > 0) &&
                    <MyImageViewer
                        visible = {imageViewerVisible}
                        onRequestClose = {() => setImageViewerVisible(false)}
                        images = {data?.images?.[0] ? data.images : [{image: data.image}]}
                    />
                }

            </SafeAreaView>
        </Fragment>
    )
}

NotificationViewScreen.navigationOptions = {}

export default NotificationViewScreen


