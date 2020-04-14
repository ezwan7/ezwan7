import {PermissionsAndroid} from "react-native";
import Share from "react-native-share";

const MyConstant = {

    HTTP_GET             : 'GET',
    HTTP_POST            : 'POST',
    HTTP_PUT             : 'PUT',
    HTTP_PATCH           : 'PATCH',
    HTTP_DELETE          : 'DELETE',
    HTTP_JSON            : 'json',
    HTTP_APPLICATION_JSON: 'application/json',

    TIMEOUT: {
        VeryShort: 1000,
        Short    : 3000,
        Medium   : 5000,
        High     : 10000,
        ExtraHigh: 30000
    },

    ID         : 'id',
    AUTH_TOKEN : 'token',
    PHONE      : 'phone',
    username   : 'username',
    USERNAME   : 'email',
    PASSWORD   : 'password',
    FACEBOOK_ID: 'facebook_id',
    GOOGLE_ID  : 'google_id',
    EMAIL      : 'email',
    NAME       : 'name',
    FIRST_NAME : 'first_name',
    LAST_NAME  : 'last_name',
    PHOTO      : 'photo',

    DataSetType: {
        fresh           : 'fresh',
        addToEnd        : 'addToEnd',
        addToEndUnique  : 'addToEndUnique',
        addToStart      : 'addToStart',
        addToStartUnique: 'addToStartUnique',
    },

    LOGIN_MODE: {
        EMAIL   : 'EMAIL',
        FACEBOOK: 'FACEBOOK',
        GOOGLE  : 'GOOGLE',
        SMS     : 'SMS',
    },

    RESPONSE: {
        TYPE: {
            'data' : 'data',
            'error': 'error'
        },
    },

    APP_FRESH_INSTALL: {
        'NO': 'NO',
    },

    LOGIN_REDIRECT: {
        'GO_BACK'       : 'GO_BACK',
        'ROUTE_TO_HOME' : 'ROUTE_TO_HOME',
        'ROUTE_TO_LOGIN': 'ROUTE_TO_LOGIN',
        'NO_ACTION'     : 'NO_ACTION',
    },

    NAVIGATION_ACTIONS: {
        'HIDE_SPLASH'         : 'HIDE_SPLASH',
        'SWITCH_APP_NAVIGATOR': 'SWITCH_APP_NAVIGATOR',
        'POP_TO_ROOT'         : 'POP_TO_ROOT',
        'GO_BACK'             : 'GO_BACK',
        'CLOSE_DRAWER'        : 'CLOSE_DRAWER',
    },

    NAVIGATION_ACTION: {
        'GO_BACK'   : 'GO_BACK',
        'NAVIGATE'  : 'NAVIGATE',
        'RESET'     : 'RESET',
        'SET_PARAMS': 'SET_PARAMS',
    },

    NAVIGATION_PARAMS_ACTION: {
        'NO_HEADER_LEFT'     : 'NO_HEADER_LEFT',
        'NO_HEADER_LEFT_PUSH': 'NO_HEADER_LEFT_PUSH',
    },

    CommonAction: {
        navigate : 'navigate',
        reset    : 'reset',
        goBack   : 'goBack',
        setParams: 'setParams',
    },
    StackAction : {
        replace : 'replace',
        push    : 'push',
        pop     : 'pop',
        popToTop: 'popToTop',
    },
    DrawerAction: {
        openDrawer  : 'openDrawer',
        closeDrawer : 'closeDrawer',
        toggleDrawer: 'toggleDrawer',
        jumpTo      : 'jumpTo',
    },
    TabAction   : {
        jumpTo: 'jumpTo',
    },

    DrawerOnPress: {
        Navigate      : 'Navigate',
        DrawerJump    : 'DrawerJump',
        TabJump       : 'TabJump',
        PromptLogout  : 'PromptLogout',
        RateApp       : 'RateApp',
        ShareApp      : 'ShareApp',
        ShowAlert     : 'ShowAlert',
        AppUpdateCheck: 'AppUpdateCheck',
        ShowModal     : 'ShowModal',
    },

    CLEAR_STORAGE: {
        'TOKEN'            : 'TOKEN',
        'CREDENTIAL'       : 'CREDENTIAL',
        //
        'ALL_ASYNC_STORAGE': 'ALL_ASYNC_STORAGE',
    },

    SNACKBAR: {
        LENGTH_INDEFINITE: 'LENGTH_INDEFINITE',
        LENGTH_LONG      : 'LENGTH_LONG',
        LENGTH_SHORT     : 'LENGTH_SHORT',
    },

    TINY_TOAST: {
        SHORT        : 2000,
        LONG         : 3500,
        HIDE_AND_SHOW: 'HIDE_AND_SHOW',
        HIDE         : 'HIDE',
        SHOW         : 'SHOW',
    },

    SHOW_MESSAGE: {
        ALERT         : 'ALERT',
        TOAST         : 'TOAST',
        SNACKBAR      : 'SNACKBAR',
        SNACKBAR_RETRY: 'SNACKBAR_RETRY'
    },

    SHOW_LOADER: {
        FALSE  : 'FALSE',
        MESSAGE: 'MESSAGE',
    },

    ACTION_SHEET: {
        TYPE : {
            SHEET: 'SHEET',
            GRID : 'GRID',
            ALERT: 'ALERT',
        },
        THEME: {
            light: 'light',
            dark : 'dark',
        },
    },

    IMAGE_PICKER: {
        OPEN_TYPE: {
            Camera      : 'Camera',
            ImageLibrary: 'ImageLibrary',
            ALL         : 'ALL',
        },
    },

    DROPDOWN_ALERT: {
        TYPE: {
            info   : 'info',
            warn   : 'warn',
            error  : 'error',
            success: 'success',
            custom : 'custom',
        },
    },

    Linking: {
        openURL: 'openURL'
    },

    SHARE: {
        TYPE  : {
            open       : 'open',
            shareSignal: 'shareSignal',
        },
        SOCIAL: {
            FACEBOOK         : Share.Social.FACEBOOK,
            PAGESMANAGER     : Share.Social.PAGESMANAGER,
            WHATSAPP         : Share.Social.WHATSAPP,
            INSTAGRAM        : Share.Social.INSTAGRAM,
            INSTAGRAM_STORIES: Share.Social.INSTAGRAM_STORIES,
            GOOGLEPLUS       : Share.Social.GOOGLEPLUS,
            EMAIL            : Share.Social.EMAIL,
            PINTEREST        : Share.Social.PINTEREST,
            // SMS              : Share.Social.SMS,
            // SNAPCHAT         : Share.Social.SNAPCHAT,
            // MESSENGER        : Share.Social.MESSENGER,
            LINKEDIN         : Share.Social.LINKEDIN,
        },
    },

    VectorIcon: {
        AntDesign             : 'AntDesign',
        Entypo                : 'Entypo',
        EvilIcons             : 'EvilIcons',
        Feather               : 'Feather',
        FontAwesome           : 'FontAwesome',
        FontAwesome5          : 'FontAwesome5',
        Fontisto              : 'Fontisto',
        Foundation            : 'Foundation',
        Ionicons              : 'Ionicons',
        MaterialIcons         : 'MaterialIcons',
        MaterialCommunityIcons: 'MaterialCommunityIcons',
        Octicons              : 'Octicons',
        Zocial                : 'Zocial',
        SimpleLineIcons       : 'SimpleLineIcons',
    },

    PermissionsAndroid: {
        READ_CALENDAR         : PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
        WRITE_CALENDAR        : PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        CAMERA                : PermissionsAndroid.PERMISSIONS.CAMERA,
        READ_CONTACTS         : PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        WRITE_CONTACTS        : PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        GET_ACCOUNTS          : PermissionsAndroid.PERMISSIONS.GET_ACCOUNTS,
        ACCESS_FINE_LOCATION  : PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ACCESS_COARSE_LOCATION: PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        RECORD_AUDIO          : PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        READ_PHONE_STATE      : PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        CALL_PHONE            : PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        READ_CALL_LOG         : PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        WRITE_CALL_LOG        : PermissionsAndroid.PERMISSIONS.WRITE_CALL_LOG,
        ADD_VOICEMAIL         : PermissionsAndroid.PERMISSIONS.ADD_VOICEMAIL,
        USE_SIP               : PermissionsAndroid.PERMISSIONS.USE_SIP,
        PROCESS_OUTGOING_CALLS: PermissionsAndroid.PERMISSIONS.PROCESS_OUTGOING_CALLS,
        BODY_SENSORS          : PermissionsAndroid.PERMISSIONS.BODY_SENSORS,
        SEND_SMS              : PermissionsAndroid.PERMISSIONS.SEND_SMS,
        RECEIVE_SMS           : PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        READ_SMS              : PermissionsAndroid.PERMISSIONS.READ_SMS,
        RECEIVE_WAP_PUSH      : PermissionsAndroid.PERMISSIONS.RECEIVE_WAP_PUSH,
        RECEIVE_MMS           : PermissionsAndroid.PERMISSIONS.RECEIVE_MMS,
        READ_EXTERNAL_STORAGE : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        WRITE_EXTERNAL_STORAGE: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    },

    DeviceInfo: {
        getAndroidId      : 'getAndroidId',
        getApplicationName: 'getApplicationName',
        hasNotch          : 'hasNotch',
        test              : 'test',
    },

    MomentFormat: {
        '1st Jan, 1970 12:01:01 am': 'Do MMM, YYYY hh:mm:ss a',
        '1st Jan, 1970'            : 'Do MMM, YYYY',

        '08:30pm' : 'hh:mma',
        '23:00:00': 'HH:mm:ss',
    },

    InputIconRightOnPress: {
        secureTextEntry: 'secureTextEntry'
    },

    RegistrationAction: {
        welcome_screen_only: 'welcome_screen_only',
        verification_needed: 'verification_needed',
        auto_login         : 'auto_login',
    },

    Validation: {
        email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        phone: /^(?:[+\d].*\d|\d)$/,
    },

    FetchBlobType: {
        fetch: 'fetch',
    },
    FetchFileType: {
        base64: 'base64',
        text  : 'text',
        json  : 'json',
    },
}

export {MyConstant};
