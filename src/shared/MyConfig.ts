import {Dimensions} from "react-native";
import {Platform} from "react-native";
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper'
import MyImage from "../shared/MyImage";
import {MyConstant} from "../common/MyConstant";
import MyLANG from "./MyLANG";

const primaryColor    = {
    first : '#0e018d',
    second: '#1301d8',
    thrid : '#1401eb',
    fourth: 'rgba(242,96,12,0.70)',
};
const primaryGradient = {
    first : ['#0e018d', '#1301d8'],
    second: ['#0e018d', '#1301e1'],
    thrid : ['#F2600C', '#f28a14'],
};

const MyConfig = {

    app_name         : 'DirectD',
    app_version      : '0.0.1',
    app_build_version: 1,
    app_platform     : 'Android',

    app_email    : 'directd@gmail.com',
    app_phone    : '01888065565',
    app_copyright: 'directd',

    android_package_name: 'com.directd',
    ios_app_id          : 'id1111111',

    google_map_api_key: 'AIzaSyB9iP58dJwjx7BcZA7kRnhIqKn9L3hVoZ0',

    // apiUrl : 'http://192.168.0.101:8500/',
    apiUrl   : 'https://smddeveloper.com/directd_merge/public/api/',
    serverUrl: 'https://smddeveloper.com/directd_merge/',

    api_version: '',
    api_auth   : 'auth/',

    routeName: {
        Splash            : 'Splash',
        Intro             : 'Intro',
        IntroStack        : 'IntroStack',
        LoginStack        : 'LoginStack',
        Login             : 'Login',
        Signup            : 'Signup',
        HomeNavigator     : 'HomeNavigator',
        Tab1              : 'Tab1',
        Tab2              : 'Tab2',
        Tab3              : 'Tab3',
        Tab4              : 'Tab4',
        Tab5              : 'Tab5',
        BottomTabNavigator: 'BottomTabNavigator',
        DrawerNavigator   : 'DrawerNavigator',
        DrawerHome        : 'DrawerHome',
        DrawerNotification: 'DrawerNotification',

        CategoryList: 'CategoryList',
        ProductList : 'ProductList',
        Search      : 'Search',
        Cart        : 'Cart',
        Settings    : 'Settings',

        MaterialTopTab  : 'MaterialTopTab',
        Home            : 'Home',
        GoogleMap       : 'GoogleMap',
        Restaurants     : 'Restaurants',
        Notification    : 'Notification',
        NotificationView: 'NotificationView',
    },

    primaryColor   : primaryColor,
    primaryGradient: primaryGradient,

    // Default theme loading, this could able to change from the user profile (reserve feature)
    Theme: {
        isDark: false,
    },

    SplashScreen: {
        Duration: 0,
    },

    printConsole    : true,
    loginRequired   : false,
    showStatusBar   : true,
    TimePeriodToExit: 2000,

    Language: "en", // ar, en. Default to set redux. Only use first time

    AsyncStorage: {
        AUTH_TOEKN: 'token',

        FIREBASE_TOEKN: 'FIREBASE_TOEKN',

        APP_FRESH_INSTALL: 'APP_FRESH_INSTALL',
    },

    UserRole: {
        admin      : 2,
        deliveryMan: 5,
        customer   : 6,
        restaurant : 7,
    },

    RestaurantCategory: {
        Restaurant: 1,
        Sweet     : 2,
        Cake      : 3,
        Homemade  : 4,
        Catering  : 5,
    },

    ListLimit     : {
        categoryList          : 50,
        productList           : 16,
        productListHorizontal : 16,
        productListHorizontal2: 16,
        RestaurantHome        : 10,
    },
    LimitAddToCart: 10,

    LanguageActive: 1,


    Currency: {
        MYR: {
            symbol     : "RM",
            name       : "Malaysian Ringgit",
            code       : "MYR",
            name_plural: "MYR",
            name_short : "RM",
            decimal    : ".",
            thousand   : ",",
            precision  : 2,
            format     : "%s%v", // %s is the symbol and %v is the value
        },
        BDT: {
            symbol     : "৳",
            name       : "Bangladeshi Taka",
            code       : "BDT",
            name_plural: "Taka",
            name_short : "Tk.",
            decimal    : ".",
            thousand   : ",",
            precision  : 2,
            format     : "%s%v", // %s is the symbol and %v is the value
        },
        USD: {
            symbol     : "$",
            name       : "US Dollar",
            code       : "USD",
            name_plural: "US dollars",
            name_short : "US dollars",
            decimal    : ".",
            thousand   : ",",
            precision  : 2,
            format     : "%s%v", // %s is the symbol and %v is the value
        },
    },

    DefaultCurrency: {
        symbol     : "$",
        name       : "US Dollar",
        code       : "USD",
        name_plural: "US dollars",
        name_short : "US dollars",
        decimal    : ".",
        thousand   : ",",
        precision  : 2,
        format     : "%s%v", // %s is the symbol and %v is the value
    },

    DefaultCountry: {
        code           : "en",
        RTL            : false,
        language       : "English",
        countryCode    : "US",
        hideCountryList: false, // when this option is try we will hide the country list from the checkout page, default
                                // select by the above 'countryCode'
    },

    DefatulImagePickerOptions: {
        title         : MyLANG.SelectImage,
        // customButtons : [{name: 'fb', title: 'Choose Photo from Facebook'}],
        storageOptions: {
            skipBackup: true,
            path      : 'images',
        },
        tintColor     : '#ffffff',
        cameraType    : 'front', // 'front' or 'back'
        mediaType     : 'photo', // 'photo', 'video', or 'mixed'
        maxWidth      : 500,
        maxHeight     : 500,
        rotation      : 0,
        quality       : 0.7,
        videoQuality  : 'high', // 'low', 'medium', or 'high' on iOS, 'low' or 'high' on Android
        durationLimit : 3,
        allowsEditing : false,
        noData        : false,
    },

    Intro: [
        {
            key            : 'first',
            title          : 'Welcome to DirectD',
            text           : 'BUY WITH CONFIDENCE! All Smartphones, Tablets, Smartwatches and Notebook Sold at DirectD are 100% original set.',
            icon           : 'ios-images',
            image          : MyImage.logoWhite,
            backgroundColor: primaryColor.first,
            start          : {x: 1.0, y: 0.0},
            end            : {x: 0.0, y: 1.0},
            locations      : [0.0, 1.0],
            colors         : primaryGradient.first,
        },
        {
            key            : 'second',
            title          : 'Secure Payment',
            text           : 'All your payment infomation is top safety and protected.',
            icon           : 'ios-options',
            image          : MyImage.logoWhite,
            backgroundColor: primaryColor.first,
            start          : {x: 1.0, y: 0.0},
            end            : {x: 0.0, y: 1.0},
            locations      : [0.0, 1.0],
            colors         : ['#56ab2f', '#65c234'],
        },
        {
            key            : 'thrid',
            title          : 'High Performance',
            text           : 'Saving your value time and buy product with ease.',
            icon           : 'ios-options',
            image          : MyImage.logoWhite,
            backgroundColor: primaryColor.first,
            start          : {x: 1.0, y: 0.0},
            end            : {x: 0.0, y: 1.0},
            locations      : [0.0, 1.0],
            colors         : ['#333333', '#dd1818'],
        },
    ],

    token: null,
};

const MyAPI = {

    avatarServer : MyConfig.apiUrl + 'uploads/avatars/',
    mediaServer  : MyConfig.apiUrl + 'uploads/',
    imgRestaurant: MyConfig.apiUrl + 'uploads/restaurant/avatar/',

    INTRO_SLIDES: MyConfig.apiUrl + MyConfig.api_version + 'slides-get',

    LOGIN: MyConfig.apiUrl + MyConfig.api_version + 'signin',

    categories         : MyConfig.apiUrl + MyConfig.api_version + 'allcategories',
    product_by_category: MyConfig.apiUrl + MyConfig.api_version + 'productsbycategory',
    banner             : MyConfig.apiUrl + MyConfig.api_version + 'getbanners',
    RESTAURANTS        : MyConfig.apiUrl + MyConfig.api_version + 'restaurants-get',
    // RESTAURANTS: MyConfig.apiUrl + MyConfig.api_version + MyConfig.api_auth + 'restaurants-get' + MyConfig.API_FILE_EXTENSION,

}

export {MyConfig, MyAPI};
