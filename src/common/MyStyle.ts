import {Platform, Dimensions, StyleSheet, StatusBar} from 'react-native';
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";
import MyColor from "./MyColor";
import MyIcon from "../components/MyIcon";
import React from "react";
import {MyConstant} from "./MyConstant";

const screenHeight      = Dimensions.get('window').height;
const screenWidth       = Dimensions.get('window').width;
const screenAspectRatio = screenWidth / screenHeight;

const platformOS = Platform.OS;
const isIphoneX  = Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS && (screenHeight >= 812 || screenWidth >= 812);

const statusBarHeight = Platform.select(
    {
        ios    : isIphoneX ? 44 : 20,
        android: StatusBar.currentHeight,
        default: 0
    }
);
const headerHeight    = Platform.select(
    {
        ios    : isIphoneX ? 40 : 40,
        android: 80,
        default: 0
    }
);

const MyStyle: any = {

    platformOS: platformOS,

    screenHeight     : screenHeight,
    screenWidth      : screenWidth,
    screenAspectRatio: screenAspectRatio,

    statusBarHeight     : statusBarHeight,
    headerHeight        : headerHeight,
    headerHeightAdjusted: headerHeight - statusBarHeight,
    toolbarHeight       : isIphoneX ? 35 : 0,

    marginHorizontalLogin : 32,
    marginVerticalLogin   : 32,
    paddingHorizontalLogin: 32,
    paddingVerticalLogin  : 32,

    marginHorizontalPage : 24,
    marginVerticalPage   : 24,
    paddingHorizontalPage: 24,
    paddingVerticalPage  : 15,

    marginHorizontalList : 12,
    marginVerticalList   : 15,
    paddingHorizontalList: 12,
    paddingVerticalList  : 15,

    marginHorizontalModal     : 28,
    marginVerticalModal       : 28,
    paddingHorizontalModal    : 28,
    paddingVerticalModal      : 20,
    paddingHorizontalModalItem: 28,
    paddingVerticalModalItem  : 12,

    marginHorizontalTextsView: 10,

    marginViewGapCard      : 14,
    marginViewGapCardMedium: 18,

    marginButtonTop     : 20,
    marginButtonBottom  : 15,
    marginButtonVertical: 20,

    borderRadiusImageList     : 4,
    borderRadiusImageListLarge: 8,

    borderRadiusButtonSquare  : 0.1,
    borderRadiusButtonOutlined: 4,
    borderRadiusButtonRounded : 50,
    borderRadiusButtonCircular: 100,

    buttonHeightSmall : 32,
    buttonHeightNormal: 46,
    buttonHeightLarge : 56,

    fontFamilyPrice     : 'roboto_regular',
    fontFamilyPriceBold : 'roboto_bold',
    fontFamilyPriceLight: 'roboto_light',

    FontFamily: {
        OpenSans: {
            light         : 'open_sans_light',
            regular       : 'open_sans_regular',
            semiBold      : 'open_sans_semi_bold',
            semiBoldItalic: 'open_sans_semi_bold_italic',
            bold          : 'open_sans_bold',
            extraBold     : 'open_sans_extra_bold',
        },
        Roboto  : {
            thin   : 'roboto_thin',
            light  : 'roboto_light',
            regular: 'roboto_regular',
            medium : 'roboto_medium',
            bold   : 'roboto_bold',
            black  : 'roboto_black',
        },
        /*Exo2    : {
            thin      : 'exo2_thin',
            light     : 'exo2_light',
            extraLight: 'exo2_extra_light',
            regular   : 'exo2_regular',
            medium    : 'exo2_medium',
            semiBold  : 'exo2_semi_bold',
            bold      : 'exo2_bold',
            extraBold : 'exo2_extra_bold',
            black     : 'exo2_black',
        },*/
    },

    FontSize: {
        tiny       : 12,
        small      : 14,
        medium     : 16,
        big        : 18,
        large      : 20,
        input      : 17,
        placeHolder: 15,
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

    LGButtonPrimaryMyButton: {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.PrimaryGradient.thrid,
    },
    LGButtonPrimary        : {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.PrimaryGradient.thrid,
    },
    LGButtonFacebook       : {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.Gradient.facebook,
    },
    LGButtonGoogle         : {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.Gradient.google,
    },

    LGWhite  : {
        start    : {x: 0, y: 0},
        end      : {x: 1, y: 1},
        locations: [0.1, 0.5, 1],
        colors   : MyColor.Gradient.white,
    },
    LGWhitish: {
        start    : {x: 0, y: 0},
        end      : {x: 1, y: 1},
        locations: [0.1, 0.5, 1],
        colors   : MyColor.Gradient.whitish,
    },
    LGBlue   : {
        start    : {x: 0, y: 0},
        end      : {x: 1, y: 1},
        locations: [0.1, 0.5, 1],
        colors   : MyColor.Gradient.blueish,
    },

    LGDrawerItem      : {
        start    : {x: 0, y: 0},
        end      : {x: 1, y: 1},
        locations: [0.1, 0.5, 1],
        colors   : MyColor.Gradient.white,
    },
    LGDrawerItemActive: {
        start    : {x: 0.0, y: 0.0},
        end      : {x: 1.0, y: 1.0},
        locations: [0.0, 1.0],
        colors   : MyColor.Gradient.whitish2,
    },

    MaterialRipple: {
        default     : {
            rippleSize                 : 400,
            rippleDuration             : 1000,
            rippleContainerBorderRadius: 0,
            rippleCentered             : false,
        },
        drawer      : {
            rippleSize                 : 400,
            rippleDuration             : 1000,
            rippleContainerBorderRadius: 0,
            rippleCentered             : false,
        },
        headerButton: {
            rippleSize                 : 400,
            rippleDuration             : 1000,
            rippleContainerBorderRadius: 0,
            rippleCentered             : false,
        },
    },

    iconStar: {
        fontFamily: MyConstant.VectorIcon.FontAwesome5,
        name      : "star",
        size      : 12,
        color     : MyColor.Material.YELLOW['600'],
    },

    Column            : {},
    ColumnStart       : {
        justifyContent: "flex-start",
    },
    ColumnCenterStart : {
        justifyContent: "center",
        alignItems    : "flex-start",
    },
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
                    top: 0,
                },
                android: {
                    top: 0,
                },
            }),
    },
    RowStart          : {
        flexDirection : "row",
        justifyContent: "flex-start",
    },
    RowStartCenter    : {
        flexDirection : "row",
        justifyContent: "flex-start",
        alignItems    : "center",
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
    RowBetweenCenter  : {
        flexDirection : "row",
        justifyContent: "space-between",
        alignItems    : "center",
    },

    logo: {
        width     : Platform.OS === "ios" ? 180 : 200,
        height    : Platform.OS === "ios" ? 30 : 30,
        resizeMode: "contain",
        ...Platform.select(
            {
                ios    : {
                    marginTop: -15,
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
        TOP   : 80 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
        BOTTOM: -80 - (Platform.OS === 'ios' ? getBottomSpace() : 0),
        CENTER: 0,

        White: {
            containerStyle: {
                backgroundColor  : "rgba(255,255,255,0.99)",
                paddingHorizontal: 15,
                paddingVertical  : 10,
                borderRadius     : 10,
            },
            textColor     : "#000000",
            textStyle     : {
                fontFamily: 'open_sans_regular',
                fontSize  : 13
            },
        },

        Black: {
            containerStyle: {
                backgroundColor  : "rgba(0,0,0,0.65)",
                paddingHorizontal: 15,
                paddingVertical  : 10,
                borderRadius     : 10
            },
            textColor     : "#FFFFFF",
            textStyle     : {
                fontFamily: 'open_sans_regular',
                fontSize  : 13
            },
        },

        imageStyleSucess: {
            width : 30,
            height: 30
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
                    height: 25,
                },
                android: {
                    height    : 46,
                    paddingTop: 0,
                    marginTop : 0,
                    elevation : 0,
                },
            }),
    }),

    headerStyleNoShadow: {
        height       : 80,
        elevation    : 0,
        shadowOpacity: 0,
        shadowRadius : 0,
    },

    IGNORED_TAGS:
        ['head', 'scripts', 'audio', 'video', 'track', 'embed', 'object', 'param', 'source', 'canvas', 'noscript',
         'caption', 'col', 'colgroup', 'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup',
         'option', 'output', 'progress', 'select', 'textarea', 'details', 'diaglog', 'menu', 'menuitem', 'summary', 'tfoot', 'th', 'thead'
        ],
    textHTMLBody: {
        p    : {
            fontFamily: 'open_sans_regular',
            fontSize  : 14,
            color     : MyColor.Material.GREY["700"],
            textAlign : "justify",
            lineHeight: 18,
        },
        table: {
            flex          : 1,
            flexDirection : 'row',
            alignItems    : 'center',
            justifyContent: 'center',

            marginVertical: 10,

            // borderLeftWidth : 1,
            // borderTopWidth  : 1,
            // borderColor     : '#ccc',
            // borderRightWidth: 0.5,
        },
        tbody: {},
        tr   : {
            flex         : 1,
            flexDirection: 'row',
            // borderBottomWidth: 1,
            // borderBottomColor: '#ccc'
        },
        td   : {
            justifyContent : 'flex-start',
            alignItems     : 'flex-start',
            width          : '50%',
            // paddingHorizontal: 12,
            paddingVertical: 5,
            // borderRightWidth : 0.5,
            // borderRightColor : '#ccc',
        },
    },
}

