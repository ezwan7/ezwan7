import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import {MyStyle, MyStyleSheet} from "../common/MyStyle";
import MyColor from "../common/MyColor";
import MyMaterialRipple from "./MyMaterialRipple";
import MyIcon from './MyIcon';
import ImageViewer from "react-native-image-zoom-viewer";


let renderCount = 0;

export const MyImageViewer = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        console.log(`LOG: ${MyImageViewer.name}. renderCount: `, {renderCount});
    }

    const [images, setImages] = useState([]);

    useEffect(() => {

        if (props?.images?.length > 0) {
            let images: any = props.images.map((item: any) => {
                return {
                    url: item['image'],
                }
            });
            setImages(images);

        } else {
            let images: any = [{url: props.images?.image}];
            setImages(images);

        }

        console.log(`LOG: ${MyImageViewer.name}. useEffect: `, {images, 'props?.images': props?.images});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onError = (error: any) => {
        // console.log(`LOG: ${MyFastImage.name}. onError: `, error);
    }

    return (
        <Modal
            visible = {props.visible}
            transparent = {true}
            onRequestClose = {props.onRequestClose}
        >
            <ImageViewer
                imageUrls = {images}
                enableSwipeDown = {true}
                enablePreload = {true}
                backgroundColor = {MyColor.Material.GREY["990"]}
                onSwipeDown = {props.onRequestClose}
                onClick = {props.onRequestClose}
            />
        </Modal>
    )
}

MyImageViewer.propTypes    = {
    visible       : PropTypes.bool,
    onRequestClose: PropTypes.func,
    images        : PropTypes.array,
}
MyImageViewer.defaultProps = {
    visible: false,
    images : [],
}
const styles               = StyleSheet.create(
    {}
);
