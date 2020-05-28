import {GoogleSignin, statusCodes} from "@react-native-community/google-signin";
import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from "react-native-fbsdk";
import appleAuth, {
    AppleButton,
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';

import MyUtil from "../common/MyUtil";
import {MyConstant} from "./MyConstant";
import MyLANG from "../shared/MyLANG";
import {MyConfig, MyAPI} from "../shared/MyConfig";
import {MyStyle} from "./MyStyle";

import {store} from "../store/MyStore";
import {switchAppNavigator} from "../store/AppRedux";
import {authEmpty, login, logout} from "../store/AuthRedux";
import {addressEmpty} from "../store/AddressRedux";
import {appDataEmpty} from "../store/AppDataRedux";
import {appInfoEmpty} from "../store/AppInfoRedux";
import {appInputEmpty} from "../store/AppInputRedux";
import {cartEmpty} from "../store/CartRedux";
import {categoryEmpty} from "../store/CategoryRedux";
import {introEmpty} from "../store/IntroRedux";
import {notificationEmpty} from "../store/NotificationRedux";
import {orderEmpty} from "../store/OrderRedux";
import {userLocationEmpty} from "../store/UserLocation";

const MyAuth = {

    isSavedLogin: async (showInfoMessage: any, showErrorMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: isSavedLogin:', {
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        // Check if Username and Password is stored in local storage:
        const keychain: any = await MyUtil.keychainGet(false);
        MyUtil.printConsole(true, 'log', 'LOG: keychainGet: await-response: ', {'keychain': keychain});

        if (keychain && keychain[MyConstant.PASSWORD]) {  // Found Saved Username, Password:

            // Call Silent Background Login If Found Saved Username, Password:
            MyAuth.login(JSON.parse(keychain[MyConstant.username]), showInfoMessage, showErrorMessage, showLoader, doReRoute, routeTo, navigationActions);

            // TODO: If Saved Login Found and Login Not Required => Open Home page First then Call Login API
            if (MyConfig.loginRequired === true) { // App require Login: Show login screen:

            } else {

            }
        } else { // No Username, Password Found. SKIP. Check Config to re route:

            if (keychain?.code === 'E_CRYPTO_FAILED') { // TODO: need loop or touch event to know cancel or repeated failed attempt
                MyAuth.processLogout(null,
                                     false,
                                     false,
                                     [MyConstant.CLEAR_STORAGE.ALL_ASYNC_STORAGE, MyConstant.CLEAR_STORAGE.TOKEN, MyConstant.CLEAR_STORAGE.REDUX],
                                     false,
                                     false,
                                     null,
                );
            } else {
                //
            }

            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }
        }
    },

    // Comes from doReRoute, mainly checks if silent login or button. Action taken by checking if login required:
    checkIfLoginRequired: async (showMessage: any, message: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: checkIfLoginRequired:', {
            'showMessage'      : showMessage,
            'message'          : message,
            'navigationActions': navigationActions,
        });

        if (MyConfig.loginRequired === true) { // App require Login: Show login screen:
            store.dispatch(switchAppNavigator(MyConfig.appNavigation.LoginStackScreen));
        } else { // If APP not Required Login, switch to home navigator:
            switch (navigationActions) {
                case MyConstant.NAVIGATION_ACTIONS.SWITCH_APP_NAVIGATOR:
                    store.dispatch(switchAppNavigator(MyConfig.appNavigation.HomeNavigator));
                    break;
                case MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT:
                    MyUtil.stackAction(false, null, MyConstant.StackAction.popToTop, null, null, null);
                    break;
                case MyConstant.NAVIGATION_ACTIONS.GO_BACK:
                    MyUtil.commonAction(false, null, MyConstant.CommonAction.goBack, 1, null, null);
                    break;
                case MyConstant.NAVIGATION_ACTIONS.CLOSE_DRAWER:
                    MyUtil.drawerAction(false, null, MyConstant.DrawerAction.closeDrawer, 1, null, null);
                    break;
                default:
                    break;
            }
        }

        // If coming from Splash screen then hide the splash screen: do it in individual screen:
        // if (navigationActions === MyConstant.NAVIGATION_ACTIONS.SWITCH_APP_NAVIGATOR_AND_HIDE_SPLASH) {}
        // Done separately in 3 Screens: Intro, Login, Home.

        MyUtil.showMessage(showMessage, message, false);
    },

    login: async (formParam: any, showInfoMessage: any, showErrorMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: login:', {
            'formParam'        : formParam,
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        let API = ''; //CHANGE
        switch (formParam?.mode) {
            case MyConstant.LOGIN_MODE.APPLE:
                API = MyAPI.login_google;
                break;
            case MyConstant.LOGIN_MODE.GOOGLE:
                API = MyAPI.login_google;
                break;
            case MyConstant.LOGIN_MODE.FACEBOOK:
                API = MyAPI.login_facebook;
                break;
            case MyConstant.LOGIN_MODE.SMS:
                API = MyAPI.login_sms;
                break;
            case MyConstant.LOGIN_MODE.EMAIL:
            default:
                API = MyAPI.login;
                break;
        }

        const firebase_token: any = store.getState().auth.firebase_token;

        // Call Login API:
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, API,
                    {
                        'language_id': MyConfig.LanguageActive,

                        [MyConstant.USERNAME]: formParam?.username,
                        [MyConstant.PASSWORD]: formParam?.password,

                        [MyConstant.FACEBOOK_ID]   : formParam?.facebook_id,
                        [MyConstant.GOOGLE_ID]     : formParam?.google_id,
                        [MyConstant.EMAIL]         : formParam?.username || formParam?.email,
                        [MyConstant.NAME]          : formParam?.name,
                        [MyConstant.FIRST_NAME]    : formParam?.first_name,
                        [MyConstant.LAST_NAME]     : formParam?.last_name,
                        [MyConstant.PHOTO]         : formParam?.photo,
                        [MyConstant.FIREBASE_TOKEN]: firebase_token,
                        // "role"               : MyConfig.UserRole.customer,
                        // "db_key"             : 'app_build_ver_android',
                        // "device"             : null,
                        'app_ver'                  : MyConfig.app_version,
                        'app_build_ver'            : MyConfig.app_build_version,
                        'platform'                 : MyConfig.app_platform,
                        'device'                   : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : API,
            'response': response,
        });

        // Login Fully Successful, go for login data process:
        if (response?.type === MyConstant.RESPONSE.TYPE.data && response?.data?.status === 200 && response?.data?.data?.data?.[0]?.id > 0) {

            const data = response.data.data.data?.[0];

            // If Facebook/Google API called, then check if new account or existing:
            switch (formParam?.mode) {
                case MyConstant.LOGIN_MODE.APPLE:
                case MyConstant.LOGIN_MODE.GOOGLE:
                case MyConstant.LOGIN_MODE.FACEBOOK:
                    if (response?.data?.data?.api_use_type === 'login') {
                        MyAuth.processLogin(formParam, data, false, false, doReRoute, routeTo, navigationActions);
                    } else if (response?.data?.data?.api_use_type === 'registration') {
                        MyAuth.processSignup(formParam, data, false, false, 'doReRoute', routeTo, navigationActions);
                    } else {
                    }
                    break;
                default:
                    MyAuth.processLogin(formParam, data, false, false, doReRoute, routeTo, navigationActions);
                    break;
            }

        } else {
            MyUtil.showMessage(showErrorMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);

            MyAuth.processLogout(null,
                                 showInfoMessage,
                                 showErrorMessage,
                                 showLoader,
                                 [MyConstant.CLEAR_STORAGE.ALL_ASYNC_STORAGE, MyConstant.CLEAR_STORAGE.TOKEN, MyConstant.CLEAR_STORAGE.REDUX, MyConstant.CLEAR_STORAGE.KEYCHAIN],
                                 doReRoute,
                                 navigationActions
            );

            // Login Failed, Check Config to re route:
            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }
        }
    },

    processLogin: async (formParam: any, user: any, showMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        try {
            MyUtil.printConsole(true, 'log', 'LOG: processLogin:', {
                'formParam'        : formParam,
                'user'             : user,
                'showMessage'      : showMessage,
                'showLoader'       : showLoader,
                doReRoute          : doReRoute,
                'routeTo'          : routeTo,
                'navigationActions': navigationActions,
            });


            // Store User Object is Redux:
            store.dispatch(login(user));

            // Store username, password into keychain:
            delete formParam.photo;
            formParam.password  = formParam.password ? formParam.password : '-';
            const keychain: any = await MyUtil.keychainSet(JSON.stringify(formParam),
                                                           formParam?.password,
                                                           MyStyle.platformOS === "ios" ? MyConfig.ios_app_id : MyConfig.android_package_name,
                                                           showMessage
            );
            MyUtil.printConsole(true, 'log', 'LOG: keychainSet: await-response: ', {
                'package_name': MyStyle.platformOS === "ios" ? MyConfig.ios_app_id : MyConfig.android_package_name,
                'keychain'    : keychain
            });
            // Username, password stored successfully:
            if (keychain === true) {

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.LoginSuccessfully, false);

                if (MyConfig.loginRequired === true) { // If App require Login: After Login Switch to Home Navigtor
                    store.dispatch(switchAppNavigator(MyConfig.appNavigation.HomeNavigator));
                } else { // If App not Required Login: After login Pop To Root:
                    switch (navigationActions) {
                        case MyConstant.NAVIGATION_ACTIONS.SWITCH_APP_NAVIGATOR:
                            store.dispatch(switchAppNavigator(MyConfig.appNavigation.HomeNavigator));
                            break;
                        case MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT:
                            MyUtil.stackAction(false, null, MyConstant.StackAction.popToTop, null, null, null);
                            break;
                        case MyConstant.NAVIGATION_ACTIONS.GO_BACK:
                            MyUtil.stackAction(false, null, MyConstant.StackAction.pop, 1, null, null);
                            break;
                        default:
                            break;
                    }
                }

            } else {
                throw new Error('Credential Saving Failed!');
            }
        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: processLogin: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.LoginFailed, false);

            // Login Data Processing Failed, Check Config to re route:
            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }

        } finally {

            MyUtil.printConsole(true, 'log', 'LOG: processLogin: TRY-FINALY: ', {});

        }
    },

    processLogout: async (user: any, showInfoMessage: any, showErrorMessage: any, showLoader: any, clearStorage: any, doReRoute: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: processLogout:', {
            'user'             : user,
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'showLoader'       : showLoader,
            'clearStorage'     : clearStorage,
            'doReRoute'        : doReRoute,
            'navigationActions': navigationActions,
        });

        try {
            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                );
            }

            // TODO: logout facebook, google plus

            // Clear User Object is Redux:
            store.dispatch(logout());

            for (const storage of clearStorage) {

                // Remove Keychain:
                if (storage === MyConstant.CLEAR_STORAGE.KEYCHAIN) {
                    const keychain: any = await MyUtil.keychainReset(MyConstant.SHOW_MESSAGE.TOAST);
                    MyUtil.printConsole(true, 'log', 'LOG: keychainReset: await-response: ', {'keychain': keychain});
                    if (keychain !== true) {
                        throw new Error('Stored Credential Removal Failed!');
                    }
                }

                // Remove All Async Storage:
                if (storage === MyConstant.CLEAR_STORAGE.ALL_ASYNC_STORAGE) {
                    const storage: any = await MyUtil.AsyncStorageClear(MyConstant.SHOW_MESSAGE.TOAST);
                    MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear: await-response: ', {'storage': storage});
                    //TODO: throw error:
                }

                // Remove All REDUX:
                if (storage === MyConstant.CLEAR_STORAGE.REDUX) {
                    store.dispatch(addressEmpty());
                    store.dispatch(appDataEmpty());
                    // store.dispatch(appInfoEmpty());
                    // store.dispatch(appInputEmpty());
                    store.dispatch(authEmpty());
                    store.dispatch(cartEmpty());
                    // store.dispatch(categoryEmpty());
                    // store.dispatch(introEmpty());
                    store.dispatch(notificationEmpty());
                    store.dispatch(orderEmpty());
                    store.dispatch(userLocationEmpty());
                }
            }

            MyUtil.showMessage(showInfoMessage, MyLANG.LogoutSuccessfully, false);

        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: processLogout: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showErrorMessage, MyLANG.LogoutFailed, false);

        } finally {

            MyUtil.printConsole(true, 'log', 'LOG: processLogout: TRY-FINALY: ', {});

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.Black.containerStyle,
                                     MyStyle.TinyToast.Black.textStyle,
                                     MyStyle.TinyToast.Black.textColor,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.HIDE
                );
            }

            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }
        }
    },


    loginFacebook : async (showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: loginFacebook:', {
            'showMessage': showMessage,
        });
        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }
        try {
            // LoginManager.setLoginBehavior('native_with_fallback');
            await LoginManager.logInWithPermissions(['public_profile', 'email']).then(
                async (result) => {
                    if (result.isCancelled) {
                        throw result;
                    } else {
                        const accessData   = await AccessToken.getCurrentAccessToken();
                        const graphRequest = new Promise((resolve, reject) => {
                            const infoRequest = new GraphRequest(
                                '/me',
                                {
                                    accessToken: accessData?.accessToken,
                                    parameters : {
                                        'fields': {
                                            'string': 'id,name,first_name,last_name,email,picture.type(large)'
                                        }
                                    }
                                },
                                (error: any, result: any) => {
                                    if (result) {
                                        resolve(result);
                                    } else {
                                        reject(error);
                                    }
                                }
                            );
                            new GraphRequestManager().addRequest(infoRequest).start();
                        });

                        await graphRequest
                            .then((result: any) => {
                                if (result && result['id']) {
                                    response = {
                                        'type' : MyConstant.RESPONSE.TYPE.data,
                                        'error': null,
                                        'data' : result,
                                    }
                                } else {
                                    throw 'Facebook signin id not found';
                                }
                            })
                            .catch((error: any) => {
                                throw error;
                            });
                    }
                },
                (error: any) => {
                    if (error.message === 'User logged in as different Facebook user.') {
                        MyAuth.logoutFacebook(showMessage, true);
                    }
                    throw error;
                }
            );

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: logoutFacebook: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.FacebookLoginFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            MyUtil.printConsole(true, 'log', 'LOG: loginFacebook: TRY-FINALY: ', {'response': response});

            return response;
        }
    },
    logoutFacebook: async (showMessage: any, login: boolean) => {
        MyUtil.printConsole(true, 'log', 'LOG: logoutFacebook:', {
            'showMessage': showMessage,
            'login'      : login,
        });
        let response: any = {
            'type' : MyConstant.RESPONSE.TYPE.error,
            'error': null,
            'data' : null,
        }
        try {
            const accessData   = await AccessToken.getCurrentAccessToken();
            const graphRequest = new Promise((resolve, reject) => {
                const logout = new GraphRequest(
                    "me/permissions/",
                    {
                        accessToken: accessData?.accessToken,
                        httpMethod : 'DELETE'
                    },
                    (error: any, result: any) => {
                        if (error) {
                            reject(error);
                        } else {
                            LoginManager.logOut();
                            resolve(result);
                        }
                    }
                );
                new GraphRequestManager().addRequest(logout).start();
            });
            await graphRequest
                .then((result: any) => {
                    if (login === true) {
                        MyAuth.loginFacebook(showMessage);
                    }
                    response = {
                        'type' : MyConstant.RESPONSE.TYPE.data,
                        'error': null,
                        'data' : result,
                    }
                })
                .catch((error: any) => {
                    throw error;
                });

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: logoutFacebook: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.FacebookLogoutFailed, false);

            response = {
                'type' : MyConstant.RESPONSE.TYPE.error,
                'error': error,
                'data' : null,
            }

        } finally {
            // MyUtil.printConsole(true, 'log', 'LOG: GetDeviceInfo: TRY-FINALY: ', {'response': response});

            return response;
        }
    },
    loginGoogle   : async (showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: googlePlusLogin:', {'showMessage': showMessage});
        try {
            GoogleSignin.configure(
                {
                    scopes       : ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/user.phonenumbers.read'], // what API you  want toaccess on behalf of the user, default is email and profile.
                    webClientId  : MyConfig.google_web_client_id, // client ID of type WEB for your server (needed to verify user ID and offline access)
                    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER hostedDomain      :
                    // '', // specifies a hosted domain restriction loginHint         : '', // [iOS] The user's ID, or email address, to be prefilled
                    // in the authentication UI if possible. [See docs
                    // here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
                    // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login. accountName       : '', //
                    // [Android] specifies an account name on the device that should be used iosClientId       : '<FROM DEVELOPER CONSOLE>', // [iOS]
                    // optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
                }
            );

            // const isSignedIn  = await GoogleSignin.isSignedIn();
            // const userInfo    = await GoogleSignin.signInSilently();
            // const currentUser = await GoogleSignin.getCurrentUser();
            // await GoogleSignin.revokeAccess();
            // await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            const googleSignin: any = await GoogleSignin.signIn();

            if (googleSignin && googleSignin['user'] && googleSignin['user']['id']) {
                return googleSignin;
            } else {
                throw 'Google signin id not found';
            }
        } catch (error) {
            switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED: // user cancelled the login flow
                    MyUtil.showMessage(showMessage, MyLANG.GoogleLoginUserCanceled, false);
                    break;
                case statusCodes.IN_PROGRESS: // operation (e.g. sign in) is in progress already
                    MyUtil.showMessage(showMessage, MyLANG.GoogleLoginInProgress, false);
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE: // play services not available or outdated
                    MyUtil.showMessage(showMessage, MyLANG.GoogleLoginNoPlayService, false);
                    break;
                default:  // some other error happened
                    MyUtil.showMessage(showMessage, MyLANG.GoogleLoginFailed, false);
                    break;
            }
            MyUtil.printConsole(true, 'log', 'LOG: loginGoogle: TRY-CATCH: ', {'error': error});

            return error;
        }
    },
    loginApple    : async (showMessage: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: loginApple:', {'showMessage': showMessage});

        try {
            const appleAuthRequestResponse = await appleAuth.performRequest(
                {
                    requestedOperation: AppleAuthRequestOperation.LOGIN,
                    requestedScopes   : [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
                });

            MyUtil.printConsole(true, 'log', 'LOG: appleAuthRequestResponse: ', {appleAuthRequestResponse});

            // get current authentication state for user
            // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

            // MyUtil.printConsole(true, 'log', 'LOG: credentialState: ', {credentialState});

            // use credentialState response to ensure the user is authenticated
            // if (credentialState === AppleAuthCredentialState.AUTHORIZED) {

            if (appleAuthRequestResponse?.user) {
                return appleAuthRequestResponse;

            } else {

                throw 'Apple signin id not found';
            }

        } catch (error) {

            MyUtil.showMessage(showMessage, MyLANG.AppleLoginFailed, false);
            MyUtil.printConsole(true, 'log', 'LOG: loginApple: TRY-CATCH: ', {'error': error});

            return error;
        }
    },


    signup: async (formParam: any, showMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: signup:', {
            'formParam'        : formParam,
            'showMessage'      : showMessage,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        let API = ''; //CHANGE
        switch (formParam?.mode) {
            case MyConstant.LOGIN_MODE.APPLE:
                API = MyAPI.login_google;
                break;
            case MyConstant.LOGIN_MODE.GOOGLE:
                API = MyAPI.login_google;
                break;
            case MyConstant.LOGIN_MODE.FACEBOOK:
                API = MyAPI.login_facebook;
                break;
            case MyConstant.LOGIN_MODE.SMS:
                API = MyAPI.login_sms;
                break;
            case MyConstant.LOGIN_MODE.EMAIL:
            default:
                API = MyAPI.signup;
                break;
        }

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, API,
                    {
                        // [MyConstant.USERNAME]      : formParam?.username,
                        [MyConstant.PASSWORD]: formParam?.password,

                        [MyConstant.FACEBOOK_ID]: formParam?.facebook_id,
                        [MyConstant.GOOGLE_ID]  : formParam?.google_id,

                        [MyConstant.EMAIL]         : formParam?.email,
                        [MyConstant.NAME]          : formParam?.name,
                        [MyConstant.FIRST_NAME]    : formParam?.first_name,
                        [MyConstant.LAST_NAME]     : formParam?.last_name,
                        [MyConstant.PHOTO]         : formParam?.photo,
                        [MyConstant.REFERENCE_CODE]: formParam?.reference_code,

                        "customers_firstname": formParam?.first_name,
                        "customers_lastname" : formParam?.last_name, //CHANGE
                        "customers_telephone": formParam?.phone,
                        // "role"               : MyConfig.UserRole.customer,
                        // "db_key"             : 'app_build_ver_android',
                        // "device"             : null,
                        'app_ver'            : MyConfig.app_version,
                        'app_build_ver'      : MyConfig.app_build_version,
                        'platform'           : MyConfig.app_platform,
                        'device'             : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : API,
            'response': response,
        });

        // Signup Fully Successful, go for next data process:
        if (response?.type === MyConstant.RESPONSE.TYPE.data && response?.data?.status === 200 && response?.data?.data?.data?.[0]?.id > 0) {

            const data = response.data.data.data?.[0];

            // If Facebook/Google API called, then check if new account or existing:
            switch (formParam?.mode) {
                case MyConstant.LOGIN_MODE.APPLE: // If registration is done vai social login:
                case MyConstant.LOGIN_MODE.GOOGLE: // If registration is done vai social login:
                case MyConstant.LOGIN_MODE.FACEBOOK:
                    if (response?.data?.data?.api_use_type === 'login') { // If social login already exists => auto login and redirect:
                        MyAuth.processLogin(formParam, data, false, false, doReRoute, routeTo, navigationActions);
                    } else if (response?.data?.data?.api_use_type === 'registration') { // If social login is new, created new account:
                        MyAuth.processSignup(formParam, data, false, false, doReRoute, routeTo, navigationActions);
                    } else {
                    }
                    break;
                default:  // If registration id done via email:
                    MyAuth.processSignup(formParam, data, false, false, doReRoute, routeTo, navigationActions);
                    break;
            }

        } else {

            MyUtil.showMessage(showMessage, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);

            //TODO: Trigger form validation
        }
    },

    processSignup: async (formParam: any, user: any, showMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {
        try {
            MyUtil.printConsole(true, 'log', 'LOG: processSignup:', {
                'formParam'        : formParam,
                'user'             : user,
                'showMessage'      : showMessage,
                'showLoader'       : showLoader,
                'doReRoute'        : doReRoute,
                'routeTo'          : routeTo,
                'navigationActions': navigationActions,
            });

            switch (MyConfig.registrationAction) {
                case MyConstant.RegistrationAction.welcome_screen_only:
                    MyUtil.commonAction(false, null, MyConstant.CommonAction.navigate, MyConfig.routeName.SignupCompleted, null, null);
                    break;
                case MyConstant.RegistrationAction.verification_needed:
                    MyUtil.commonAction(false, null, MyConstant.CommonAction.navigate, MyConfig.routeName.SignupCompleted, null, null);
                    break;
                case MyConstant.RegistrationAction.auto_login:
                    MyUtil.commonAction(false,
                                        null,
                                        MyConstant.CommonAction.navigate,
                                        MyConfig.routeName.SignupCompleted,
                                        {
                                            login: {
                                                formParam        : formParam,
                                                user             : user,
                                                showMessage      : MyConstant.SHOW_MESSAGE.ALERT,
                                                showLoader       : MyLANG.Login + '...',
                                                doReRoute        : doReRoute,
                                                routeTo          : routeTo,
                                                navigationActions: navigationActions
                                            }
                                        },
                                        null
                    );
                    // MyAuth.processLogin(formParam, user, false, false, doReRoute, routeTo, navigationActions);
                    // MyAuth.login(user, showMessage, showLoader, doReRoute, routeTo, navigationActions);
                    break;
                default:
                    break;
            }

        } catch (error) {
            MyUtil.printConsole(true, 'log', 'LOG: processSignup: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showMessage, MyLANG.RegistrationFailed, false);
        }
    },


    passwordForgot: async (formParam: any, showMessage: any, showLoader: any, routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: passwordForgot:', {
            'formParam'        : formParam,
            'showMessage'      : showMessage,
            'showLoader'       : showLoader,
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.password_forgot,
                    {
                        [MyConstant.EMAIL]: formParam?.email,
                        'app_ver'         : MyConfig.app_version,
                        'app_build_ver'   : MyConfig.app_build_version,
                        'platform'        : MyConfig.app_platform,
                        'device'          : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : MyAPI.password_forgot,
            'response': response,
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response?.data?.status === 200 && response?.data?.data?.success === '1') {

            const data = response.data.data.data;
            MyUtil.showMessage(showMessage,
                               {
                                   'title'  : MyLANG.Success,
                                   'message': response?.data?.data?.message || MyLANG.PasswordResetCodeSent
                               },
                               false
            );
            if (routeName) {
                MyUtil.commonAction(false, null, MyConstant.CommonAction.navigate, routeName, params, null);
            }

        } else {
            MyUtil.showMessage(showMessage, response?.data?.data?.message || MyLANG.UnknownError, false);
        }
    },

    passwordReset: async (formParam: any, showMessage: any, showLoader: any, routeName: any, params: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: passwordReset:', {
            'formParam'        : formParam,
            'showMessage'      : showMessage,
            'showLoader'       : showLoader,
            'routeName'        : routeName,
            'params'           : params,
            'navigationActions': navigationActions,
        });

        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.password_reset,
                    {
                        'otp'   : formParam?.code,
                        email   : formParam?.email,
                        password: formParam?.password,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : MyAPI.password_forgot,
            'response': response,
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response?.data?.status === 200 && response?.data?.data?.success === '1') {

            const data = response.data.data.data;
            MyUtil.showMessage(showMessage,
                               {
                                   'title'  : MyLANG.Success,
                                   'message': response?.data?.data?.message || MyLANG.PasswordResetSuccessfull
                               },
                               false
            );
            if (routeName) {
                MyUtil.commonAction(false, null, MyConstant.CommonAction.navigate, routeName, params, null);
            }

        } else {
            MyUtil.showMessage(showMessage, response?.data?.data?.message || MyLANG.UnknownError, false);
        }
    },

    showLogoutConfirmation: async (showInfoMessage: any, showErrorMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: showLogoutConfirmation:', {
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        MyUtil.showAlert(MyLANG.Attention, MyLANG.LogoutConfirmation, false, [
            {
                text   : 'Cancel',
                style  : 'cancel',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                },
            },
            {
                text   : 'OK',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                    MyAuth.processLogout(null,
                                         showInfoMessage,
                                         showErrorMessage,
                                         showLoader,
                                         [MyConstant.CLEAR_STORAGE.ALL_ASYNC_STORAGE, MyConstant.CLEAR_STORAGE.TOKEN, MyConstant.CLEAR_STORAGE.REDUX, MyConstant.CLEAR_STORAGE.KEYCHAIN],
                                         doReRoute,
                                         navigationActions
                    );
                }
            },
        ])
    },

    biometricLogin: async (showInfoMessage: any, showErrorMessage: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: biometricLogin:', {
            'showInfoMessage'  : showInfoMessage,
            'showErrorMessage' : showErrorMessage,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        const biometryType: any = await MyUtil.keychainGetBiometryType(showErrorMessage);
        MyUtil.printConsole(true, 'log', 'LOG: keychainGetBiometryType: await-response: ', {'biometryType': biometryType});

        switch (biometryType) {
            case MyConstant.BiometryTypes.FaceID:
            case MyConstant.BiometryTypes.TouchID:
            case MyConstant.BiometryTypes.Fingerprint:

                // Check if Username and Password is stored in local storage:
                const keychain: any = await MyUtil.keychainGet(false);
                MyUtil.printConsole(true, 'log', 'LOG: keychainGet: await-response: ', {'keychain': keychain});

                if (keychain && keychain[MyConstant.PASSWORD]) {  // Found Saved Username, Password:

                    // Call Silent Background Login If Found Saved Username, Password:
                    MyAuth.login(JSON.parse(keychain[MyConstant.username]),
                                 showInfoMessage,
                                 showErrorMessage,
                                 showLoader,
                                 doReRoute,
                                 routeTo,
                                 navigationActions
                    );

                } else { // No Username, Password Found. Show Error Message

                    if (keychain?.code === 'E_CRYPTO_FAILED') { // TODO: need loop or touch event to know cancel or repeated failed attempt

                        MyUtil.showMessage(showInfoMessage, MyLANG.BiometryVerificationFailed, false);

                    } else {

                        MyUtil.showMessage(showErrorMessage, MyLANG.BiometryNAFingerprint, false);
                    }
                }

                break;
            default:
                break;
        }

    },
}

export default MyAuth;
