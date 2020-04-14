import React, {useState} from 'react';
import PropTypes from "prop-types";
import {ImageBackground, StyleSheet} from "react-native";
import {MyStyle, MyStyleSheet} from "../common/MyStyle";
import MyImage from "../shared/MyImage";
import FastImage from "react-native-fast-image";

let renderCount = 0;

export const MyImageBackground = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        // console.log(`LOG: ${MyImageBackground.name}. renderCount: `, renderCount);
    }

    const [index, setIndex]: any = useState(0);

    const onError = (error: any) => {
        // console.log(`LOG: ${MyImageBackground.name}. onError: `, error);
        // props.onError?.(error);
        const next = index + 1;
        if (next < props.source.length) {
            setIndex(next);
        }
    }

    return (
        <ImageBackground
            source = {props.source[index]}
            resizeMode = {index === 1 ? "contain" : props.resizeMode ? props.resizeMode : "cover"}
            style = {[props.style || styles.image]}
            imageStyle = {[props.imageStyle || styles.imageStyle, index === 1 && {marginHorizontal: MyStyle.screenWidth / 3}]}
            onError = {onError}
        >
            {props.children}
        </ImageBackground>
    )
}
MyImageBackground.propTypes    = {
    source       : PropTypes.array,
    defaultSource: PropTypes.string,
    resizeMode   : PropTypes.string,
    style        : PropTypes.any,
    imageStyle   : PropTypes.object,
    onError      : PropTypes.func,
    children     : PropTypes.any,
}
MyImageBackground.defaultProps = {
    source       : [],
    defaultSource: null,
    resizeMode   : null,
    style        : {},
    imageStyle   : {},
    onError      : null,
}
const styles                   = StyleSheet.create(
    {
        image     : {
            ...MyStyleSheet.imageBackground,
        },
        imageStyle: {}
    }
)
