import React, {useEffect, useState} from "react";
import {Animated, Image, StyleSheet, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Text, TextInput} from "react-native";
import TextInputMask from "react-native-text-input-mask";
import PropTypes from "prop-types";

import {MyConstant} from "../common/MyConstant";
import MyColor from "../common/MyColor";
import {getMyIcon} from "./MyComponent";
import MyIcon from "./MyIcon";
import {MyConfig} from "../shared/MyConfig";
import {MyStyle} from "../common/MyStyle";
import MyLANG from "../shared/MyLANG";
import {MyButton} from "./MyButton";
import MyImage from "../shared/MyImage";

let renderCount = 0;

const MyInput = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        console.log(`LOG: ${MyInput.name}. renderCount: `, renderCount, props?.value);
    }

    // const [value, setValue]                     = useState(props.value);
    const [secureTextEntry, setSecureTextEntry] = useState(props.inputProps?.secureTextEntry);
    const [isFocused, setIsFocused]             = useState(false);
    const [_animatedIsFocused]                  = useState(new Animated.Value(props.value ? 1 : 0));
    const [_helperTextVisible]                  = useState(new Animated.Value(props.helperText?.visible ? 1 : 0));
    const [_placeholderLabelAnimated]           = useState(new Animated.Value(!isFocused ? 1 : 0));

    /*useEffect(() => {
        setValue(props.value);
    }, [props.value]);*/

    useEffect(() => {
        // console.log(`LOG: ${MyInput.name}. useEffect: `, isFocused, props.value);
        Animated.timing(_animatedIsFocused, {
            toValue : (isFocused || props.value) ? 1 : 0,
            duration: 200,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, props.value]);

    useEffect(() => {
        // console.log(`LOG: ${MyInput.name}. useEffect: `, props.helperText?.visible);
        Animated.timing(_helperTextVisible, {
            toValue : props.helperText?.visible ? 1 : 0,
            duration: 200,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.helperText?.visible]);

    useEffect(() => {
        // console.log(`LOG: ${MyInput.name}. useEffect: `, isFocused, props.value);
        Animated.timing(_placeholderLabelAnimated, {
            toValue : (!isFocused || props.value) ? 1 : 0,
            duration: 200,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, props.value]);


    const viewGroupStyles = [
        styles.viewGroup,

        isFocused && styles.viewGroupFocused,

        {...props.viewGroupStyle}
    ];

    const viewStyles = [
        styles.view,

        props.mode === "line" && styles.line ||
        props.mode === "outlined" && styles.outlined ||
        props.mode === "rounded" && styles.rounded ||
        props.mode === "transparent" && styles.transparent,

        props.iconLeft?.name && (props.mode === "line" && styles.lineIconLeft ||
                                 props.mode === "outlined" && styles.outlinedIconLeft ||
                                 props.mode === "rounded" && styles.roundedIconLeft),

        (!isFocused && props.focusedBorder) && styles.focusedBorderNot,
        (isFocused && props.focusedBorder) && (props.mode === "line" && styles.focusedBorderLine ||
                                               props.mode === "outlined" && styles.focusedBorderOutlined ||
                                               props.mode === "rounded" && styles.focusedBorderRounded),
        (isFocused && props.focusedBorderColor) &&
        {borderColor: props.focusedBorderColor.borderColor ? props.focusedBorderColor.borderColor : MyColor.Material.DEEPPRUPLE["A400"]},

        props.helperText?.visible && (props.helperText?.type === "success" && styles.viewSuccess ||
                                      props.helperText?.type === "warning" && styles.viewWarning ||
                                      props.helperText?.type === "error" && styles.viewError),


        {...props.viewStyle}
    ];

    const placeholderTextColor = props.placeholderStyle ? props.placeholderStyle?.color : MyColor.Material.GREY["500"];

    const labelTextColorFocused        = ((props.helperText?.visible && (props.helperText?.type === "success" && MyColor.Material.GREEN["900"] ||
                                                                         props.helperText?.type === "warning" && MyColor.Material.YELLOW["900"] ||
                                                                         props.helperText?.type === "error" && MyColor.Material.RED["900"])) ||
                                          (isFocused && (props.focusedBorderColor?.borderColor && props.focusedBorderColor.borderColor || MyColor.Material.DEEPPRUPLE["A400"])) ||
                                          (props.mode === "line" && MyColor.Material.GREY["600"] ||
                                          props.mode === "outlined" && MyColor.Material.GREY["800"] ||
                                          props.mode === "rounded" && MyColor.Material.GREY["800"])
    );
    const labelTextBottomFocused1: any = props.mode === "line" && 3 ||
                                         props.mode === "outlined" && 3 ||
                                         props.mode === "rounded" && 3;
    const labelTextBottomFocused2: any = props.mode === "line" && 26 ||
                                         props.mode === "outlined" && 33 ||
                                         props.mode === "rounded" && 30;
    const floatingLabelStyles          = [

        styles.floatingLabel,

        props.floatingLabel && {
            position       : "absolute",
            fontFamily     : isFocused || props.value ? MyStyle.FontFamily.Roboto.medium : MyStyle.FontFamily.Roboto.regular,
            backgroundColor: isFocused || props.value ? (props.mode === "line" && "transparent" ||
                                                         props.mode === "outlined" && props.floatingLabelBackground ||
                                                         props.mode === "rounded" && props.floatingLabelBackground)
                                                      : "transparent",
            bottom         : _animatedIsFocused.interpolate(
                {
                    inputRange : [0, 1],
                    outputRange: [labelTextBottomFocused1, labelTextBottomFocused2],
                }
            ),
            fontSize       : _animatedIsFocused.interpolate(
                {
                    inputRange : [0, 1],
                    outputRange: [16, 12],
                }
            ),
            color          : _animatedIsFocused.interpolate(
                {
                    inputRange : [0, 1],
                    outputRange: [MyColor.Material.GREY["800"], labelTextColorFocused],
                }
            ),
        },

        props.floatingLabelFloated && props.floatingLabelFloated === true && {
            position       : "absolute",
            fontFamily     : MyStyle.FontFamily.Roboto.medium,
            backgroundColor: (props.mode === "line" && "transparent" ||
                              props.mode === "outlined" && props.floatingLabelBackground ||
                              props.mode === "rounded" && props.floatingLabelBackground),
            bottom         : labelTextBottomFocused2,
            fontSize       : 12,
            color          : labelTextColorFocused,
        },

        {...props.floatingLabelStyle}

    ];

    const inlineLabelStyles = [

        styles.inlineLabel,

        {...props.inlineLabelStyle}
    ];

    const placeholderLabelStyles = [
        styles.placeholderLabel,

        (props.placeholderLabel && props.floatingLabelFloated !== true) && {
            color: _placeholderLabelAnimated.interpolate(
                {
                    inputRange : [0, 1],
                    outputRange: [MyColor.Material.GREY["600"], "transparent"],
                }
            ),
        } || props.floatingLabelFloated === true && {
            color: props.value ? "transparent" : MyColor.Material.GREY["600"],
        },

        {...props.placeholderLabelStyle}
    ];

    const inputStyles = [
        styles.input,

        {...props.inputStyle}
    ];

    const placeholderStyles = [
        styles.placeholder,

        {...props.placeholderStyle}
    ];

    const iconLeftStyles = [
        styles.iconLeft,

        props.mode === "line" && styles.iconLeftLine ||
        props.mode === "outlined" && styles.iconLeftOutlined ||
        props.mode === "rounded" && styles.iconLeftRounded ||
        props.mode === "transparent" && styles.iconLeftTransparent,

        (isFocused && props.focusedBorderColor) &&
        {color: props.focusedBorderColor.borderColor ? props.focusedBorderColor.borderColor : MyColor.Material.DEEPPRUPLE["A400"]},

        props.helperText?.visible && props.helperText?.colorLeftIcon &&
        (props.helperText?.type === "success" && styles.helperTextSuccess ||
         props.helperText?.type === "warning" && styles.helperTextWarning ||
         props.helperText?.type === "error" && styles.helperTextError),

        {...props.iconLeftStyle}
    ];

    const iconRightStyles = [
        styles.iconRight,

        props.mode === "line" && styles.iconRightLine ||
        props.mode === "outlined" && styles.iconRightOutlined ||
        props.mode === "rounded" && styles.iconRightRounded ||
        props.mode === "transparent" && styles.iconRightTransparent,

        /*(isFocused && props.focusedBorderColor) &&
        {color: props.focusedBorderColor.borderColor ? props.focusedBorderColor.borderColor : MyColor.Material.DEEPPRUPLE["A400"]},*/

        props.helperText?.visible && props.helperText?.colorRightIcon &&
        (props.helperText?.type === "success" && styles.helperTextSuccess ||
         props.helperText?.type === "warning" && styles.helperTextWarning ||
         props.helperText?.type === "error" && styles.helperTextError),

        {...props.iconRightStyle}
    ];

    const imageLeftViewStyles = [
        styles.imageLeftView,

        {...props.imageLeftViewStyle}
    ];
    const imageLeftStyles     = [
        styles.imageLeft,

        {...props.imageLeftStyle}
    ];

    const imageRightViewStyles = [
        styles.imageRightView,

        {...props.imageRightViewStyle}
    ];
    const imageRightStyles     = [
        styles.imageRight,

        {...props.imageRightStyle}
    ];

    const helperTextStyles = [
        styles.helperText,

        props.mode === "rounded" && styles.helperTextRounded,

        props.helperText?.type === "success" && styles.helperTextSuccess ||
        props.helperText?.type === "warning" && styles.helperTextWarning ||
        props.helperText?.type === "error" && styles.helperTextError,

        {
            top    : _helperTextVisible.interpolate(
                {
                    inputRange : [0, 1],
                    outputRange: [-6, 0],
                }
            ),
            opacity: _helperTextVisible.interpolate(
                {
                    inputRange : [0, 1],
                    outputRange: [0, 1],
                }
            ),
        },

        {...props.helperTextStyle}
    ];

    const iconRightOnPress = () => {
        if (props.iconRightOnPress && props.iconRightOnPress?.type === "secureTextEntry") {
            setSecureTextEntry(props.inputProps.secureTextEntry = !props.inputProps.secureTextEntry);
            console.log(`LOG: ${MyInput.name}. iconRightOnPress: `, props.inputProps?.secureTextEntry);
        }
    }

    return (
        <View style = {viewGroupStyles}>
            <TouchableWithoutFeedback onPress = {props.onPress}>
                <View style = {viewStyles}>
                    {
                        props.iconLeft?.name &&
                        getMyIcon(
                            {
                                fontFamily: props.iconLeft?.fontFamily || MyConstant.VectorIcon.FontAwesome,
                                name      : props.iconLeft?.name,
                                color     : props.iconLeft?.color || MyColor.Material.GREY["600"],
                                style     : iconLeftStyles
                            }
                        )
                    }
                    {
                        props.imageLeft &&
                        <View style = {imageLeftViewStyles}>
                            {
                                props.imageLeft?.name &&
                                <Image
                                    source = {props.imageLeft?.name}
                                    style = {imageLeftStyles}
                                    resizeMode = "contain"
                                />
                            }
                        </View>
                    }

                    <>
                        {
                            props.floatingLabel &&
                            <View style = {{alignSelf: "baseline"}}>
                                <Animated.Text style = {floatingLabelStyles}>
                                    {props.floatingLabel || MyLANG.WriteSomethingHere}
                                </Animated.Text>
                            </View>
                        }
                        {
                            props.inlineLabel &&
                            <Text style = {inlineLabelStyles}>
                                {props.inlineLabel || MyLANG.WriteSomethingHere}
                            </Text>
                        }
                        {
                            props.placeholderLabel &&
                            <View style = {{alignSelf: "baseline"}}>
                                <Animated.Text style = {placeholderLabelStyles}>
                                    {props.placeholderLabel || MyLANG.WriteSomethingHere}
                                </Animated.Text>
                            </View>
                        }
                        {
                            props.mask ?
                            <TextInputMask
                                placeholder = {props.placeholder ? props.placeholder : null}
                                placeholderTextColor = {placeholderTextColor}
                                selectable
                                style = {inputStyles}
                                onBlur = {() => setIsFocused(false)}
                                onFocus = {() => setIsFocused(true)}
                                // value = {value}
                                mask = {props.mask}
                                {...props.inputProps}
                            />
                                       :
                            <TextInput
                                placeholder = {props.placeholder ? props.placeholder : null}
                                placeholderTextColor = {placeholderTextColor}
                                selectable
                                style = {inputStyles}
                                onBlur = {() => setIsFocused(false)}
                                onFocus = {() => setIsFocused(true)}
                                // value = {value}
                                {...props.inputProps}
                            />
                        }
                    </>

                    {
                        props.imageRight &&
                        <View style = {imageRightViewStyles}>
                            {
                                props.imageRight?.name &&
                                <Image
                                    source = {props.imageRight?.name}
                                    style = {imageRightStyles}
                                    resizeMode = "contain"
                                />
                            }
                        </View>
                    }
                    {
                        props.iconRight?.name &&
                        <TouchableOpacity style = {styles.iconRightTouchable}
                                          onPress = {props.iconRightOnPress?.type ? iconRightOnPress : props.iconRightOnPress}>
                            {getMyIcon(
                                {
                                    fontFamily: props.iconRight?.fontFamily || MyConstant.VectorIcon.FontAwesome,
                                    name      : props.iconRight?.name,
                                    color     : props.iconRight?.color || MyColor.Material.GREY["600"],
                                    style     : iconRightStyles
                                }
                            )}
                        </TouchableOpacity>
                    }
                </View>
            </TouchableWithoutFeedback>
            <View>
                <Animated.Text style = {helperTextStyles}>
                    {props.helperText?.visible ? (props.helperText?.message || MyLANG.HelperTextDefault) : ''}
                </Animated.Text>
            </View>
        </View>
    )
};

MyInput.propTypes = {
    mode                   : PropTypes.string,
    focusedBorder          : PropTypes.bool,
    focusedBorderColor     : PropTypes.any,
    placeholder            : PropTypes.string,
    floatingLabel          : PropTypes.string,
    floatingLabelBackground: PropTypes.string,
    floatingLabelFloated   : PropTypes.bool,
    inlineLabel            : PropTypes.string,
    placeholderLabel       : PropTypes.string,

    value     : PropTypes.any,
    inputProps: PropTypes.object,
    mask      : PropTypes.string,

    viewGroupStyle       : PropTypes.object,
    viewStyle            : PropTypes.object,
    floatingLabelStyle   : PropTypes.object,
    inlineLabelStyle     : PropTypes.object,
    inputStyle           : PropTypes.object,
    placeholderStyle     : PropTypes.object,
    placeholderLabelStyle: PropTypes.object,

    iconLeft     : PropTypes.object,
    iconLeftStyle: PropTypes.object,

    iconRight       : PropTypes.object,
    iconRightStyle  : PropTypes.object,
    iconRightOnPress: PropTypes.any,

    imageLeft         : PropTypes.object,
    imageLeftStyle    : PropTypes.object,
    imageLeftViewStyle: PropTypes.object,

    imageRight         : PropTypes.object,
    imageRightStyle    : PropTypes.object,
    imageRightViewStyle: PropTypes.object,

    helperText     : PropTypes.object,
    helperTextStyle: PropTypes.object,

    onPress: PropTypes.func,
}

MyInput.defaultProps = {
    mode                   : "line" || "outlined" || "rounded" || "transparent",
    focusedBorder          : false,
    // focusedBorderColor: {borderColor: MyColor.Material.DEEPPRUPLE["A400"]},
    placeholder            : null,
    // floatingLabel: "",
    floatingLabelBackground: "transparent",
    floatingLabelFloated   : false,
    // inlineLabel            : null,
    placeholderLabel       : null,

    value     : null,
    inputProps: {},
    mask      : null,

    viewGroupStyle       : {},
    viewStyle            : {},
    floatingLabelStyle   : {},
    inlineLabelStyle     : {},
    inputStyle           : {},
    placeholderStyle     : {},
    placeholderLabelStyle: {},

    iconLeft     : null,
    iconLeftStyle: {},

    iconRight       : null,
    iconRightStyle  : {},
    iconRightOnPress: null,

    imageLeft         : null,
    imageLeftStyle    : {},
    imageLeftViewStyle: {},

    imageRight         : null,
    imageRightStyle    : {},
    imageRightViewStyle: {},

    helperText     : null,
    helperTextStyle: {},

    // onPress: null,
};

export {MyInput};

const styles = StyleSheet.create(
    {
        viewGroup       : {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
            alignItems    : "flex-start",

            paddingTop   : 12,
            paddingBottom: 20,

            opacity: 1.00,
        },
        viewGroupFocused: {
            opacity: 1.00,
        },

        view       : {
            display       : "flex",
            flexDirection : "row",
            justifyContent: "flex-start",
            alignItems    : "center",
        },
        viewSuccess: {
            borderColor: MyColor.Material.GREEN["900"],
        },
        viewWarning: {
            borderColor: MyColor.Material.YELLOW["900"],
        },
        viewError  : {
            borderColor: MyColor.Material.RED["900"],
        },

        iconLeft           : {
            flex        : 0,
            paddingRight: 6,
            fontSize    : 18,
        },
        iconLeftLine       : {
            paddingRight: 6,
            fontSize    : 20,
        },
        iconLeftOutlined   : {
            paddingRight: 8,
            fontSize    : 20,
        },
        iconLeftRounded    : {
            paddingRight: 8,
            fontSize    : 18,
        },
        iconLeftTransparent: {
            paddingRight: 8,
            fontSize    : 18,
        },

        floatingLabel   : {},
        placeholderLabel: {
            position  : "absolute",
            bottom    : 3,
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 16,
            color     : MyColor.Material.GREY["600"],
        },
        inlineLabel     : {
            fontSize  : 16,
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            color     : MyColor.Material.GREY["700"],

            paddingRight: 10,

            flex     : 1,
            alignSelf: "center",

        },

        input      : {
            flex     : 1,
            alignSelf: "baseline",

            paddingLeft  : 0,
            paddingRight : 0,
            paddingTop   : 0,
            paddingBottom: 0,
            marginLeft   : 0,
            marginRight  : 0,
            marginTop    : 0,
            marginBottom : 0,

            fontSize  : 16,
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            color     : MyColor.Material.BLACK,

        },
        placeholder: {},

        iconRight           : {
            flex       : 0,
            paddingLeft: 6,
            fontSize   : 18,
        },
        iconRightLine       : {
            paddingLeft: 6,
            fontSize   : 20,
        },
        iconRightOutlined   : {
            paddingLeft: 8,
            fontSize   : 20,
        },
        iconRightRounded    : {
            paddingLeft: 8,
            fontSize   : 18,
        },
        iconRightTransparent: {
            paddingLeft: 6,
            fontSize   : 20,
        },

        iconRightTouchable: {},

        line        : {
            borderBottomWidth: 1.0,
            borderColor      : MyColor.Material.GREY["600"],
            paddingBottom    : 0,
        },
        lineIconLeft: {},

        outlined        : {
            borderWidth      : 1.0,
            borderRadius     : 4,
            borderColor      : MyColor.Material.GREY["800"],
            paddingVertical  : 12,
            paddingHorizontal: 14,
        },
        outlinedIconLeft: {
            paddingHorizontal: 12,
        },

        rounded          : {
            borderWidth      : 1.0,
            borderRadius     : 50,
            borderColor      : MyColor.Material.GREY["800"],
            paddingVertical  : 9,
            paddingHorizontal: 20,
        },
        roundedIconLeft  : {
            paddingHorizontal: 18,
        },
        helperTextRounded: {
            paddingHorizontal: 20,
        },

        transparent        : {
            paddingBottom: 0,
        },
        transparentIconLeft: {},

        focusedBorderNot: {
            // borderColor      : MyColor.Material.GREY["800"],
        },

        focusedBorderLine    : {
            borderBottomWidth: 1.0,
        },
        focusedBorderOutlined: {
            borderWidth: 1.0,
        },
        focusedBorderRounded : {
            borderWidth: 1.0,
        },

        focusedBorderColor: {},

        helperText: {
            position: "absolute",

            fontSize  : 11,
            fontFamily: MyStyle.FontFamily.Roboto.medium,
            color     : MyColor.Material.GREY["950"],

            marginTop: 2,
        },

        helperTextSuccess: {
            color: MyColor.Material.GREEN["900"],
        },
        helperTextWarning: {
            color: MyColor.Material.YELLOW["900"],
        },
        helperTextError  : {
            color: MyColor.Material.RED["900"],
        },

        imageLeftView : {
            flex       : 0,
            marginRight: 6,
            alignSelf  : "flex-start",
        },
        imageLeft     : {
            width : 22,
            height: 22,
        },
        imageRightView: {
            flex      : 0,
            marginLeft: 6,
            alignSelf : "flex-start"
        },
        imageRight    : {
            width : 22,
            height: 22,
        },
    }
);

/*<MyInput
    mode = "line"
    focusedBorder
    focusedBorderColor
    // placeholder = "Enter your Passwords"
    floatingLabel = "Enter your Password"
    floatingLabelBackground = "#f1f1f1"
    // inlineLabel = "Enter your Password"

    // onPress = {(e: any) => {
    //     console.log('onPress: HOME:');
    // }}

    value = {getValues().username}
    inputProps = {{
        secureTextEntry: false,
        editable       : true,
        onChangeText   : (text: any) => setValue('username', text, true)
    }}

    viewGroupStyle = {{}}
    viewStyle = {{}}
    floatingLabelStyle = {{}}
    inlineLabelStyle = {{}}
    inputStyle = {{}}
    placeholderStyle = {{}}

    // iconLeft = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'home'}}
    // iconLeftStyle = {{}}
    // iconRight = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'eye'}}
    // iconRightStyle = {{}}
    // iconRightOnPress = {{type: 'secureTextEntry'}}
    // iconRightOnPress = {(e: any) => {
    //     console.log('iconRightOnPress: HOME');
    // }}
    imageLeft = {{name: MyImage.plate}}
    imageLeftStyle = {{}}
    imageLeftViewStyle = {{}}
    imageRight = {{name: MyImage.plate}}
    imageRightStyle = {{}}
    imageRightViewStyle = {{}}

    helperText = {{
        colorLeftIcon : true,
        colorRightIcon: true,
        type          : "error",
        visible       : errors.username?.message ? true : false,
        message       : errors.username?.message ? errors.username.message : '',
    }}
    helperTextStyle = {{}}
/>*/