const MyStyleCommon: any = {
    StackOptions      : {
        LoginStack    : {
            // headerShown: false,
            headerTransparent: true,
            headerStyle      : {
                height: MyStyle.headerHeight,
            },
            headerTintColor  : MyColor.Material.BLACK,
            headerTitleStyle : {
                color     : MyColor.Material.WHITE,
                fontSize  : 18,
                fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            },
        },
        BottomTabStack: {
            // headerShown: false,
            headerTransparent        : true,
            headerStyle              : {
                height: MyStyle.headerHeight,
            },
            headerTintColor          : MyColor.Material.WHITE,
            headerTitleContainerStyle: {
                right: MyStyle.marginHorizontalPage,
            },
            headerTitleStyle         : {
                color     : MyColor.Material.WHITE,
                fontSize  : 18,
                fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            },
            // headerTitleAlign : "center",
        },
    },
    StackScreenOptions: {
        SplashStack: {
            headerShown: false
        },
        IntroStack : {
            headerShown: false
        },
        LoginStack : {},
        TopTabStack: {
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
            // headerTintColor : MyColor.Material.WHITE,
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
        layoutView1: {},
        layoutView2: {},
        layoutView3: {},

        //
        SafeAreaView1: {
            flex           : 0,
            backgroundColor: MyColor.Material.RED["500"],
        },

        SafeAreaView2: {
            flex           : 1,
            backgroundColor: MyColor.Material.GREY["500"],
        },

        SafeAreaView3: {
            flex      : 1,
            paddingTop: MyStyle.statusBarHeight,
        },

        viewPageLogin: {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-start",

            paddingHorizontal: MyStyle.paddingHorizontalLogin,
            paddingVertical  : MyStyle.paddingVerticalLogin,
        },
        viewPageMain : {
            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-start",

            paddingHorizontal: MyStyle.paddingHorizontalPage,
            paddingVertical  : MyStyle.paddingVerticalPage,
        },

        viewPageCard: {
            display      : "flex",
            flexDirection: "column",

            paddingHorizontal: MyStyle.paddingHorizontalPage,
            paddingVertical  : MyStyle.paddingVerticalPage,

            marginBottom: MyStyle.marginViewGapCard,

            backgroundColor: MyColor.Material.WHITE,
        },

        mainView: {
            marginTop: MyStyle.headerHeightAdjusted,

            flex: 1,

            display       : "flex",
            flexDirection : "column",
            justifyContent: "flex-start",
        },


        linkTextList: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.attentionDark,
        },

        headerList      : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 16,
            color     : MyColor.Material.BLACK,

            textTransform: "capitalize",
        },
        headerPage      : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 18,
            color     : MyColor.textDarkPrimary,

            textTransform: "capitalize",
        },
        headerPageMedium: {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 20,
            color     : MyColor.textDarkPrimary,

            textTransform: "capitalize",
        },
        headerPageLarge : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 44,
            color     : MyColor.textDarkPrimary,

            textTransform: "capitalize",
        },

        subHeaderPage: {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 14,
            color     : MyColor.textDarkSecondary2,
        },

        textPageTitle        : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 18,
            color     : MyColor.textDarkPrimary,
        },
        textPageTitleLarge   : {
            fontFamily: MyStyle.FontFamily.OpenSans.bold,
            fontSize  : 20,
            color     : MyColor.textDarkPrimary,
        },
        textPageInfo         : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 15,
            color     : MyColor.textDarkPrimary,
        },
        textPageInfoSecondary: {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 14,
            color     : MyColor.Material.GREY["700"],
            textAlign : "justify",
        },

        textListTitle: {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 30,
            color     : "#f0f0f0",
        },

        textListItemTitleAlt    : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 15,
            color     : MyColor.textDarkPrimary
        },
        textListItemTitle       : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 15,
            color     : MyColor.Material.GREY["600"]
        },
        textListItemTitleDark   : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 15,
            color     : MyColor.textDarkPrimary
        },
        textListItemSubTitleAlt    : {
            fontFamily: MyStyle.FontFamily.OpenSans.regular,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary
        },
        textListItemSubTitle    : {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary
        },
        textListItemSubTitleDark: {
            fontFamily: MyStyle.FontFamily.Roboto.regular,
            fontSize  : 13,
            color     : MyColor.textDarkSecondary
        },

        textPricePage          : {
            fontFamily: MyStyle.fontFamilyPriceBold,
            fontSize  : 22,
            color     : MyColor.Primary.first,
        },
        textPriceDiscountedPage: {
            fontFamily        : MyStyle.fontFamilyPrice,
            fontSize          : 14,
            color             : MyColor.textDarkSecondary2,
            textDecorationLine: "line-through",
        },

        textAlert: {
            fontFamily: MyStyle.FontFamily.OpenSans.semiBold,
            fontSize  : 30,
            color     : "#f0f0f0",
        },

        MRButtonProductPage          : {
            marginVertical  : 5,
            marginHorizontal: 5,

            borderRadius: 3,
        },
        textButtonProductPage        : {
            fontFamily     : MyStyle.FontFamily.Roboto.regular,
            fontSize       : 14,
            color          : MyColor.textDarkPrimary,
            backgroundColor: MyColor.Material.WHITE,

            paddingHorizontal: 10,
            paddingVertical  : 6,

            borderRadius: 3,

            // borderWidth: 1,
            // borderColor: MyColor.textDarkSecondary,
        },
        textButtonProductPageSelected: {
            fontFamily     : MyStyle.FontFamily.Roboto.regular,
            fontSize       : 14,
            color          : MyColor.Material.WHITE,
            backgroundColor: MyColor.Primary.first,

            paddingHorizontal: 10,
            paddingVertical  : 6,

            borderRadius: 3,
        },


        imageListExtraSmall: {
            width          : MyStyle.screenWidth * 0.11,
            height         : MyStyle.screenWidth * 0.11,
            borderRadius   : 3,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        imageListSmall     : {
            width          : MyStyle.screenWidth * 0.16,
            height         : MyStyle.screenWidth * 0.16,
            borderRadius   : 3,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        imageList          : {
            width          : MyStyle.screenWidth * 0.22,
            height         : MyStyle.screenWidth * 0.22,
            borderRadius   : 3,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        imageListMedium    : {
            width          : MyStyle.screenWidth * 0.25,
            height         : MyStyle.screenWidth * 0.25,
            borderRadius   : 4,
            backgroundColor: MyColor.Material.GREY["100"],
        },
        imageListLarge     : {
            width          : MyStyle.screenWidth * 0.35,
            height         : MyStyle.screenWidth * 0.35,
            borderRadius   : 4,
            backgroundColor: MyColor.Material.GREY["100"],
        },

        imagePageCard: {
            width          : MyStyle.screenWidth * 0.35,
            height         : MyStyle.screenWidth * 0.35,
            borderRadius   : 600,
            backgroundColor: MyColor.Material.GREY["100"],
        },

        imageBackground: {
            width          : MyStyle.screenWidth,
            height         : MyStyle.screenWidth / 2,
            backgroundColor: MyColor.Material.GREY["100"],
        },


    })

export {MyStyle, MyStyleCommon, MyStyleSheet};
