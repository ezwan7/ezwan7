import MyLANG from "./MyLANG";
import {MyAPI, MyConfig} from "../shared/MyConfig";
import MyAuth from "../common/MyAuth";
import {MyConstant} from "../common/MyConstant";
import MyUtil from "../common/MyUtil";

import {store} from "../store/MyStore";
import {appDataUpdate} from "../store/AppDataRedux";
import {appInputUpdate} from "../store/AppInputRedux";
import {userLocationUpdate} from "../store/UserLocation";


const MyFunction = {

    loginFacebook: async () => {
        const facebookLogin: any = await MyAuth.loginFacebook(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: facebookLogin: await-response: ', {
            'facebookLogin': facebookLogin
        });
        if (facebookLogin?.type === MyConstant.RESPONSE.TYPE.data && facebookLogin?.data) {
            MyAuth.login({
                             mode       : MyConstant.LOGIN_MODE.FACEBOOK,
                             facebook_id: facebookLogin?.data?.id,
                             email      : facebookLogin?.data?.email,
                             name       : facebookLogin?.data?.name,
                             first_name : facebookLogin?.data?.first_name,
                             last_name  : facebookLogin?.data?.last_name,
                             photo      : facebookLogin?.data?.picture?.data?.url,
                         },
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         null,
                         MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        }
    },

    loginGoogle: async () => {
        const googleSignin: any = await MyAuth.loginGoogle(MyConstant.SHOW_MESSAGE.TOAST);
        MyUtil.printConsole(true, 'log', 'LOG: googlePlusLogin: await-response: ', {
            'googleSignin': googleSignin
        });
        if (googleSignin && googleSignin['user']) {
            MyAuth.login({
                             mode      : MyConstant.LOGIN_MODE.GOOGLE,
                             google_id : googleSignin?.user?.id,
                             email     : googleSignin?.user?.email,
                             name      : googleSignin?.user?.name,
                             first_name: googleSignin?.user?.givenName,
                             last_name : googleSignin?.user?.familyName,
                             photo     : googleSignin?.user?.photo,
                         },
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         null,
                         MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        }
    },

    appUpdateCheck: async (promptAlert: boolean = true, showLoader: any = false, showInfoMessage: any = false, showErrorMessage: any = true) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.app_update_check,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.app_update_check, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success) {

            const data = response.data.data.success;

            if (data === '0' && promptAlert === true) {
                MyUtil.showAlert(MyLANG.Attention, MyLANG.UpdateAlert, false, [
                    {
                        text   : MyLANG.Later,
                        style  : 'cancel',
                        onPress: () => {
                            MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                        },
                    },
                    {
                        text   : MyLANG.UpdateNow,
                        onPress: () => {
                            MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                            MyUtil.linking(MyConstant.Linking.openURL, MyConfig.android_store_link, MyConstant.SHOW_MESSAGE.TOAST);

                        }
                    },
                ])
            } else if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
            }

        } else {
            if (showInfoMessage !== false) {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, response.errorMessage ? response.errorMessage : showInfoMessage.message, false);
            }
        }
    },

    fetchAppData: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = true) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.app_data,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.app_data, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.pages_data?.[0]) {

            const data     = response.data.data.pages_data;
            const app_data = {
                about_us      : data.find((e: any) => e.slug === 'about-us')?.description,
                contact_us    : data.find((e: any) => e.slug === 'contact-us')?.description,
                privacy_policy: data.find((e: any) => e.slug === 'privacy-policy')?.description,
                term_services : data.find((e: any) => e.slug === 'term-services')?.description,
                refund_policy : data.find((e: any) => e.slug === 'refund-policy')?.description,
            }

            store.dispatch(appDataUpdate(app_data, 'all'));

        } else {
            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
            }
        }
    },

    fetchPaymentMethod: async (showLoader: any = MyLANG.PleaseWait + '...', showInfoMessage: any = false, showErrorMessage: any = true) => {
        const response: any = await MyUtil
            .myHTTP(false, MyConstant.HTTP_POST, MyAPI.payment_methods,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, showLoader, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.payment_methods, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200) {

            const data = response.data?.data;
            if (data.length > 0) {

                store.dispatch(appInputUpdate(data, 'payment_method'));

            } else {

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.GetDataError, false);
            }

        } else {
            if (showInfoMessage !== false) {
                MyUtil.showMessage(showInfoMessage.showMessage, showInfoMessage.message, false);
            }
        }
    },

    productLikeUnlike: async (isLiked: string, product_id: number, user_id: number, showLoader: any = false, showErrorMessage: any = false) => {

        MyUtil.printConsole(true, 'log', 'LOG: productLikeUnlike: ', {
            'isLiked'         : isLiked,
            'product_id'      : product_id,
            'user_id'         : user_id,
            'showLoader'      : showLoader,
            'showErrorMessage': showErrorMessage,
        });

        const apiUrl = isLiked === '1' ? MyAPI.product_unlike : MyAPI.product_like;

        const response: any = await MyUtil
            .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, apiUrl,
                    {
                        'language_id'       : MyConfig.LanguageActive,
                        'liked_products_id' : product_id,
                        'liked_customers_id': user_id,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, false, true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': apiUrl, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200) {

            const data = response.data?.data?.success;
            if (data === '1') {

                return isLiked === '1' ? '0' : '1';

            } else {

                if (showErrorMessage !== false) {
                    MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
                }
            }
        } else {

            if (showErrorMessage !== false) {
                MyUtil.showMessage(showErrorMessage.showMessage, showErrorMessage.message ? showErrorMessage.message : MyLANG.Error, false);
            }
        }

        return false;
    },

    getUserLocation: async (type: string, options: any, askPermission: boolean = true, showLoader: any = false, showMessage: any) => {

        const position: any = await MyUtil.GetCurrentPosition(options, askPermission, showLoader, showMessage);
        MyUtil.printConsole(true, 'log', 'LOG: GetCurrentPosition: await-response: ', {
            'position': position,
        });
        if (position?.type === MyConstant.RESPONSE.TYPE.data && position.data?.coords?.latitude && position.data?.coords?.longitude) {

            const accuracy  = position.data?.coords?.accuracy;
            const latitude  = position.data?.coords?.latitude;
            const longitude = position.data?.coords?.longitude;

            const geocodePosition: any = await MyUtil.GeocodePosition(latitude, longitude, showMessage);
            MyUtil.printConsole(true, 'log', 'LOG: GeocodePosition: await-response: ', {
                'geocodePosition': geocodePosition,
            });
            if (geocodePosition?.results?.[0]?.address_components?.[0]) {

                const user_location: any = MyUtil.generateLocation(geocodePosition, accuracy, latitude, longitude);

                switch (type) {
                    case  MyConstant.GeolocationFetchType.store:
                        store.dispatch(userLocationUpdate(user_location, 'all'));
                        break;
                    case  MyConstant.GeolocationFetchType.return:
                        return user_location;
                    default:
                        return user_location;
                }
            }
        }

        return false;

        /*const location: any = await MyFunction.getUserLocation(MyConstant.GeolocationFetchType.return,
                                                               MyConfig.geoLocationOption,
                                                               true,
                                                               MyLANG.PleaseWait + '...',
                                                               MyConstant.SHOW_MESSAGE.ALERT
        );*/
    },

    getName: (user: any) => {
        if (user != null) {
            if (
                typeof user.last_name !== 'undefined' ||
                typeof user.first_name !== 'undefined'
            ) {
                const first = user.first_name != null ? user.first_name : "";
                const last  = user.last_name != null ? user.last_name : "";
                return `${first} ${last}`;
            } else if (typeof user.name !== 'undefined' && user.name != null) {
                return user.name;
            }
            return MyLANG.Guest;
        }
        return MyLANG.Guest;
    },

    getAvatar: (user: any) => {
        if (user) {
            if (user.avatar_url) {
                return {
                    uri: user.avatar_url,
                };
            } else if (user.picture) {
                return {
                    uri: user.picture.data.url,
                };
            }
            // return MyImage.defaultAvatar;
        }

        // return MyImage.defaultAvatar;
    },
}

export default MyFunction;
