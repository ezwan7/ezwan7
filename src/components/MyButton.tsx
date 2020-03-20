import React from "react";
import {StyleSheet, TouchableNativeFeedback, TouchableOpacity, View, Text, TouchableWithoutFeedback, Image, TouchableHighlight} from "react-native";

import MyIcon from "./MyIcon";
import MyColor from "../common/MyColor";
import PropTypes from "prop-types";
import {getMyIcon} from "./MyComponent";
import {MyConstant} from "../common/MyConstant";
import {MyStyle} from "../common/MyStyle";
import LinearGradient from "react-native-linear-gradient";
import MyImage from "../shared/MyImage";
import MyMaterialRipple from "./MyMaterialRipple";

let renderCount = 0;

const HeaderCartButton = ({}) => {
    return (
        <TouchableNativeFeedback
            onPress = {() => {

            }}
            background = {TouchableNativeFeedback.SelectableBackground()}>
            <View style = {{paddingHorizontal: 7, paddingVertical: 4, borderRadius: 12}}>
                <MyIcon.FontAwesome
                    name = "shopping-bag"
                    size = {20}
                    color = {MyColor.Material.WHITE}
                />
            </View>
        </TouchableNativeFeedback>
    );
};

const MyButton = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        console.log(`LOG: ${MyButton.name}. renderCount: `, renderCount);
    }

    let LGButton: any = MyStyle.LGButtonPrimary;

    const linearGradientStyles = [
        styles.linearGradient,

        props.shape === "square" && {
            borderRadius: 0,
        } ||
        props.shape === "outlined" && {
            borderRadius: 5,
        } ||
        props.shape === "rounded" && {
            borderRadius: 50,
        } ||
        props.shape === "circular" && {
            borderRadius: props.buttonStyle?.width > 0 ? (props.buttonStyle?.width / 2) : 100,
        },

        props.fill === "transparent" && (LGButton.colors = ["transparent", "transparent"]) ||
        props.fill === "outlined" && (LGButton.colors = ["transparent", "transparent"]) && {
            borderWidth: 1.5,
            borderColor: props.color,
        } ||
        props.fill === "solid" && (LGButton.colors = [props.color, props.color]) ||
        props.fill === "gradient" && (LGButton.start = props.color?.start, LGButton.end = props.color?.end, LGButton.locations = props.color?.locations, LGButton.colors = props.color?.colors),

        props.shadow === "none" && styles.shadowNone ||
        props.shadow === "small" && styles.shadowSmall ||
        props.shadow === "medium" && styles.shadowMedium ||
        props.shadow === "large" && styles.shadowLarge,

        props.display === "full" && styles.shadowNone,
        props.display === "full" && ((props.fill === "outlined" && {
            borderRadius      : 0,
            borderLeftWidth   : 0,
            borderRightWidth  : 0,
            borderTopWidth    : 1.5,
            borderBottomtWidth: 1.5,
        }) || {
            borderRadius: 0,
        }),

        props.display === "inline" && {
            alignSelf: "center",
        } ||
        props.display === "block" && {
            alignSelf: "stretch",
        } ||
        props.display === "full" && props.fill === "outlined" && {
            alignSelf: "stretch",
        },

        {...props.linearGradientStyle}
    ];

    const touchableStyles = [
        styles.touchable,

        props.shape === "square" && {
            borderRadius: 0,
        } ||
        props.shape === "outlined" && {
            borderRadius: 5,
        } ||
        props.shape === "rounded" && {
            borderRadius: 50,
        } ||
        props.shape === "circular" && {
            borderRadius: props.buttonStyle?.width > 0 ? (props.buttonStyle?.width / 2) : 100,
        },

        props.direction === "vertical" && {
            display      : "flex",
            flexDirection: "row",
            alignItems   : "center",
        },
        props.direction === "vertical" && (
            props.spacing === "start" && {
                justifyContent: "flex-start",
            } ||
            props.spacing === "center" && {
                justifyContent: "center",
            } ||
            props.spacing === "end" && {
                justifyContent: "flex-end",
            }
        ),

        props.direction === "horizontal" && {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
        },
        props.direction === "horizontal" && (props.spacing === "startCenter" && {
                // alignItems: "flex-start",
            }
        ),

        {...props.touchableStyle}
    ];

    const buttonViewStyles = [
        styles.buttonView,

        props.size === "small" && styles.buttonSmall ||
        props.size === "normal" && styles.buttonNormal ||
        props.size === "large" && styles.buttonLarge,

        props.shape === "square" && {
            borderRadius: 0,
        } ||
        props.shape === "outlined" && {
            borderRadius: 5,
        } ||
        props.shape === "rounded" && {
            borderRadius: 50,
        } ||
        props.shape === "circular" && {
            borderRadius: props.buttonStyle?.width > 0 ? (props.buttonStyle?.width / 2) : 100,
        },
        props.shape === "rounded" && (props.size === "small" && {paddingHorizontal: 16} ||
                                      props.size === "normal" && {paddingHorizontal: 20} ||
                                      props.size === "large" && {paddingHorizontal: 26}),

        props.display === "full" && {
            borderRadius: 0,
        },

        !props.title && (props.shape === "rounded" && {
            paddingLeft  : 20,
            paddingRight : 20,
            paddingTop   : 15,
            paddingBottom: 15,
        } || {
            paddingLeft  : 15,
            paddingRight : 15,
            paddingTop   : 15,
            paddingBottom: 15,
        }),


        props.direction === "vertical" && (props.title && (props.iconLeft?.name || props.iconRight?.name || props.imageLeft?.name || props.imageRight?.name) && {
            paddingTop   : 8,
            paddingBottom: 8,
            height       : "auto",
        }),
        props.direction === "vertical" && {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "center",
            alignItems    : "center",
        },

        props.direction === "horizontal" && {
            display      : "flex",
            flexDirection: "row",
            alignItems   : "center",
        },
        props.direction === "horizontal" && (
            props.spacing === "start" && {
                justifyContent: "flex-start",
            } ||
            props.spacing === "center" && {
                justifyContent: "center",
            } ||
            props.spacing === "end" && {
                justifyContent: "flex-end",
            } ||
            props.spacing === "spaceBetween" && {
                justifyContent: "space-between",
            } ||
            props.spacing === "startCenter" && {
                //
            }
        ),

        {...props.buttonViewStyle}
    ];

    const textStyles = [
        styles.text,

        props.size === "small" && styles.textSmall ||
        props.size === "normal" && styles.textNormal ||
        props.size === "large" && styles.textLarge,

        props.textTransform === "uppercase" && {
            textTransform: "uppercase",
        } ||
        props.textTransform === "lowercase" && {
            textTransform: "lowercase",
        } ||
        props.textTransform === "capitalize" && {
            textTransform: "capitalize",
        },

        (props.direction === "horizontal" && props.spacing === "startCenter") && {
            flex     : 1,
            textAlign: "center",
        },

        {...props.textStyle}
    ];

    const iconLeftStyles = [
        styles.iconLeft,

        props.size === "small" && styles.iconSmall ||
        props.size === "normal" && styles.iconNormal ||
        props.size === "large" && styles.iconLarge,

        props.iconLeft && props.direction === "vertical" && {
            marginRight: 0,
        },

        (props.iconLeft && props.direction === "horizontal" && props.spacing === "startCenter") && {
            flex       : 1,
            marginRight: 0,
            textAlign  : "left",
        },

        props.iconLeft && !props.title && {
            marginLeft  : 0,
            marginRight : 0,
            marginTop   : 0,
            marginBottom: 0,
        },

        {...props.iconLeftStyle}
    ];

    const iconRightStyles = [
        styles.iconRight,

        props.size === "small" && styles.iconSmall ||
        props.size === "normal" && styles.iconNormal ||
        props.size === "large" && styles.iconLarge,

        props.iconRight && props.direction === "vertical" && {
            marginLeft: 0,
        },

        (props.iconRight && props.direction === "horizontal" && props.spacing === "centerEnd") && {
            flex      : 1,
            marginLeft: 0,
            textAlign : "right",
        },

        {...props.iconRightStyle}
    ];

    const imageLeftViewStyles = [
        styles.imageLeftView,

        props.imageLeft && props.direction === "vertical" && {
            marginRight: 0,
        },

        (props.imageLeft && props.direction === "horizontal" && (props.spacing === "startCenter" || props.spacing === "centerEnd")) && {
            flex       : 1,
            marginRight: 0,
        },

        !props.title && {
            marginLeft  : 0,
            marginRight : 0,
            marginTop   : 0,
            marginBottom: 0,
        },

        {...props.imageLeftViewStyle}
    ];
    const imageLeftStyles     = [
        styles.imageLeft,

        props.size === "small" && styles.imageSmall ||
        props.size === "normal" && styles.imageNormal ||
        props.size === "large" && styles.imageLarge,


        {...props.imageLeftStyle}
    ];

    const imageRightViewStyles = [
        styles.imageRightView,

        props.direction === "vertical" && {
            marginLeft: 0,
        },

        (props.imageRight && props.direction === "horizontal" && (props.spacing === "startCenter" || props.spacing === "centerEnd")) && {
            flex      : 1,
            marginLeft: 0,
            alignItems: "flex-end"
        },

        {...props.imageRightViewStyle}
    ];
    const imageRightStyles     = [
        styles.imageRight,

        props.size === "small" && styles.imageSmall ||
        props.size === "normal" && styles.imageNormal ||
        props.size === "large" && styles.imageLarge,

        {...props.imageRightStyle}
    ];

    const buttonView = (
        <View style = {buttonViewStyles}>
            {
                props.iconLeft?.name &&
                getMyIcon(
                    {
                        fontFamily: props.iconLeft?.fontFamily || MyConstant.VectorIcon.FontAwesome,
                        name      : props.iconLeft?.name,
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
            {
                props.title &&
                <Text style = {textStyles}>
                    {props.title}
                </Text>
            }
            {
                props.iconRight?.name &&
                getMyIcon(
                    {
                        fontFamily: props.iconRight?.fontFamily || MyConstant.VectorIcon.FontAwesome,
                        name      : props.iconRight?.name,
                        style     : iconRightStyles
                    }
                )
            }
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
        </View>
    );

    const touchableComponent = () => {
        console.log(`LOG: ${MyButton.name}. touchableComponent: `);
        switch (props.touch) {
            case "highlight":
                return (
                    <TouchableHighlight style = {touchableStyles}
                                        onPress = {props.onPress}
                                        {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableHighlight>
                )
            case "opacity":
                return (
                    <TouchableOpacity style = {touchableStyles}
                                      onPress = {props.onPress}
                                      {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableOpacity>
                )
            case "ripple":
                return (
                    <MyMaterialRipple style = {touchableStyles}
                                      onPress = {props.onPress}
                                      {...props.touchableProps}
                    >
                        {buttonView}
                    </MyMaterialRipple>
                )
            case "none":
                return (
                    <TouchableWithoutFeedback style = {touchableStyles}
                                              onPress = {props.onPress}
                                              {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableWithoutFeedback>
                )
            default:
                return (
                    <TouchableWithoutFeedback style = {touchableStyles}
                                              onPress = {props.onPress}
                                              {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableWithoutFeedback>
                )
        }
    };

    return (

        <LinearGradient
            style = {linearGradientStyles}
            start = {LGButton.start}
            end = {LGButton.end}
            locations = {LGButton.locations}
            colors = {LGButton.colors}
        >
            {touchableComponent()}
        </LinearGradient>
    );
};

MyButton.propTypes = {
    size         : PropTypes.string,
    shape        : PropTypes.string,
    fill         : PropTypes.string,
    color        : PropTypes.any,
    shadow       : PropTypes.string,
    display      : PropTypes.string,
    direction    : PropTypes.string,
    spacing      : PropTypes.string,
    touch        : PropTypes.string,
    textTransform: PropTypes.string,

    linearGradientStyle: PropTypes.object,
    touchableStyle     : PropTypes.object,
    touchableProps     : PropTypes.object,
    buttonViewStyle    : PropTypes.object,
    textStyle          : PropTypes.object,
    iconLeft           : PropTypes.object,
    iconLeftStyle      : PropTypes.object,
    iconRight          : PropTypes.object,
    iconRightStyle     : PropTypes.object,
    imageLeft          : PropTypes.object,
    imageLeftStyle     : PropTypes.object,
    imageLeftViewStyle : PropTypes.object,
    imageRight         : PropTypes.object,
    imageRightStyle    : PropTypes.object,
    imageRightViewStyle: PropTypes.object,

    title: PropTypes.string,

    onPress: PropTypes.func,
}

MyButton.defaultProps = {
    size         : "small" || "normal" || "large",
    shape        : "square" || "outlined" || "rounded" || "circular",
    fill         : "transparent" || "outlined" || "solid" || "gradient", // outlined = color, icon____Style color,
    color        : MyColor.PrimaryGradient.thrid,
    shadow       : "none" || "small" || "medium" || "large",
    display      : "inline" || "block" || "full",
    direction    : "vertical" || "horizontal",
    spacing      : "start" || "center" || "end" || "spaceBetween" || "startCenter" || "centerEnd",
    touch        : "none" || "ripple" || "opacity" || "highlight",
    textTransform: "uppercase" || "lowercase" || "capitalize",

    linearGradientStyle: {},
    touchableStyle     : {},
    touchableProps     : {},
    buttonViewStyle    : {},
    textStyle          : {},
    iconLeft           : null,
    iconLeftStyle      : {},
    iconRight          : null,
    iconRightStyle     : {},
    imageLeft          : null,
    imageLeftStyle     : {},
    imageLeftViewStyle : {},
    imageRight         : null,
    imageRightStyle    : {},
    imageRightViewStyle: {},

    // title: null,

    // onPress: null,
}

export {HeaderCartButton, MyButton};

const styles = StyleSheet.create(
    {
        linearGradient: {},
        touchable     : {},
        buttonView    : {},

        buttonSmall : {
            height           : 32,
            paddingHorizontal: 13,
        },
        buttonNormal: {
            height           : 46,
            paddingHorizontal: 20,
        },
        buttonLarge : {
            height           : 56,
            paddingHorizontal: 24,
        },

        textSmall : {
            fontSize  : 13,
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
        },
        textNormal: {
            fontSize  : 15,
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
        },
        textLarge : {
            fontSize  : 18,
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
        },

        iconSmall : {
            fontSize: 11,
        },
        iconNormal: {
            fontSize: 17,
        },
        iconLarge : {
            fontSize: 20,
        },

        imageSmall : {
            width : 14,
            height: 14,
        },
        imageNormal: {
            width : 20,
            height: 20,
        },
        imageLarge : {
            width : 25,
            height: 25,
        },

        shadowNone  : {
            shadowColor  : "#000000",
            shadowOffset : {
                width : 0,
                height: 0,
            },
            shadowOpacity: 0,
            shadowRadius : 0,

            elevation: 0
        },
        shadowSmall : {
            shadowColor  : "#000000",
            shadowOffset : {
                width : 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius : 2.22,

            elevation: 3,
        },
        shadowMedium: {
            shadowColor  : "#000000",
            shadowOffset : {
                width : 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius : 3.84,

            elevation: 5,
        },
        shadowLarge : {
            shadowColor  : "#000000",
            shadowOffset : {
                width : 0,
                height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius : 6.27,

            elevation: 10,
        },

        text: {
            color: MyColor.white,
        },

        iconLeft : {
            marginRight: 8,
            color      : MyColor.white,
        },
        iconRight: {
            marginLeft: 8,
            color     : MyColor.white,
        },

        imageLeft     : {},
        imageRight    : {},
        imageLeftView : {
            marginRight: 8,
        },
        imageRightView: {
            marginLeft: 8,
        },
    }
)

/*<MyButton
    size = "normal"
    shape = "rounded"
    fill = "gradient"
    color = {MyStyle.LGButtonPrimary}
    shadow = "medium"
    display = "block"
    direction = "horizontal"
    spacing = "center"
    textTransform = "capitalize"

    title = "Submit"

    buttonStyle = {{}}
    buttonViewStyle = {{}}
    textStyle = {{}}

    // iconLeft = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: "home"}}
    // iconLeftStyle = {{}}
    // iconRight = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: "eye"}}
    // iconRightStyle = {{}}
    // imageLeft = {{name: MyImage.plate}}
    // imageLeftStyle = {{}}
    // imageLeftViewStyle = {{}}
    // imageRight = {{}}
    // imageRightStyle = {{}}
    // imageRightViewStyle = {{}}

    onPress = {(e: any) => {
        formSubmit(e);
    }}
/>*/
// for icon left text center: use imageLeft = {{}} along with spacing=startCenter
