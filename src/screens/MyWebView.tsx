import React, {useState, useEffect, Fragment, useCallback, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, BackHandler, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {WebView} from "react-native-webview";

import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyUtil from '../common/MyUtil';
import MyAuth from '../common/MyAuth';

import {StatusBarGradientPrimary} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";

let renderCount = 0;

const MyWebViewScreen = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${MyWebViewScreen.name}. renderCount: `, renderCount);
    }

    const webviewRef: any                 = useRef();
    const [canGoBack, setCanGoBack]       = useState(false)
    const [canGoForward, setCanGoForward] = useState(false)
    const [currentUrl, setCurrentUrl]     = useState(route?.params?.source);

    const [data, setData]: any = useState(null);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {

                if (route?.params?.showBackActionAlert === true) {
                    // Go back to Previous page:
                    MyUtil.showAlert(MyLANG.Attention, MyLANG.PaymentWebViewAlert, false, [
                        {
                            text   : MyLANG.StayOnThisPage,
                            style  : 'cancel',
                            onPress: () => {
                                MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                            },
                        },
                        {
                            text   : MyLANG.GoBack,
                            onPress: async () => {
                                MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                                MyUtil.stackAction(false,
                                                   navigation,
                                                   MyConstant.StackAction.pop,
                                                   1,
                                                   null,
                                                   null,
                                );
                            }
                        },
                    ])

                    return true;

                } else {

                    return false;

                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${MyWebViewScreen.name}. useEffect: `, route?.params);

        setData(route?.params);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleOnMessage = (event: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: handleOnMessage: ', {event: event});

        const {url} = event?.nativeEvent;
        if (!url) return;

        if (url.includes("ipay88response")) {
            const html1 = event.nativeEvent.data;

            const isStatus = html1.includes('[status] =&gt; 1');
            const RefNo    = (html1.split('[RefNo] =&gt; ')?.[1].split('[Amount] =&gt;')?.[0])?.trim();
            const Amount   = (html1.split('[Amount] =&gt; ')?.[1].split('[Discount] =&gt;')?.[0])?.trim();
            const TransId  = (html1.split('[TransId] =&gt; ')?.[1].split('[AuthCode] =&gt;')?.[0])?.trim();
            const status   = (html1.split('[status] =&gt; ')?.[1].split('[message] =&gt;')?.[0])?.trim();
            const Status   = (html1.split('[Status] =&gt; ')?.[1].split('[ErrDesc] =&gt;')?.[0])?.trim();

            MyUtil.printConsole(true, 'log', 'LOG: success_url: ', {isStatus, RefNo, Amount, TransId, status, Status});

            if (isStatus === true && RefNo?.length > 0 && Amount === route?.params?.amount && TransId?.length > 0 && status === '1' && Status === '1') {
                webviewRef?.current?.stopLoading();
                const navParams: any = {
                    payment_status: 'SUCCESS', payment_reference_id: RefNo,
                }
                route.params         = null;
                return MyUtil.commonAction(false,
                                           navigation,
                                           MyConstant.CommonAction.navigate,
                                           MyConfig.routeName.ProductBuyPayment,
                                           navParams,
                                           null,
                );

            } else {
                webviewRef?.current?.stopLoading();
                const navParams: any = {
                    payment_status: 'FAILURE', payment_reference_id: 'FAILURE',
                }
                route.params         = null;
                return MyUtil.commonAction(false,
                                           navigation,
                                           MyConstant.CommonAction.navigate,
                                           MyConfig.routeName.ProductBuyPayment,
                                           navParams,
                                           null,
                );
            }
        }
    }

    const handleWebViewNavigationStateChange = (newNavState: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: handleWebViewNavigationStateChange: ', {newNavState, webviewRef: webviewRef?.current});

        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }

        /*const {url} = newNavState;
        if (!url) return;

        if (url === route?.params?.success_url) {

            webviewRef?.current?.stopLoading();

            MyUtil.printConsole(true, 'log', 'LOG: success_url: ', {newNavState});

            /!*
            const navParams: any = {
                payment_status: 'SUCCESS', payment_reference_id: route?.params?.payment_reference_id,
            }
            route.params         = null;
            return MyUtil.commonAction(false,
                                       navigation,
                                       MyConstant.CommonAction.navigate,
                                       MyConfig.routeName.ProductBuyPayment,
                                       navParams,
                                       null,
            );*!/


            /!*
            const navParams: any = {
                payment_status: 'FAILURE', payment_reference_id: 'FAILURE',
            }
            route.params         = null;
            return MyUtil.commonAction(false,
                                       navigation,
                                       MyConstant.CommonAction.navigate,
                                       MyConfig.routeName.ProductBuyPayment,
                                       navParams,
                                       null,
            );*!/
        }*/

        // addons in order place api
        // order details new entries, addone, emi,...

        // handle certain doctypes
        /*if (url.includes('.pdf')) {
            webviewRef?.current?.stopLoading();
            // open a modal with the PDF viewer
        }

        // one way to handle a successful form submit is via query strings
        if (url.includes('?message=success')) {
            webviewRef?.current?.stopLoading();
            // maybe close this view?
        }

        // one way to handle errors is via query string
        if (url.includes('?errors=true')) {
            webviewRef?.current?.stopLoading();
        }

        // redirect somewhere else
        if (url.includes('google.com')) {
            const newURL     = 'https://reactnative.dev/';
            const redirectTo = 'window.location = "' + newURL + '"';
            webviewRef?.current?.injectJavaScript(redirectTo);
        }*/
    };

    const INJECTED_JAVASCRIPT = `(function() {
        window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
    })();`;

    const backButtonHandler = () => {
        MyUtil.printConsole(true, 'log', 'LOG: backButtonHandler: ', {});

        if (webviewRef?.current) webviewRef?.current.goBack();
    }

    const frontButtonHandler = () => {
        MyUtil.printConsole(true, 'log', 'LOG: frontButtonHandler: ', {});

        if (webviewRef?.current) webviewRef?.current?.goForward();
    }

    const formSubmit = async (e: any) => {

    };


    return (
        <Fragment>
            <StatusBarGradientPrimary/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {paddingTop: 0, backgroundColor: MyColor.backgroundGrey}]}>

                    <WebView
                        ref = {webviewRef}
                        source = {{uri: data?.source}}
                        startInLoadingState = {true}
                        renderLoading = {() => (
                            <ActivityIndicator
                                color = {MyColor.Primary.first}
                                size = "large"
                                style = {{flex: 1}}
                            />
                        )}
                        onNavigationStateChange = {handleWebViewNavigationStateChange}
                        injectedJavaScript = {INJECTED_JAVASCRIPT}
                        onMessage = {handleOnMessage}
                        /*onNavigationStateChange = {navState => {
                            setCanGoBack(navState.canGoBack)
                            setCanGoForward(navState.canGoForward)
                            setCurrentUrl(navState.url)
                        }}*/
                    />

                    {/*<View style = {styles.tabBarContainer}>
                        <TouchableOpacity onPress = {backButtonHandler}>
                            <Text style = {styles.button}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {frontButtonHandler}>
                            <Text style = {styles.button}>Forward</Text>
                        </TouchableOpacity>
                    </View>*/}

                </View>
            </SafeAreaView>
        </Fragment>
    );
};

MyWebViewScreen.navigationOptions = {};

export default MyWebViewScreen;

const styles = StyleSheet.create(
    {
        tabBarContainer: {
            padding        : 20,
            flexDirection  : 'row',
            justifyContent : 'space-around',
            backgroundColor: '#b43757'
        },
        button         : {
            color   : 'white',
            fontSize: 24
        }
    }
);

