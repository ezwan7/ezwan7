import React, {useState, useEffect, Fragment} from 'react';
import {StatusBarDark} from '../components/MyComponent';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableHighlight} from 'react-native';
import {useForm, ErrorMessage} from 'react-hook-form';

import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyUtil from '../common/MyUtil';
import MyIcon from '../components/MyIcon';
import MyAuth from '../common/MyAuth';


import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from "react-native-fbsdk";
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import {MyInput} from "../components/MyInput";
import {MyButton} from "../components/MyButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MyMaterialRipple from "../components/MyMaterialRipple";

let renderCount = 0;
// declare var global: { HermesInternal: null | {} };

// import * as yup from 'yup';
/*const SignupSchema = yup.object().shape({
    firstName: yup.string().required('Required This Field!').min(10, 'Minimum of 10 characters'),
    lastName : yup.string().required().min(6, 'Minimum of 6 characters'),
});*/

const signInForm = {
    username: {
        ref           : {name: 'username'},
        validation    : {
            required : 'Username is Required.',
            minLength: {value: 2, message: 'Username must be atleast 2 char long.'},
        },
        shouldValidate: false,
        TextInput     : {
            icon        : '',
            label       : 'First name',
            placeholder : 'Enter First Name',
            keyboardType: 'numeric',
            multiline   : false,
        },
    },
    password: {
        ref       : {name: 'password'},
        validation: {
            required : 'Password is Required.',
            minLength: {value: 2, message: 'Password must be atleast 2 char long.'},
        },

    },
};


const LoginScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${LoginScreen.name}. renderCount: `, renderCount);
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // const [isLoading, setIsLoading] = useState(true);
    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation}: any = useForm(
        {
            // validationSchemaOption: undefined,
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            // validationSchema    : SignupSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    ); // initialise the hook

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // MyUtil.printConsole(true, 'log', 'LOG: SplashScreen: useEffect: ', {isLoading});
        register(signInForm.username.ref, signInForm.username.validation);
        register(signInForm.password.ref, signInForm.password.validation);

    }, [register]);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: any) => {
        console.log("A date has been picked: ", date);
        setValue('username', date, true);
        hideDatePicker();
    };

    /*const handleOnChangeText = (formFieldName: string, text: any, shouldValidate: boolean) => {
        setValue('firstName', text, true);
    }*/

    // const values: any = watch();

    const logoutFacebook = async () => {
        const accessData = await AccessToken.getCurrentAccessToken();
        let logout       = new GraphRequest(
            "me/permissions/",
            {
                accessToken: accessData?.accessToken,
                httpMethod : 'DELETE'
            },
            (error: any, result: any) => {
                if (error) {
                    console.log('Error fetching data: ', error);
                    console.log('Error fetching data: ', accessData);
                } else {
                    console.log('LoginManager.logOut: ');
                    LoginManager.logOut();
                }
            }
        );
        new GraphRequestManager().addRequest(logout).start();
    }

    const loginFacebook = async () => {
        // Attempt a login using the Facebook login dialog asking for default permissions.
        let result;
        // LoginManager.setLoginBehavior('native_with_fallback');
        LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            async (result) => {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log("Login success with permissions: ", result?.grantedPermissions?.toString());
                    const accessData  = await AccessToken.getCurrentAccessToken();
                    const infoRequest = new GraphRequest(
                        '/me',
                        {
                            accessToken: accessData?.accessToken,
                            parameters : {
                                'fields': {
                                    'string': 'id,name,email,phone,picture.type(large)'
                                }
                            }
                        },
                        (error, result) => {
                            if (result) {
                                MyUtil.showMessage('Login success with permissions',
                                                   error,
                                                   false
                                );
                                const profile = result
                                console.log("Login success with permissions: ", result, accessData);
                                // console.log("Login success with permissions: ", result, `https://graph.facebook.com/${result.id}/picture`);
                            } else {
                                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                                                   error,
                                                   false
                                );
                                console.log(error);
                            }
                        }
                    )

                    new GraphRequestManager().addRequest(infoRequest).start();
                }
            },
            (error: any) => {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                                   error.message,
                                   false
                );
                console.log("Login fail with error: ", error);
            }
        );
    }

    const googleLogin = async () => {
        try {
            GoogleSignin.configure(
                {
                    scopes       : ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/user.phonenumbers.read'], // what API you  want toaccess on behalf of the user, default is email and profile.
                    webClientId  : '574288086912-roj95gov2heiu5vn3hocm85t1auso6pr.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
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
            const userInfo = await GoogleSignin.signIn();
            console.log("userInfo: ", userInfo);
        } catch (error) {
            console.log("error: ", error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }

    const phoneLogin = async () => {
        /* try {
             const confirmation = await auth().signInWithPhoneNumber('+601121277006');

             await confirmation.confirm('123456'); // User entered code
             // Successful login - onAuthStateChanged is triggered
             console.log('Successful login');
         } catch (e) {
             console.error(e); // Invalid code
         }
         // [Android] Handle Auto Verification
         auth().onAuthStateChanged(user => {
             console.log('onAuthStateChanged: ', user);
             if (user) {
                 // Stop the login flow / Navigate to next page
             }
         });*/
        try {
            const confirmation = auth()
                .verifyPhoneNumber('+601121277006')
                .on('state_changed', (phoneAuthSnapshot: any) => {
                    // How you handle these state events is entirely up to your ui flow and whether
                    // you need to support both ios and android. In short: not all of them need to
                    // be handled - it's entirely up to you, your ui and supported platforms.

                    // E.g you could handle android specific events only here, and let the rest fall back
                    // to the optionalErrorCb or optionalCompleteCb functions
                    console.log('state_changed: ', phoneAuthSnapshot);
                    /*switch (phoneAuthSnapshot.state) {
                        // ------------------------
                        //  IOS AND ANDROID EVENTS
                        // ------------------------
                        case FirebaseAuthTypes.PhoneAuthState.CODE_SENT: // or 'sent'
                            console.log('code sent');
                            // on ios this is the final phone auth state event you'd receive
                            // so you'd then ask for user input of the code and build a credential from it
                            // as demonstrated in the `signInWithPhoneNumber` example above
                            break;
                        case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                            console.log('verification error');
                            console.log(phoneAuthSnapshot.error);
                            break;

                        // ---------------------
                        // ANDROID ONLY EVENTS
                        // ---------------------
                        case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
                            console.log('auto verify on android timed out');
                            // proceed with your manual code input flow, same as you would do in
                            // CODE_SENT if you were on IOS
                            break;
                        case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
                            // auto verified means the code has also been automatically confirmed as correct/received
                            // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
                            console.log('auto verified on android');
                            console.log(phoneAuthSnapshot);
                            // Example usage if handling here and not in optionalCompleteCb:
                            // const { verificationId, code } = phoneAuthSnapshot;
                            // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

                            // Do something with your new credential, e.g.:
                            // firebase.auth().signInWithCredential(credential);
                            // firebase.auth().currentUser.linkWithCredential(credential);
                            // etc ...
                            break;
                    }*/
                }/*, (error) => {
                    // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
                    // the ERROR case in the above observer then there's no need to handle it here
                    console.log(error);
                    // verificationId is attached to error if required
                    console.log(error.verificationId);
                }, (phoneAuthSnapshot: any) => {
                    // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
                    // depending on the platform. If you've already handled those cases in the observer then
                    // there's absolutely no need to handle it here.

                    // Platform specific logic:
                    // - if this is on IOS then phoneAuthSnapshot.code will always be null
                    // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
                    //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
                    // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
                    //   continue with user input logic.
                    console.log('phoneAuthSnapshot: ', phoneAuthSnapshot);
                }*/).then((phoneAuthSnapshot) => {
                    console.log('phoneAuthSnapshot-then', phoneAuthSnapshot);
                }, (error) => {
                    console.log('phoneAuthSnapshot-error', error);
                });
        } catch (e) {
            console.error(e); // Invalid code
        }
    }

    const formSubmit = async (e: any) => {

        MyUtil.reactNavigate(MyConfig.routeName.HomeNavigator, {}, null);

        const formValue: any = await MyUtil.formProcess(e, handleSubmit, formState, errors, getValues);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});
        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
            MyAuth.login(formValue.data.username,
                         formValue.data.password,
                         MyConstant.SHOW_MESSAGE.ALERT,
                         MyLANG.Login + '...',
                         false,
                         MyConstant.LOGIN_REDIRECT.ROUTE_TO_HOME,
                         null
            );
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };

    // console.log(errors, getValues(), formState.isValid);

    return (
        <Fragment>
            <StatusBarDark/>
            <SafeAreaView>
                <LinearGradient start = {MyStyle.LGWhite.start}
                                end = {MyStyle.LGWhite.end}
                                locations = {MyStyle.LGWhite.locations}
                                colors = {MyStyle.LGWhite.colors}>
                    <View style = {MyStyleSheet.layoutView1}>
                        <ScrollView contentInsetAdjustmentBehavior = "automatic">
                            <View style = {MyStyleSheet.layoutView2}>

                                <View style = {MyStyleSheet.layoutView3}>
                                    {/*{global.HermesInternal == null ? (
                                        <View>
                                            <Text>Engine: No Hermes</Text>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text>Engine: Hermes</Text>
                                        </View>
                                    )}*/}
                                    <Image
                                        source = {MyImage.defaultAvatar}
                                        style = {styles.logo}
                                        resizeMode = "contain"
                                    />
                                    <Text style = {styles.text}>
                                        {MyLANG.Login}
                                    </Text>

                                    <View style = {styles.formInputs}>

                                        <MyInput
                                            mode = "line"
                                            focusedBorder
                                            focusedBorderColor
                                            // placeholder = "Enter your Password"
                                            floatingLabel = "Enter your Password"
                                            floatingLabelBackground = "#f1f1f1"
                                            // floatingLabelFloated = {true}
                                            // inlineLabel = "Enter your Password"
                                            // placeholderLabel = "+1 ([000]) [000] [00] [00]"

                                            value = {getValues().username}
                                            inputProps = {{
                                                secureTextEntry: false,
                                                editable       : true,
                                                onChangeText   : (text: any) => setValue('username', text, true)
                                            }}
                                            // mask = {"+1 ([000]) [000] [00] [00]"}

                                            viewGroupStyle = {{}}
                                            viewStyle = {{}}
                                            floatingLabelStyle = {{}}
                                            inlineLabelStyle = {{}}
                                            inputStyle = {{}}
                                            placeholderStyle = {{}}
                                            placeholderLabelStyle = {{}}

                                            iconLeft = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'home'}}
                                            iconLeftStyle = {{}}
                                            iconRight = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'arrow-down-circle'}}
                                            iconRightStyle = {{fontSize: 16}}
                                            // iconRightOnPress = {{type: 'secureTextEntry'}}
                                            // iconRightOnPress = {(e: any) => {
                                            //     console.log('iconRightOnPress: HOME');
                                            // }}
                                            // imageLeft = {{name: MyImage.plate}}
                                            // imageLeftStyle = {{}}
                                            // imageLeftViewStyle = {{}}
                                            // imageRight = {{name: MyImage.plate}}
                                            // imageRightStyle = {{}}
                                            // imageRightViewStyle = {{}}

                                            helperText = {{
                                                colorLeftIcon : true,
                                                colorRightIcon: true,
                                                type          : "error",
                                                visible       : errors.username?.message ? true : false,
                                                message       : errors.username?.message ? errors.username.message : '',
                                            }}
                                            helperTextStyle = {{}}

                                            onPress = {(e: any) => {
                                                console.log('onPress: HOME:');
                                                // setValue('username', 'date', true);
                                                // showDatePicker();
                                            }}
                                        />

                                        {/*<MyDateTimePicker isDatePickerVisible={false} mode='date'/>*/}

                                        <MyButton
                                            size = "normal"
                                            shape = "rounded"
                                            fill = "gradient"
                                            color = {MyStyle.LGButtonPrimary}
                                            shadow = "medium"
                                            display = "block"
                                            direction = "horizontal"
                                            spacing = "center"
                                            touch = "highlight"
                                            textTransform = "capitalize"

                                            title = "Submit"

                                            linearGradientStyle = {{}}
                                            touchableStyle = {{}}
                                            // touchableProps = {{rippleSize: 244, rippleDuration: 800}}
                                            buttonViewStyle = {{}}
                                            textStyle = {{}}

                                            iconLeft = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'home'}}
                                            iconLeftStyle = {{}}
                                            iconRight = {{fontFamily: MyConstant.VectorIcon.SimpleLineIcons, name: 'eye'}}
                                            iconRightStyle = {{}}
                                            // imageLeft = {{name: MyImage.plate}}
                                            // imageLeftStyle = {{}}
                                            // imageLeftViewStyle = {{}}
                                            // imageRight = {{}}
                                            // imageRightStyle = {{}}
                                            // imageRightViewStyle = {{}}

                                            onPress = {(e: any) => {
                                                formSubmit(e);
                                            }}
                                        />
                                    </View>

                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </LinearGradient>
            </SafeAreaView>
            <DateTimePickerModal isVisible = {isDatePickerVisible}
                                 mode = "date"
                                 onConfirm = {handleConfirm}
                                 onCancel = {hideDatePicker}/>
        </Fragment>
    );
};

LoginScreen.navigationOptions = ({navigation}: any) => {
    // console.log('nativagtion data: ', navigation.state);
    return {
        title: '',
    };
};

export default LoginScreen;

const styles = StyleSheet.create(
    {
        logo      : {
            alignSelf: 'center',
            width    : MyStyle.screenWidth * 0.35,
            height   : MyStyle.screenWidth * 0.35,
        },
        text      : {
            color     : MyColor.blackTextPrimary,
            fontSize  : 40,
            fontWeight: 'bold',
            alignSelf : 'center',
        },
        formInputs: {
            display       : 'flex',
            flexDirection : 'column',
            justifyContent: 'flex-start',
            alignItems    : 'center',

            marginTop   : 20,
            marginLeft  : 32,
            marginRight : 32,
            marginEnd   : 32,
            marginBottom: 20,
        },
    }
);

