import React from 'react';

import {ActivityIndicator, Image, StatusBar, StyleSheet, Text, View} from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import LottieView from 'lottie-react-native';

import {MyStyle} from "../common/MyStyle";
import MyColor from "../common/MyColor";
import {MyConstant} from "../common/MyConstant";
import MyIcon from "./MyIcon";
import MyImage from "../shared/MyImage";

const getMyIcon = (props: any) => {
    switch (props.fontFamily) {
        case MyConstant.VectorIcon.AntDesign:
            return (<MyIcon.AntDesign {...props}/>);
        case MyConstant.VectorIcon.Entypo:
            return (<MyIcon.Entypo {...props}/>);
        case MyConstant.VectorIcon.EvilIcons:
            return (<MyIcon.EvilIcons {...props}/>);
        case MyConstant.VectorIcon.Feather:
            return (<MyIcon.Feather {...props}/>);
        case MyConstant.VectorIcon.FontAwesome:
            return (<MyIcon.FontAwesome {...props}/>);
        case MyConstant.VectorIcon.FontAwesome5:
            return (<MyIcon.FontAwesome5 {...props}/>);
        case MyConstant.VectorIcon.Fontisto:
            return (<MyIcon.Fontisto {...props}/>);
        case MyConstant.VectorIcon.Foundation:
            return (<MyIcon.Foundation {...props}/>);
        case MyConstant.VectorIcon.Ionicons:
            return (<MyIcon.Ionicons {...props}/>);
        case MyConstant.VectorIcon.MaterialIcons:
            return (<MyIcon.MaterialIcons {...props}/>);
        case MyConstant.VectorIcon.MaterialCommunityIcons:
            return (<MyIcon.MaterialCommunityIcons {...props}/>);
        case MyConstant.VectorIcon.Octicons:
            return (<MyIcon.Octicons {...props}/>);
        case MyConstant.VectorIcon.Zocial:
            return (<MyIcon.Zocial {...props}/>);
        case MyConstant.VectorIcon.SimpleLineIcons:
            return (<MyIcon.SimpleLineIcons {...props}/>);
        default:
            return (<MyIcon.FontAwesome {...props}/>);
    }
}

const getImage = (props: any) => {
    return (<Image {...props}/>)
}

const StatusBarLight = () => {
    return (
        <StatusBar animated = {true}
                   backgroundColor = "transparent"
                   barStyle = "light-content"
                   translucent = {true}/>
    )
}

const StatusBarDark = () => {
    return (
        <StatusBar animated = {true}
                   backgroundColor = "transparent"
                   barStyle = "dark-content"
                   translucent = {true}/>
    )
}

const StatusBarGradientPrimary = (props: any) => {
    return (
        <LinearGradient
            start = {MyStyle.LGHeaderPrimary.start}
            end = {MyStyle.LGHeaderPrimary.end}
            locations = {MyStyle.LGHeaderPrimary.locations}
            colors = {MyStyle.LGHeaderPrimary.colors}
            style = {{
                flex      : 1,
                height    : MyStyle.StatusBarHeight,
                paddingTop: MyStyle.StatusBarHeight,
            }}
        />
    )
}

const HeaderGradientPrimary = (props: any) => {
    return (
        <LinearGradient
            start = {MyStyle.LGHeaderPrimary.start}
            end = {MyStyle.LGHeaderPrimary.end}
            locations = {MyStyle.LGHeaderPrimary.locations}
            colors = {MyStyle.LGHeaderPrimary.colors}
            style = {{
                flex: 1,

                backgroundColor: "#000000",
                shadowColor    : "#000000",
                shadowOffset   : {
                    width : 0,
                    height: 2,
                },
                shadowOpacity  : 0.25,
                shadowRadius   : 3.84,
                elevation      : 5,
            }}
        >
        </LinearGradient>
    )
}

const HeaderGradientPrimaryLogo = (props: any) => {
    return (
        <LinearGradient
            start = {MyStyle.LGHeaderPrimary.start}
            end = {MyStyle.LGHeaderPrimary.end}
            locations = {MyStyle.LGHeaderPrimary.locations}
            colors = {MyStyle.LGHeaderPrimary.colors}
            style = {{
                flex: 1,

                backgroundColor: "#000000",
                shadowColor    : "#000000",
                shadowOffset   : {
                    width : 0,
                    height: 2,
                },
                shadowOpacity  : 0.25,
                shadowRadius   : 3.84,
                elevation      : 5,

                display       : 'flex',
                flexDirection : 'column',
                justifyContent: 'flex-end',
                alignItems    : 'center',
            }}
        >
            <Image
                source = {MyImage.logoWhite}
                style = {{
                    height      : MyStyle.HeaderHeight / 2,
                    width       : MyStyle.screenWidth * 0.3,
                    marginBottom: 6,
                }}
                resizeMode = "contain"
            />
        </LinearGradient>
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
                start = {MyStyle.LGHeaderPrimary.start}
                end = {MyStyle.LGHeaderPrimary.end}
                locations = {MyStyle.LGHeaderPrimary.locations}
                colors = {MyStyle.LGHeaderPrimary.colors}
            >
                {/*<MaterialTopTabBar {...props} />*/}
            </LinearGradient>
        </View>
    )
}

const Separator = () => {
    return (
        <View style = {styles.separator}/>
    )
}

const ActivityIndicatorLarge = () => {
    return (
        <ActivityIndicator size = "large"
                           color = {MyColor.Primary.first}/>
    )
}

const ListEmptyView = (props: any) => {
    return (
        <View style = {[listEmptyView.view, props.style.view]}>
            <FastImage source = {props.source}
                       resizeMode = {FastImage.resizeMode.contain}
                       style = {[listEmptyView.image, props.style.image]}/>
            {props && props.message && <Text style = {[listEmptyView.message, props.style.text]}>{props.message}</Text>}
        </View>
    )
}

const ListEmptyViewLottie = (props: any) => {
    return (
        <View style = {[listEmptyView.view, props.style.view]}>
            <LottieView source = {props.source}
                        autoPlay
                        loop
                        style = {[listEmptyView.lottieView, props.style.image]}
            />
            {props && props.message && <Text style = {[listEmptyView.message, props.style.text]}>{props.message}</Text>}
        </View>
    )
}


export {
    getMyIcon,
    getImage,
    StatusBarLight,
    StatusBarDark,
    StatusBarGradientPrimary,
    HeaderGradientPrimary,
    HeaderGradientPrimaryLogo,
    TopTabBarGradientPrimary,
    Separator,
    ActivityIndicatorLarge,
    ListEmptyView,
    ListEmptyViewLottie,
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
            backgroundColor  : MyColor.whitish,
            paddingVertical  : MyStyle.screenWidth * 0.12,
            paddingHorizontal: MyStyle.screenWidth * 0.12,
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
