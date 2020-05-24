import React from "react";
import {StyleSheet, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, View, Text, Image} from "react-native";

import MyIcon from "./MyIcon";
import MyColor from "../common/MyColor";
import PropTypes from "prop-types";
import {getMyIcon} from "./MyIcon";
import {MyConstant} from "../common/MyConstant";
import {MyStyle} from "../common/MyStyle";
import LinearGradient from "react-native-linear-gradient";
import MyImage from "../shared/MyImage";
import MyMaterialRipple from "./MyMaterialRipple";
import {Shadow} from "react-native-neomorph-shadows";

let renderCount = 0;

const HeaderButtonLeft = (prop: any) => {
    return (
        <MyMaterialRipple
            {...MyStyle.MaterialRipple.headerButton}
            style = {[stylesHeaderButtonLeft.view, prop.view?.style]}
            onPress = {prop.onPress}
        >
            <>
                {prop.image?.src &&
                 <Image
                     source = {prop.image?.src || MyImage.defaultAvatar}
                     resizeMode = "contain"
                     style = {[stylesHeaderButtonLeft.image, prop.image?.style]}
                 />
                }
                {
                    prop.icon?.name &&
                    getMyIcon(
                        {
                            fontFamily: prop.icon?.fontFamily || MyConstant.VectorIcon.Feather,
                            name      : prop.icon?.name || 'home',
                            size      : prop.icon?.size || 24,
                            style     : [stylesHeaderButtonLeft.icon, prop.icon?.style]
                        }
                    )
                }
            </>
        </MyMaterialRipple>
    );
};

