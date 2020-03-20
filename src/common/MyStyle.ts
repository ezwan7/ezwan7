import {Platform, Dimensions, StyleSheet, StatusBar} from 'react-native';
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";

import {MyConfig} from "../shared/MyConfig";
import MyColor from "./MyColor";


const screenHeight = Dimensions.get('window').height;
const screenWidth  = Dimensions.get('window').width;

const isIphoneX = Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS && (screenHeight >= 812 || screenWidth >= 812);

const StatusBarHeight = Platform.select(
    {
        ios    : isIphoneX ? 44 : 20,
        android: StatusBar.currentHeight,
        default: 0
    }
)
const HeaderHeight    = Platform.select(
    {
        ios    : isIphoneX ? 40 : 40,
        android: 80,
        default: 0
    }
)

const MyStyle: any = {
    height      : Platform.OS !== 'ios' ? screenHeight : screenWidth - 20,
    screenHeight: screenHeight,
    screenWidth : screenWidth,

    StatusBarHeight: StatusBarHeight,
    HeaderHeight   : HeaderHeight,
    // @ts-ignore
    navBarHeight   : Platform !== 'ios' ? screenHeight - screenWidth : 0,

    ToolbarHeight: isIphoneX ? 35 : 0,

    FontSize: {
        tiny  : 12,
        small : 14,
        medium: 16,
        big   : 18,
        large : 20,
    },

    FontFamily: {
        OpenSans    : {
            light         : 'open_sans_light',
            regular       : 'open_sans_regular',
            semiBold      : 'open_sans_semi_bold',
            semiBoldItalic: 'open_sans_semi_bold_italic',
            bold          : 'open_sans_bold',
            extraBold     : 'open_sans_extra_bold',
        },
        Roboto      : {
            thin   : 'roboto_thin',
            light  : 'roboto_light',
            regular: 'roboto_regular',
            medium : 'roboto_medium',
            bold   : 'roboto_bold',
            black  : 'roboto_black',
        },
        Exo2        : {
            thin      : 'exo2_thin',
            light     : 'exo2_light',
            extraLight: 'exo2_extra_light',
            regular   : 'exo2_regular',
            medium    : 'exo2_medium',
            semiBold  : 'exo2_semi_bold',
            bold      : 'exo2_bold',
            extraBold : 'exo2_extra_bold',
            black     : 'exo2_black',
        },
        TitilliumWeb: {
            light     : 'titillium_web_light',
            extraLight: 'titillium_web_extra_light',
            regular   : 'titillium_web_regular',
            semiBold  : 'titillium_web_semi_bold',
            bold      : 'titillium_web_bold',
            black     : 'titillium_web_black',
        },
    },

    IconSize: {
        TextInput  : 25,
        ToolBar    : 18,
        Inline     : 20,
        SmallRating: 14,
    },

    LGHeaderPrimary: {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 0.0},
        locations: [0.0, 1.0],
        colors   : MyColor.PrimaryGradient.second,
    },

    LGButtonPrimary: {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.PrimaryGradient.thrid,
    },

    LGButtonPrimary2: {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.PrimaryGradient.thrid,
    },

    LGWhite: {
        start    : {x: 0, y: 0},
        end      : {x: 1, y: 1},
        locations: [0.1, 0.5, 1],
        colors   : MyColor.Gradient.whitish,
    },

    Column            : {},
    ColumnCenter      : {
        justifyContent: "center",
        alignItems    : "center",
    },
    ColumnCenterTop   : {
        alignItems: "center",
    },
    ColumnCenterBottom: {
        justifyContent: "flex-end",
        alignItems    : "center",
    },
    ColumnCenterLeft  : {
        justifyContent: "center",
        alignItems    : "flex-start",
    },
    ColumnCenterRight : {
        justifyContent: "center",
        alignItems    : "flex-end",
    },
    Row               : {
        flexDirection: "row",

        ...Platform.select(
            {
                ios    : {
                    top: !MyConfig.showStatusBar
                         ? isIphoneX
                           ? -20
                           : -8
                         : isIphoneX
                           ? -15
                           : 0,
                },
                android: {
                    top: 0,
                },
            }),
    },
    RowCenter         : {
        flexDirection : "row",
        alignItems    : "center",
        justifyContent: "center",
    },
    RowCenterTop      : {
        flexDirection : "row",
        justifyContent: "center",
    },
    RowCenterBottom   : {
        flexDirection : "row",
        alignItems    : "flex-end",
        justifyContent: "center",
    },
    RowCenterLeft     : {
        flexDirection: "row",
        alignItems   : "center",
    },
    RowCenterRight    : {
        flexDirection : "row",
        alignItems    : "center",
        justifyContent: "flex-end",
    },
    RowCenterBetween  : {
        flexDirection : "row",
        alignItems    : "center",
        justifyContent: "space-between",
    },

    logo: {
        width     : Platform.OS === "ios" ? 180 : 200,
        height    : Platform.OS === "ios" ? 30 : 30,
        resizeMode: "contain",
        ...Platform.select(
            {
                ios    : {
                    marginTop: isIphoneX ? -40 : MyConfig.showStatusBar ? -4 : -15,
                },
                android: {
                    marginTop : 2,
                    marginLeft: 30,
                },
            }),
    },

    ActionSheetAlert: {
        positiveBackgroundColor: '#314DB0',
        positiveTextColor      : '#F9F9F9',
        negativeBackgroundColor: '#F9447C',
        negativeTextColor      : '#F9F9F9',
    },

    TinyToast: {
        TOP   : 40 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
        BOTTOM: -40 - (Platform.OS === 'ios' ? getBottomSpace() : 0),
        CENTER: 0,

        containerStyleWhite: {
            backgroundColor  : "rgba(255,255,255,0.90)",
            paddingHorizontal: 15,
            borderRadius     : 20
        },
        containerStyleDark : {
            backgroundColor  : "rgba(0,0,0,0.90)",
            paddingHorizontal: 15,
            paddingVertical  : 10,
            borderRadius     : 4
        },

        imageStyleSucess: {
            width : 30,
            height: 30
        },

        textColorWhite: "#FFFFFF",
        textColorDark : "#000000",

        textStyleWhite: {
            fontSize: 14
        },
    },

    toolbar: (backgroundColor: any, isDark: any) => ({
        backgroundColor  : isDark ? backgroundColor : "#fff",
        zIndex           : 1,
        // paddingLeft: 15,
        // paddingRight: 15,
        paddingTop       : 4,
        borderBottomWidth: isDark ? 0 : 1,
        borderBottomColor: "transparent",

        ...Platform.select(
            {
                ios    : {
                    height: MyConfig.showStatusBar
                            ? isIphoneX
                              ? 5
                              : 40
                            : isIphoneX
                              ? 5
                              : 25,
                },
                android: {
                    height    : 46,
                    paddingTop: 0,
                    marginTop : 0,
                    elevation : 0,
                },
            }),
    }),


    headerStyle: {
        // color   : MyColor.category.navigationTitleColor,
        // fontSize: 16,
        // textAlign: "left",
        // alignSelf      : "center",
        // flex           : 1,
        height: 80,
        // backgroundColor: "green",
        // fontFamily: MyConfig.fontHeader,

        /*...Platform.select(
            {
                ios    : {
                    marginBottom: !MyConfig.showStatusBar ? 14 : 0,
                    marginTop   : isIphoneX ? -10 : 12,
                },
                android: {
                    // marginBottom: 4,
                    // elevation   : 0,
                },
            }),*/
    },

    headerStyleNoShadow: {
        height       : 80,
        elevation    : 0,
        shadowOpacity: 0,
        shadowRadius : 0,
    },

    headerTitleStyle: {
        // color     : MyConfig.Theme.isDark ? MyTheme.dark.colors.text : MyTheme.dark.colors.text,
        fontSize  : 16,
        // height    : 40,
        // textAlign : "center",
        fontFamily: 'OpenSans-Semibold',
        // alignSelf : "center",

        /*...Platform.select(
            {
                ios    : {
                    marginBottom: !MyConfig.showStatusBar ? 14 : 0,
                    marginTop   : isIphoneX ? -10 : 12,
                },
                android: {
                    // marginTop: 25,
                },
            }),*/
    },
}

