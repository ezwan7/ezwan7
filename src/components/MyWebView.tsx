import React, {useRef} from 'react';
import {ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import {MyStyle} from "../common/MyStyle";


import {WebView} from 'react-native-webview';
import MyUtil from "../common/MyUtil";
import MyColor from "../common/MyColor";

let renderCount = 0;

export const MyWebView = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        // console.log(`LOG: ${MyWebView.name}. renderCount: `, {renderCount, props});
    }

    const webviewRef: any = useRef();

    const handleWebViewNavigationStateChange = (newNavState: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: handleWebViewNavigationStateChange: ', {newNavState});

        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        const {url} = newNavState;
        if (!url) return;

        // handle certain doctypes
        if (url.includes('.pdf')) {
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
        }
    };

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
        <Modal
            visible = {props.visible}
            animationType = {props.animationType || 'fade'}
            transparent = {props.transparent || true}
            // @ts-ignore
            statusBarTranslucent = {props.statusBarTranslucent || true}
            hardwareAccelerated = {props.hardwareAccelerated || true}
            onRequestClose = {props.onRequestClose}
            // onBackdropPress = {() => setModalVisible(false)}
        >
            <TouchableOpacity
                style = {styles.viewFull}
                onPressOut = {props.onRequestClose}
            >
                <View style = {styles.viewMain}>
                    <TouchableOpacity
                        activeOpacity = {1}
                        onPress = {() => ''}
                    >
                        <WebView
                            ref = {webviewRef}
                            source = {{uri: props?.source}}
                            startInLoadingState = {true}
                            renderLoading = {() => (
                                <ActivityIndicator
                                    color = {MyColor.Primary.first}
                                    size = "large"
                                    style = {{flex: 1}}
                                />
                            )}
                            // onNavigationStateChange = {props?.onNavigationStateChange}
                            onNavigationStateChange = {handleWebViewNavigationStateChange}
                            style = {{height: MyStyle.screenHeight * 0.80}}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

        </Modal>
    )
}

MyWebView.propTypes    = {
    visible                : PropTypes.bool,
    onRequestClose         : PropTypes.func,
    source                 : PropTypes.any,
    onNavigationStateChange: PropTypes.any,
}
MyWebView.defaultProps = {
    visible: false,
}

const styles = StyleSheet.create(
    {
        viewFull: {
            flex          : 1,
            justifyContent: 'center',
            alignItems    : "center",

            backgroundColor: 'rgba(0,0,0,0.6)',
        },
        viewMain: {
            height: MyStyle.screenHeight * 0.80,
            width : MyStyle.screenWidth * 0.85,

            backgroundColor: '#f9f9f9',
            borderRadius   : 4,
        },

        linearGradientStyles: {
            borderTopLeftRadius : 4,
            borderTopRightRadius: 4,
        },
    }
);

/*
const [modalVisibleWebview, setModalVisibleWebview] = useState(false);

<MyWebView
    visible = {modalVisibleWebview}
    onRequestClose = {() => setModalVisibleWebview(false)}
    source = "https://www.google.com/"
    onNavigationStateChange = {() => ''}
/>*/