const MyButton = (props: any) => {

    if (__DEV__) {
        renderCount += 1;
        // console.log(`LOG: ${MyButton.name}. renderCount: `, renderCount);
    }

    let LGButton: any = MyStyle.LGButtonPrimaryMyButton;

    const shadowStyles = {
        shadowOffset : {
            width : 0,
            height: props.shadow === "small" && 1 ||
                    props.shadow === "medium" && 2 ||
                    props.shadow === "large" && 5
        },
        shadowColor  : "#000000",
        shadowOpacity: props.shadow === "small" && 0.7 ||
                       props.shadow === "medium" && 0.5 ||
                       props.shadow === "large" && 0.6,
        shadowRadius : props.shadow === "small" && 3 ||
                       props.shadow === "medium" && 5 ||
                       props.shadow === "large" && 8,
        borderRadius : props.shape === "square" && MyStyle.borderRadiusButtonSquare ||
                       props.shape === "outlined" && MyStyle.borderRadiusButtonOutlined ||
                       props.shape === "rounded" && MyStyle.borderRadiusButtonRounded ||
                       props.shape === "circular" && MyStyle.borderRadiusButtonCircular,
        width        : props.display === "inline" && props?.shadowStyle?.width ||
                       props.display === "block" && props?.shadowStyle?.width ||
                       props.display === "full" && props?.shadowStyle?.width,
        height       : props.size === "small" && MyStyle.buttonHeightSmall ||
                       props.size === "normal" && MyStyle.buttonHeightNormal ||
                       props.size === "large" && MyStyle.buttonHeightLarge,
    };

    const viewStyles = [
        styles.viewStyle,

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
            // alignSelf: "center",
        } ||
        props.display === "block" && {
            flex     : 1,
            alignSelf: "stretch",
        } ||
        props.display === "full" && props.fill === "outlined" && {
            alignSelf: "stretch",
        },

        {...props.viewStyle}
    ];

    const linearGradientStyles = [
        styles.linearGradient,

        props.shape === "square" && {
            borderRadius: MyStyle.borderRadiusButtonSquare,
        } ||
        props.shape === "outlined" && {
            borderRadius: MyStyle.borderRadiusButtonOutlined,
        } ||
        props.shape === "rounded" && {
            borderRadius: MyStyle.borderRadiusButtonRounded,
        } ||
        props.shape === "circular" && {
            borderRadius: props.buttonStyle?.width > 0 ? (props.buttonStyle?.width / 2) : MyStyle.borderRadiusButtonCircular,
        }, //  display = "inline", buttonViewStyle = {{height: 100, width: 100}}

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

        {...props.linearGradientStyle}
    ];

    const touchableStyles = [
        styles.touchable,

        props.shape === "square" && {
            borderRadius: MyStyle.borderRadiusButtonSquare,
        } ||
        props.shape === "outlined" && {
            borderRadius: MyStyle.borderRadiusButtonOutlined,
        } ||
        props.shape === "rounded" && {
            borderRadius: MyStyle.borderRadiusButtonRounded,
        } ||
        props.shape === "circular" && {
            borderRadius: props.buttonStyle?.width > 0 ? (props.buttonStyle?.width / 2) : MyStyle.borderRadiusButtonCircular,
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
            borderRadius: MyStyle.borderRadiusButtonSquare,
        } ||
        props.shape === "outlined" && {
            borderRadius: MyStyle.borderRadiusButtonOutlined,
        } ||
        props.shape === "rounded" && {
            borderRadius: MyStyle.borderRadiusButtonRounded,
        } ||
        props.shape === "circular" && {
            borderRadius: props.buttonStyle?.width > 0 ? (props.buttonStyle?.width / 2) : MyStyle.borderRadiusButtonCircular,
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

        (props.fill === "transparent" && props.color) && {
            color: props.color,
        },

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
                        fontFamily: props.iconLeft?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
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
                        fontFamily: props.iconRight?.fontFamily || MyConstant.VectorIcon.SimpleLineIcons,
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
        switch (props.touch) {
            case "highlight": // {{underlayColor: 'rgba(0,0,0,0.35)'}}
                return (
                    <TouchableHighlight
                        onPress = {props.onPress}
                        style = {touchableStyles}
                        {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableHighlight>
                )
            case "opacity": // touchableProps = {{activeOpacity: 0.7}}
                return (
                    <TouchableOpacity
                        onPress = {props.onPress}
                        style = {touchableStyles}
                        {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableOpacity>
                )
            case "ripple": // touchableProps = {{rippleSize: 400, rippleDuration: 1000, rippleContainerBorderRadius: MyStyle.borderRadiusButtonOutlined, rippleCentered: true}}
                props.touchableProps.rippleContainerBorderRadius = props.shape === "square" && MyStyle.borderRadiusButtonSquare ||
                                                                   props.shape === "outlined" && MyStyle.borderRadiusButtonOutlined ||
                                                                   props.shape === "rounded" && MyStyle.borderRadiusButtonRounded ||
                                                                   props.shape === "circular" && MyStyle.borderRadiusButtonCircular;
                return (
                    <MyMaterialRipple
                        style = {touchableStyles}
                        {...props.touchableProps}
                        onPress = {() => props.onPress()}
                    >
                        {buttonView}
                    </MyMaterialRipple>
                )
            case "none":
                return (
                    <TouchableWithoutFeedback
                        onPress = {props.onPress}
                        style = {touchableStyles}
                        {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableWithoutFeedback>
                )
            default:
                return (
                    <TouchableWithoutFeedback
                        onPress = {props.onPress}
                        style = {touchableStyles}
                        {...props.touchableProps}
                    >
                        {buttonView}
                    </TouchableWithoutFeedback>
                )
        }
    };

    const button =
              props?.shadowStyle?.width ?
              <Shadow
                  useSvg
                  style = {shadowStyles}
              >
                  <View style = {viewStyles}>
                      <LinearGradient
                          style = {linearGradientStyles}
                          start = {LGButton.start}
                          end = {LGButton.end}
                          locations = {LGButton.locations}
                          colors = {LGButton.colors}
                      >
                          {touchableComponent()}
                      </LinearGradient>
                  </View>
              </Shadow>
                                        :
              <View style = {viewStyles}>
                  <LinearGradient
                      style = {linearGradientStyles}
                      start = {LGButton.start}
                      end = {LGButton.end}
                      locations = {LGButton.locations}
                      colors = {LGButton.colors}
                  >
                      {touchableComponent()}
                  </LinearGradient>
              </View>
    ;

    return button;
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

    shadowStyle        : PropTypes.any,
    viewStyle          : PropTypes.any,
    linearGradientStyle: PropTypes.any,
    touchableStyle     : PropTypes.any,
    touchableProps     : PropTypes.any,
    buttonViewStyle    : PropTypes.any,
    textStyle          : PropTypes.any,
    iconLeft           : PropTypes.any,
    iconLeftStyle      : PropTypes.any,
    iconRight          : PropTypes.any,
    iconRightStyle     : PropTypes.any,
    imageLeft          : PropTypes.any,
    imageLeftStyle     : PropTypes.any,
    imageLeftViewStyle : PropTypes.any,
    imageRight         : PropTypes.any,
    imageRightStyle    : PropTypes.any,
    imageRightViewStyle: PropTypes.any,

    title: PropTypes.string,

    onPress: PropTypes.func,
}

MyButton.defaultProps = {
    size         : "normal" || "small" || "large",
    shape        : "rounded" || "outlined" || "square" || "circular",
    fill         : "gradient" || "outlined" || "solid" || "transparent", // outlined = color, icon____Style color,
    color        : MyStyle.LGButtonPrimary,
    shadow       : "medium" || "large" || "small" || "none",
    display      : "block" || "inline" || "full",
    direction    : "horizontal" || "vertical",
    spacing      : "center" || "start" || "end" || "spaceBetween" || "startCenter" || "centerEnd",
    touch        : "ripple" || "opacity" || "highlight" || "none",
    textTransform: "uppercase" || "lowercase" || "capitalize",

    shadowStyle        : null,
    viewStyle          : {},
    linearGradientStyle: {},
    touchableStyle     : {},
    touchableProps     : {
        rippleSize                 : 400,
        rippleDuration             : 1000,
        rippleContainerBorderRadius: 0,
        rippleCentered             : false
    },
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

export {HeaderButtonLeft, MyButton};

const stylesHeaderButtonLeft = StyleSheet.create(
    {
        view : {
            paddingHorizontal: 10,
            paddingVertical  : 10,
            borderRadius     : 6,
        },
        icon : {
            color: MyColor.Material.WHITE,
        },
        image: {
            width : 22,
            height: 22,
        },
    }
);

const styles = StyleSheet.create(
    {
        shadowStyle   : {},
        viewStyle     : {},
        linearGradient: {},
        touchable     : {},
        buttonView    : {},

        buttonSmall : {
            height           : MyStyle.buttonHeightSmall,
            paddingHorizontal: 13,
        },
        buttonNormal: {
            height           : MyStyle.buttonHeightNormal,
            paddingHorizontal: 20,
        },
        buttonLarge : {
            height           : MyStyle.buttonHeightLarge,
            paddingHorizontal: 24,
        },

        textSmall : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
        },
        textNormal: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
        },
        textLarge : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 17,
        },

        iconSmall : {
            fontSize: 11,
        },
        iconNormal: {
            fontSize: 16,
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
            shadowOpacity: 0.5,
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
            color: MyColor.Material.WHITE,
        },

        iconLeft : {
            marginRight: 8,
            color      : MyColor.Material.WHITE,
        },
        iconRight: {
            marginLeft: 8,
            color     : MyColor.Material.WHITE,
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
);

/*<MyButton
    size = "normal"
    shape = "outlined"
    fill = "gradient"
    color = {MyStyle.LGButtonPrimary}
    shadow = "medium"
    display = "block"
    direction = "horizontal"
    spacing = "center"
    touch = "ripple"
    textTransform = "capitalize"

    title = {MyLANG.OK}

    // shadowStyle = {{width: MyStyle.screenWidth - 64}} // width means use library shadow.
    viewStyles = {{}}
    linearGradientStyle = {{}}
    touchableStyle = {{}}
    touchableProps = {{
        rippleSize                 : 400,
        rippleDuration             : 1000,
        rippleContainerBorderRadius: 0,
        rippleCentered             : false
    }}
    buttonViewStyle = {{}}
    textStyle = {{}}

    // iconLeft = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'home'}}
    // iconLeftStyle = {{}}
    // iconRight = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'eye'}}
    // iconRightStyle = {{}}
    // imageLeft = {{name: MyImage.plate}}
    // imageLeftStyle = {{}}
    // imageLeftViewStyle = {{}}
    // imageRight = {{}}
    // imageRightStyle = {{}}
    // imageRightViewStyle = {{}}

    onPress = {(e: any) => {
        // formSubmit(e);
    }}
/>*/

// for icon left text center: use imageLeft = {{}} along with spacing=startCenter
