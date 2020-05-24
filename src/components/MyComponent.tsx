import React from 'react';

import {ActivityIndicator, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import LottieView from 'lottie-react-native';

import {MyStyle, MyStyleSheet} from "../common/MyStyle";
import MyColor from "../common/MyColor";
import {MyConstant} from "../common/MyConstant";
import MyIcon from "./MyIcon";
import MyImage from "../shared/MyImage";
import {Shadow} from "react-native-neomorph-shadows";
import {MyConfig} from "../shared/MyConfig";
import MyLANG from "../shared/MyLANG";
import {MyButton} from "./MyButton";
import {getMyIcon} from "./MyIcon";
import MyMaterialRipple from "./MyMaterialRipple";

const getImage = (props: any) => {
    return (<Image {...props}/>)
}

const StatusBarLight = () => {
    return (
        <StatusBar
            animated = {true}
            backgroundColor = "transparent"
            barStyle = "light-content"
            translucent = {true}
        />
    )
}

const StatusBarDark = () => {
    return (
        <StatusBar
            animated = {true}
            backgroundColor = "transparent"
            barStyle = "dark-content"
            translucent = {true}
        />
    )
}

const StatusBarGradientPrimary = (props: any) => {
    return (
        <LinearGradient
            {...MyStyle.LGHeaderPrimary}
            style = {{
                height: MyStyle.statusBarHeight,
            }}
        />
    )
}

const HeaderGradientPrimary = (props: any) => {
    return (
        <Shadow style = {MyStyle.neomorphShadow.header}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
                style = {{
                    flex: 1,
                }}
            >
            </LinearGradient>
        </Shadow>
    )
}

const HeaderGradientPrimaryLogo = (props: any) => {
    return (
        <Shadow style = {MyStyle.neomorphShadow.header}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
                style = {{
                    flex          : 1,
                    display       : 'flex',
                    flexDirection : 'column',
                    justifyContent: 'flex-end',
                    alignItems    : 'center',
                }}
            >
                <Image
                    source = {MyImage.logo_white}
                    style = {{
                        height      : MyStyle.headerHeight / 2,
                        width       : MyStyle.screenWidth * 0.3,
                        marginBottom: 6,
                    }}
                    resizeMode = "contain"
                />
            </LinearGradient>
        </Shadow>

    )
}

const HeaderInputSearch = (props: any) => {
    return (
        <Shadow style = {MyStyle.neomorphShadow.header}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
                style = {{
                    flex          : 1,
                    flexDirection : "row",
                    justifyContent: "center",
                    alignItems    : "flex-end",
                }}
            >
                <View style = {{
                    flexGrow      : 1,
                    display       : "flex",
                    flexDirection : "row",
                    justifyContent: "flex-start",
                    alignItems    : "center",

                    marginHorizontal: MyStyle.marginHorizontalPage,
                    marginBottom    : 6,

                    borderWidth    : 1.0,
                    borderRadius   : 50,
                    borderColor    : MyColor.Primary.transparent40,
                    backgroundColor: MyColor.Material.GREY["12"],
                }}>
                    <MyIcon.AntDesign
                        name = "search1"
                        size = {17}
                        color = {MyColor.Material.BLACK}
                        style = {{paddingLeft: 14, paddingVertical: 8.9}}
                    />
                    <TextInput
                        style = {{
                            flex   : 1,
                            padding: 0,

                            marginLeft: 10,

                            fontSize  : MyStyle.FontSize.small,
                            fontFamily: MyStyle.FontFamily.Roboto.regular,
                            color     : MyColor.Material.BLACK,
                        }}
                        numberOfLines = {1}
                        placeholder = {MyLANG.SearchProductByName}
                        placeholderTextColor = {MyColor.Material.GREY["800"]}
                        onChangeText = {props.onChangeText}
                        onSubmitEditing = {props.onSubmitEditing}
                        value = {props.value}
                    />
                    {
                        props.value?.length > 0 &&
                        <TouchableOpacity
                            activeOpacity = {0.7}
                            onPress = {props.onClearIcon}
                        >
                            <MyIcon.SimpleLineIcons
                                name = "close"
                                size = {17}
                                color = {MyColor.Material.BLACK}
                                style = {{paddingRight: 6, paddingVertical: 8, paddingLeft: 6}}
                            />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        activeOpacity = {0.7}
                        onPress = {props.onRightIcon}
                        style = {{
                            paddingVertical: 8.9,
                            borderLeftWidth: 1,
                            borderLeftColor: MyColor.Material.GREY["500"],
                        }}
                    >
                        <MyIcon.Ionicons
                            name = "ios-options"
                            size = {17}
                            color = {MyColor.Material.BLACK}
                            style = {{
                                paddingRight: 14,
                                paddingLeft : 10,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </Shadow>
    )
}

const HeaderInputSearchOptionPage = (props: any) => {
    return (
        <Shadow style = {MyStyle.neomorphShadow.header}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
                style = {{
                    flex          : 1,
                    flexDirection : "row",
                    justifyContent: "flex-start",
                    alignItems    : "center",
                    paddingTop    : MyStyle.platformOS === "ios" ? (MyStyle.headerHeight / 2) : (MyStyle.headerHeightAdjusted / 2),
                    paddingBottom : 2,
                }}
            >
                {
                    props?.showBackButton !== false && <MyHeaderBackButton
                        color = {MyColor.Material.WHITE}
                        onPress = {props.onBack}
                    />
                }
                {
                    props?.title && <Text style = {[MyStyleSheet.textHeader2, {}]}>{props?.title}</Text>
                }
                {
                    props?.allowSearch &&
                    <View style = {{
                        alignSelf: "flex-end",

                        flexGrow: 1,

                        display       : "flex",
                        flexDirection : "row",
                        justifyContent: "flex-start",
                        alignItems    : "center",

                        marginLeft  : MyStyle.marginHorizontalList / 2,
                        marginRight : MyStyle.marginHorizontalPage,
                        marginBottom: 6,

                        borderWidth    : 1.0,
                        borderRadius   : 50,
                        borderColor    : MyColor.Primary.transparent40,
                        backgroundColor: MyColor.Material.GREY["12"],
                    }}>
                        <MyIcon.AntDesign
                            name = "search1"
                            size = {17}
                            color = {MyColor.Material.BLACK}
                            style = {{paddingLeft: 14, paddingVertical: 10}}
                        />
                        <TextInput
                            style = {{
                                width: MyStyle.screenWidth - 160,

                                padding: 0,

                                marginLeft: 10,

                                fontSize  : MyStyle.FontSize.small,
                                fontFamily: MyStyle.FontFamily.Roboto.regular,
                                color     : MyColor.Material.BLACK,
                            }}
                            numberOfLines = {1}
                            placeholder = {MyLANG.SearchPlaceHolder}
                            placeholderTextColor = {MyColor.Material.GREY["800"]}
                            onChangeText = {props.onChangeText}
                            onSubmitEditing = {props.onSubmitEditing}
                            value = {props.value}
                        />
                        {
                            props.value?.length > 0 &&
                            <TouchableOpacity
                                activeOpacity = {0.7}
                                onPress = {props.onClearIcon}
                            >
                                <MyIcon.SimpleLineIcons
                                    name = "close"
                                    size = {17}
                                    color = {MyColor.Material.BLACK}
                                    style = {{paddingRight: 14, paddingVertical: 8, paddingLeft: 10}}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                }
            </LinearGradient>
        </Shadow>
    )
}

const HeaderGoogleMapSearch = (props: any) => {
    return (
        /*<Shadow style = {MyStyle.neomorphShadow.header}>*/
        <View style = {{
            position: "absolute",
            width   : MyStyle.screenWidth,
            height  : MyStyle.headerHeight,

            zIndex: 1000,

            flexDirection : "column",
            justifyContent: "flex-start",
        }}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
                style = {{
                    height: MyStyle.statusBarHeight,
                }}
            />
            <View
                style = {{
                    flex          : 1,
                    flexDirection : "row",
                    justifyContent: "space-between",
                    alignItems    : "center",

                    backgroundColor: MyColor.Material.TRANSPARENT,
                }}
            >
                <MyHeaderBackButton onPress = {props.onBack}/>

                <View style = {{flexDirection: "row"}}>
                    {/*<TouchableOpacity
                        style = {{
                            marginRight: 4,
                        }}
                        activeOpacity = {0.7}
                        onPress = {props.onSearch}
                    >
                        <MyIcon.AntDesign
                            name = "search1"
                            size = {24}
                            color = {MyColor.Material.BLACK}
                            style = {{paddingVertical: 7, paddingHorizontal: 8}}
                        />
                    </TouchableOpacity>*/}
                    <TouchableOpacity
                        style = {{
                            marginRight: 10,
                        }}
                        activeOpacity = {0.7}
                        onPress = {props.onMarker}
                    >
                        <MyIcon.MaterialCommunityIcons
                            name = "crosshairs-gps"
                            size = {24}
                            color = {MyColor.Material.BLACK}
                            style = {{paddingVertical: 7, paddingHorizontal: 8}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const TopTabBarGradientPrimary = (props: any) => {
    return (
        <View style = {{
            shadowColor  : "#000",
            shadowOffset : {
                width : 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius : 3.84,
            elevation    : 5,

            backgroundColor: "#ffffff",

            // paddingBottom: 0,
        }}>
            <LinearGradient
                {...MyStyle.LGHeaderPrimary}
            >
                {/*<MaterialTopTabBar {...props} />*/}
            </LinearGradient>
        </View>
    )
}


const MyHeaderBackButtonRound = (props: any) => {
    return (
        <TouchableOpacity
            style = {{
                marginLeft     : 10,
                backgroundColor: MyColor.Material.WHITE,
                borderRadius   : 100,

                shadowColor  : "#000",
                shadowOffset : {
                    width : 0,
                    height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius : 2.22,
                elevation    : 3,
            }}
            activeOpacity = {0.9}
            onPress = {props.onPress}
        >
            <MyIcon.Feather
                name = "arrow-left"
                size = {22}
                color = {MyColor.Material.BLACK}
                style = {{paddingVertical: 7, paddingHorizontal: 8}}
            />
        </TouchableOpacity>
    )
}

const MyHeaderBackButton = (props: any) => {
    return (
        MyStyle.platformOS === "ios" ?
        <TouchableOpacity
            style = {{
                marginLeft   : -3,
                paddingBottom: 2,
            }}
            activeOpacity = {0.9}
            onPress = {props.onPress}
        >
            <MyIcon.Feather
                name = "chevron-left"
                size = {35}
                color = {props.color || MyColor.Material.BLACK}
                style = {{paddingVertical: 2}}
            />
        </TouchableOpacity>
                                     :
        <MyMaterialRipple
            {...MyStyle.MaterialRipple.drawerRounded}
            style = {{
                marginLeft  : 6,
                marginBottom: 2,
                borderRadius: 100,
            }}
            onPress = {props.onPress}
        >
            <MyIcon.Feather
                name = "arrow-left"
                size = {23}
                color = {props.color || MyColor.Material.BLACK}
                style = {{paddingVertical: 8, paddingHorizontal: 8}}
            />
        </MyMaterialRipple>
    )
}


const Separator = () => {
    return (
        <View style = {styles.separator}/>
    )
}

const ActivityIndicatorLarge = (props: any) => {
    return (
        <ActivityIndicator
            size = "large"
            color = {MyColor.Primary.first}
            style = {[props?.style]}
        />
    )
}

const ListEmptyView = (props: any) => {
    return (
        <View style = {[listEmptyView.view, props.style.view]}>
            <FastImage
                source = {props.source}
                resizeMode = {FastImage.resizeMode.contain}
                style = {[listEmptyView.image, props.style.image]}
            />
            {props && props.message && <Text style = {[listEmptyView.message, props.style.text]}>{props.message}</Text>}
        </View>
    )
}

const ListEmptyViewLottie = (props: any) => {

    return (
        <View style = {[listEmptyView.view, props.style.view]}>
            <LottieView
                source = {props.source || MyImage.lottie_empty_lost}
                autoPlay = {props.autoPlay === false ? false : true}
                loop = {props.loop === false ? false : true}
                speed = {props.speed || 1.0}
                style = {[listEmptyView.lottieView, props.style.image]}
            />
            {props && props.message && <Text style = {[listEmptyView.message, props.style.text]}>{props.message}</Text>}
        </View>
    )
}

const IconStar = (props: any) => {
    return (
        <MyIcon.FontAwesome5
            name = {props?.name || 'star'}
            size = {props?.size || 14}
            color = {props?.color || MyColor.Material.YELLOW['700']}
            solid = {props?.solid || false}
            style = {props?.style}
        />
    )
}

const IconWithBadge = (props: any) => {
    return (
        <View>
            {getMyIcon(
                {
                    fontFamily: props.fontFamily,
                    name      : props.name,
                    color     : props.color,
                    size      : props.size,
                    style     : {}
                })
            }
            {12 > 0 && (
                <View
                    style = {{
                        position       : 'absolute',
                        right          : -10,
                        top            : -10,
                        backgroundColor: MyColor.Material.PINK["500"],
                        borderRadius   : 8,
                        width          : 15,
                        height         : 15,
                        justifyContent : 'center',
                        alignItems     : 'center',
                    }}
                >
                    <Text style = {{fontFamily: MyStyle.FontFamily.OpenSans.bold, fontSize: 9, color: MyColor.Material.WHITE, paddingRight: 1}}>
                        {12}
                    </Text>
                </View>
            )}
        </View>
    );

    /*function CartIconWithBadge(props) {
        // You should pass down the badgeCount in some other ways like React Context API, Redux, MobX or event emitters.
        return <IconWithBadge {...props} badgeCount = {3}/>;
    }*/
}

const ListHeaderViewAll = (props: any) => {
    return (
        <View style = {{
            marginHorizontal: MyStyle.marginHorizontalList,
            marginTop       : MyStyle.marginVerticalList,
            ...MyStyle.RowBetweenCenter
        }}>
            <Text style = {{
                ...MyStyleSheet.headerList,
            }}>
                {props.textLeft}
            </Text>
            {props.textRight &&
             <TouchableOpacity
                 activeOpacity = {0.8}
                 onPress = {props.onPress}
             >
                 <Text style = {MyStyleSheet.linkTextList}>
                     {props.textRight}
                 </Text>
             </TouchableOpacity>
            }
        </View>
    )
}

const ButtonPageFotter = (props: any) => {
    return (
        <Shadow style = {MyStyle.neomorphShadow.buttonBottom}>
            <View
                style = {{
                    flexDirection  : "row",
                    justifyContent : "space-between",
                    alignItems     : "center",
                    backgroundColor: MyColor.Material.WHITE,
                }}
            >
                <MyButton
                    shape = "square"
                    shadow = "none"
                    title = {props?.title || MyLANG.Submit}
                    onPress = {props?.onPress}
                />
            </View>
        </Shadow>
    )
}


export {
    getImage,

    StatusBarLight,
    StatusBarDark,

    StatusBarGradientPrimary,

    HeaderGradientPrimary,
    HeaderGradientPrimaryLogo,

    HeaderInputSearch,
    HeaderInputSearchOptionPage,
    HeaderGoogleMapSearch,

    TopTabBarGradientPrimary,

    MyHeaderBackButton,
    MyHeaderBackButtonRound,

    Separator,

    ActivityIndicatorLarge,

    ListEmptyView,
    ListEmptyViewLottie,

    IconStar,
    IconWithBadge,

    ListHeaderViewAll,
    ButtonPageFotter,
};

const styles = StyleSheet.create(
    {
        separator: {
            borderBottomColor: '#999',
            marginLeft       : 20,
            marginRight      : 20,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
    }
);

const listEmptyView = StyleSheet.create(
    {
        view      : {
            flex             : 1,
            justifyContent   : 'center',
            alignItems       : 'center',
            backgroundColor  : MyColor.Material.WHITISH,
            paddingVertical  : MyStyle.screenWidth * 0.12,
            paddingHorizontal: MyStyle.screenWidth * 0.12,

            paddingBottom: MyStyle.screenWidth * 0.33,
        },
        lottieView: {
            width: MyStyle.screenWidth * 0.7,
        },
        image     : {
            width : MyStyle.screenWidth * 0.6,
            height: MyStyle.screenWidth * 0.6,
        },
        message   : {
            fontFamily: MyStyle.FontFamily.OpenSans.light,
            fontSize  : 15,
            color     : MyColor.Material.GREY["900"],
            textAlign : 'center',
        },
    }
);
