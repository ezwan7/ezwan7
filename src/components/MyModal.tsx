import React from 'react';
import {Modal, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import {MyStyle} from "../common/MyStyle";


let renderCount = 0;

export const MyModal = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        // console.log(`LOG: ${MyModal.name}. renderCount: `, {renderCount, props});
    }

    const onError = (error: any) => {
        // console.log(`LOG: ${MyFastImage.name}. onError: `, error);
    }

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
                    <ScrollView contentInsetAdjustmentBehavior = "automatic">
                        <TouchableOpacity
                            activeOpacity = {1}
                            onPress = {() => ''}
                        >
                            <>
                                {props.children}
                            </>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

MyModal.propTypes    = {
    visible       : PropTypes.bool,
    onRequestClose: PropTypes.func,
    children      : PropTypes.any,
}
MyModal.defaultProps = {
    visible: false,
}
const styles         = StyleSheet.create(
    {
        viewFull: {
            flex          : 1,
            justifyContent: 'center',
            alignItems    : "center",

            backgroundColor: 'rgba(0,0,0,0.6)',
        },
        viewMain: {
            marginVertical: MyStyle.screenHeight * 0.08,
            width         : MyStyle.screenWidth * 0.85,

            backgroundColor: '#f9f9f9',
            borderRadius   : 4,
        },

        linearGradientStyles: {
            borderTopLeftRadius : 4,
            borderTopRightRadius: 4,
        },
    }
);
