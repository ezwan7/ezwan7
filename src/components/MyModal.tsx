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
            transparent = {props.transparent === false ? false : true}
            // @ts-ignore
            statusBarTranslucent = {props.statusBarTranslucent === false ? false : true}
            hardwareAccelerated = {props.hardwareAccelerated === false ? false : true}
            onRequestClose = {props.onRequestClose}
            // onBackdropPress = {() => setModalVisible(false)}
        >

            {props.children}

        </Modal>
    )
}

MyModal.propTypes    = {
    visible             : PropTypes.bool,
    animationType       : PropTypes.any,
    transparent         : PropTypes.any,
    statusBarTranslucent: PropTypes.any,
    hardwareAccelerated : PropTypes.any,
    onRequestClose      : PropTypes.func,
    viewMain            : PropTypes.any,
    viewTouchable       : PropTypes.any,
    children            : PropTypes.any,
}
MyModal.defaultProps = {
    visible: false,
}
