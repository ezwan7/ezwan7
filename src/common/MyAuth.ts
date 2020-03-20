import MyUtil from "../common/MyUtil";
import {MyConstant} from "./MyConstant";
import MyLANG from "../shared/MyLANG";
import {MyConfig, MyAPI} from "../shared/MyConfig";
import {MyStyle} from "./MyStyle";

const MyAuth = {

    showLoginRequired: async () => {

        MyUtil.printConsole(true, 'log', 'LOG: showLoginRequired:', {});

        MyUtil.showAlert(MyLANG.Attention, MyLANG.LoginRequired, false, [
            {
                text   : MyLANG.Cancel,
                style  : 'cancel',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                },
            },
            {
                text   : MyLANG.LoginNow,
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                    // TODO: Push Stack on Another Stack:
                    MyUtil.reactNavigate(MyConfig.routeName.LoginStack, {}, null);
                }
            },
        ])
    },

    showLogoutConfirmation: async () => {

        MyUtil.printConsole(true, 'log', 'LOG: showLogoutConfirmation:', {});

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
                                         MyConstant.SHOW_MESSAGE.ALERT,
                                         MyLANG.LogginOut,
                                         [MyConstant.CLEAR_STORAGE.ALL_ASYNC_STORAGE, MyConstant.CLEAR_STORAGE.TOKEN],
                                         true,
                                         null
                    );
                }
            },
        ])
    },

    isSavedLogin: async (showError: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: isSavedLogin:', {
            'showError'        : showError,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        // Check if Username and Password is stored in local storage:
        const keychain: any = await MyUtil.keychainGet(false);
        MyUtil.printConsole(true, 'log', 'LOG: keychainGet: await-response: ', {'keychain': keychain});

        if (keychain && keychain[MyConstant.USERNAME] && keychain[MyConstant.PASSWORD]) {  // Found Saved Username, Password:

            // Call Silent Background Login If Found Saved Username, Password:
            MyAuth.login(keychain[MyConstant.USERNAME], keychain[MyConstant.PASSWORD], showError, showLoader, doReRoute, routeTo, navigationActions);

        } else { // No Username, Password Found. SKIP. Check Config to re route:

            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }
        }
    },

    checkIfLoginRequired: async (showMessage: any, message: any, navigationActions: any) => {
        MyUtil.printConsole(true, 'log', 'LOG: checkIfLoginRequired:', {
            'showMessage'      : showMessage,
            'message'          : message,
            'navigationActions': navigationActions,
        });

        if (MyConfig.loginRequired === true) {

            MyUtil.reactNavigate(MyConfig.routeName.LoginStack, {}, navigationActions);

        } else { // If APP not Required Login:

            MyUtil.reactNavigate(MyConfig.routeName.HomeNavigator, {}, navigationActions);
        }

        MyUtil.showMessage(showMessage, message, false);
    },

    login: async (username: string, password: string, showError: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: login:', {
            'username'         : username,
            'password'         : password,
            'showError'        : showError,
            'showLoader'       : showLoader,
            'doReRoute'        : doReRoute,
            'routeTo'          : routeTo,
            'navigationActions': navigationActions,
        });

        // Call Login API:
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.LOGIN,
                    {
                        "app_ver"            : MyConfig.app_version,
                        "app_build_ver"      : MyConfig.app_build_version,
                        "platform"           : MyConfig.app_platform,
                        "device"             : null,
                        [MyConstant.USERNAME]: username,
                        [MyConstant.PASSWORD]: password,
                        "role"               : MyConfig.UserRole.customer,
                        "db_key"             : 'app_build_ver_android',
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Short, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL'  : MyAPI.LOGIN,
            'response': response,
        });

        // Login Fully Successful, go for login data process:
        if (response && response.type === MyConstant.RESPONSE.TYPE.data && response.data.status === 200 && response.data.data && response.data.data.data && response.data.data.data.id && response.data.data.data.id > 0) {

            MyAuth.processLogin(username, password, response.data.data.data, false, false, doReRoute, routeTo, navigationActions);

        } else {
            MyUtil.showMessage(showError, response.errorMessage ? response.errorMessage : MyLANG.UnknownError, false);

            // Login Failed, Check Config to re route:
            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }
        }
    },

    // TODO:
    processLogin: async (username: string, password: string, user: any, showError: any, showLoader: any, doReRoute: any, routeTo: any, navigationActions: any) => {

        try {
            MyUtil.printConsole(true, 'log', 'LOG: processLogin:', {
                'username'         : username,
                'password'         : password,
                'user'             : user,
                'showError'        : showError,
                'showLoader'       : showLoader,
                'doReRoute'        : doReRoute,
                'routeTo'          : routeTo,
                'navigationActions': navigationActions,
            });

            // Store User Object
            // Set Login Status

            // Store username, password into keychain:
            const keychain: any = await MyUtil.keychainSet(username, password, MyConfig.android_package_name, showError);
            MyUtil.printConsole(true, 'log', 'LOG: keychainSet: await-response: ', {
                'android_package_name': MyConfig.android_package_name,
                'keychain'            : keychain
            });
            if (keychain === true) { // Username, password stored successfully:
                // Store auth token into async storage:
                const storage: any = await MyUtil.AsyncStorageSet(MyConfig.AsyncStorage.AUTH_TOEKN, user[MyConstant.AUTH_TOKEN], showError);

                MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageSet: await-response: ', {
                    'key'    : MyConfig.AsyncStorage.AUTH_TOEKN,
                    'storage': storage,
                });

                if (storage === true) { // Token stored successfully:

                    MyConfig.token = user[MyConstant.AUTH_TOKEN]; // Store in Local Variable.

                    MyAuth.routeTo(routeTo, navigationActions);

                } else {

                    throw new Error('Token Saving Failed!');
                }
            } else {

                throw new Error('Credential Saving Failed!');
            }
        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: processLogin: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.LoginFailed, false);

            // Login Data Processing Failed, Check Config to re route:
            if (doReRoute) {
                MyAuth.checkIfLoginRequired(false, null, navigationActions);
            }

        } finally {

            MyUtil.printConsole(true, 'log', 'LOG: processLogin: TRY-FINALY: ', {});

        }
    },

    // TODO:
    processLogout: async (user: any, showError: any, showLoader: any, clearStorage: any, doReRoute: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: processLogout:', {
            'user'             : user,
            'showError'        : showError,
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
                                     MyStyle.TinyToast.containerStyleDark,
                                     MyStyle.TinyToast.textStyleWhite,
                                     MyStyle.TinyToast.textColorWhite,
                                     null,
                                     MyStyle.TinyToast.imageStyleSucess,
                                     false,
                                     true,
                                     true,
                                     0,
                                     MyConstant.TINY_TOAST.SHOW
                );
            }

            // Clear Redux, Set logout event,

            const keychain: any = await MyUtil.keychainReset(MyConstant.SHOW_MESSAGE.TOAST);
            MyUtil.printConsole(true, 'log', 'LOG: keychainReset: await-response: ', {'keychain': keychain});

            if (keychain === true) {

                for (const storage of clearStorage) {

                    if (storage === MyConstant.CLEAR_STORAGE.ALL_ASYNC_STORAGE) {
                        const storage: any = await MyUtil.AsyncStorageClear(MyConstant.SHOW_MESSAGE.TOAST);
                        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageClear: await-response: ', {'storage': storage});
                    }
                    if (storage === MyConstant.CLEAR_STORAGE.TOKEN) {
                        const storage: any = await MyUtil.AsyncStorageRemove(MyConfig.AsyncStorage.AUTH_TOEKN, MyConstant.SHOW_MESSAGE.TOAST);
                        MyUtil.printConsole(true, 'log', 'LOG: AsyncStorageRemove: await-response: ', {
                            'key'    : MyConfig.AsyncStorage.AUTH_TOEKN,
                            'storage': storage
                        });
                    }
                }

            } else {

                throw new Error('Stored Credential Removal Failed!');

            }
        } catch (error) {

            MyUtil.printConsole(true, 'log', 'LOG: processLogout: TRY-CATCH: ', {'error': error});

            MyUtil.showMessage(showError, MyLANG.LogoutFailed, false);

        } finally {

            MyUtil.printConsole(true, 'log', 'LOG: processLogout: TRY-FINALY: ', {});

            if (showLoader !== false) {
                MyUtil.showTinyToast(showLoader && showLoader.length > 0 ? showLoader : MyLANG.PleaseWait,
                                     false,
                                     MyStyle.TinyToast.CENTER,
                                     MyStyle.TinyToast.containerStyleDark,
                                     MyStyle.TinyToast.textStyleWhite,
                                     MyStyle.TinyToast.textColorWhite,
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


    routeTo: async (routeTo: any, navigationActions: any) => {

        MyUtil.printConsole(true, 'log', 'LOG: routeTo: ', {'routeTo': routeTo, 'navigationActions': navigationActions});

        switch (routeTo) {
            case MyConstant.LOGIN_REDIRECT.BACK:
                MyUtil.reactNavigateBack(null, {});
                break;
            case MyConstant.LOGIN_REDIRECT.ROUTE_TO_HOME:
                MyUtil.reactNavigate(MyConfig.routeName.HomeNavigator, {}, navigationActions);
                break;
            case MyConstant.LOGIN_REDIRECT.ROUTE_TO_LOGIN:
                MyUtil.reactNavigate(MyConfig.routeName.LoginStack, {}, navigationActions);
                break;
            case MyConstant.LOGIN_REDIRECT.NO_ACTION:
                break;
            default:
                break;
        }
    }
}

export default MyAuth;
