import React, {useState} from 'react';
import FastImage from "react-native-fast-image";
import PropTypes from "prop-types";
import {StyleSheet} from "react-native";
import {MyStyle, MyStyleSheet} from "../common/MyStyle";

let renderCount = 0;

export const MyFastImage = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        // console.log(`LOG: ${MyFastImage.name}. renderCount: `, renderCount);
    }

    const [index, setIndex]: any = useState(0);

    const onError = (error: any) => {
        // console.log(`LOG: ${MyFastImage.name}. onError: `, error);
        // props.onError?.(error);
        const next = index + 1;
        if (next < props.source.length) {
            setIndex(next);
        }
    }

    return (
        <FastImage
            source = {props.source[index]}
            resizeMode = {props.resizeMode || FastImage.resizeMode.contain}
            style = {props.style || styles.image}
            // @ts-ignore
            onError = {onError}
        />
    )
}
MyFastImage.propTypes    = {
    source    : PropTypes.array,
    resizeMode: PropTypes.string,
    style     : PropTypes.object,
    onError   : PropTypes.func,
}
MyFastImage.defaultProps = {
    source    : [],
    resizeMode: null,
    style     : {},
    onError   : null,
}
const styles             = StyleSheet.create(
    {
        image: {
            ...MyStyleSheet.imageList,
        }
    }
)