const MyStyleCommon = {
    screenOptions: {
        IntroStack    : {
            headerShown: false
        },
        LoginStack    : {
            headerTitleStyle : MyStyle.headerTitleStyle,
            headerStyle      : MyStyle.headerStyle,
            headerTintColor  : MyColor.black,
            headerTransparent: true
        },
        BottomTabStack: {
            headerTitleStyle : MyStyle.headerTitleStyle,
            headerStyle      : MyStyle.headerStyle,
            headerTintColor  : MyColor.black,
            headerTransparent: true
        },
        DrawerStack   : {
            headerTitleStyle : MyStyle.headerTitleStyle,
            headerStyle      : MyStyle.headerStyle,
            headerTintColor  : MyColor.black,
            headerTransparent: true
        },
        TopTabStack   : {
            headerStyle     : {
                // height: 64,

                // backgroundColor: MyColor.Primary.first,

                elevation    : 0,
                shadowOpacity: 0,
                shadowRadius : 0,
            },
            headerTitleStyle: {
                color     : MyColor.Material.WHITE,
                fontSize  : 18,
                fontFamily: MyStyle.FontFamily.OpenSans.semiBold,

                /*...Platform.select(
                    {
                        ios    : {
                            marginBottom: !MyConfig.showStatusBar ? 14 : 0,
                            marginTop   : isIphoneX ? -10 : 12,
                        },
                        android: {
                            // marginTop: 25,
                        },
                    }),*/
            },
            // headerTintColor : MyColor.white,
        },
    },

    TopTabBarOptions: {
        activeTintColor  : MyColor.Material.WHITE,
        inactiveTintColor: MyColor.Material.GREY["25"],
        indicatorStyle   : {
            backgroundColor: MyColor.Material.WHITE
        },
        tabStyle         : {
            width            : 'auto',
            minHeight        : 30,
            paddingHorizontal: 16,
            paddingVertical  : 8,
        },
        labelStyle       : {
            fontSize: 12,
        },
        style            : {
            backgroundColor: 'transparent',
        },
        upperCaseLabel   : true,
        scrollEnabled    : true,
    },
}

const MyStyleSheet = StyleSheet.create(
    {
        layoutView1: {
            marginTop: 68
        },
        layoutView2: {
            minHeight : screenHeight - 68,
            paddingTop: 0
        },
        layoutView3: {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-start",
            // flex          : 1,
        },


        SafeAreaView1: {
            flex           : 0,
            backgroundColor: MyColor.Material.RED["500"],
        },

        SafeAreaView2: {
            flex           : 1,
            backgroundColor: MyColor.Material.GREY["500"],
        },

        SafeAreaView3: {
            flex           : 1,
            backgroundColor: MyColor.Material.WHITE,
        },


        pageBigTitle: {
            fontFamily: "Lato-Bold",
            fontSize  : 30,
            color     : "#f0f0f0",
            textAlign : "center",
        },
    })

export {MyStyle, MyStyleCommon, MyStyleSheet};
