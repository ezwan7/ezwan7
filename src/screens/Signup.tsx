import React, {useState, useEffect, Fragment} from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useForm} from 'react-hook-form';

import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyUtil from '../common/MyUtil';
import MyAuth from '../common/MyAuth';
import MyFunction from "../shared/MyFunction";

import {StatusBarDark, StatusBarGradientPrimary} from '../components/MyComponent';
import {MyInput} from "../components/MyInput";
import {MyButton} from "../components/MyButton";

import * as yup from "yup";

let renderCount = 0;

const SignupFormSchema: any = yup.object().shape(
    {
        first_name      : yup.string()
                             .required(MyLANG.FirstName + ' ' + MyLANG.isRequired)
                             .min(2, MyLANG.FirstName + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                             .max(32, MyLANG.FirstName + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character),
        last_name       : yup.string()
                             .required(MyLANG.LastName + ' ' + MyLANG.isRequired)
                             .min(2, MyLANG.LastName + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                             .max(32, MyLANG.LastName + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character),
        email           : yup.string()
                             .required(MyLANG.Email + ' ' + MyLANG.isRequired)
                             .min(2, MyLANG.Email + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                             .max(64, MyLANG.Email + ' ' + MyLANG.mustBeMaximum + ' 64 ' + MyLANG.character)
                             .email(MyLANG.InvalidEmail),
        password        : yup.string()
                             .required(MyLANG.Password + ' ' + MyLANG.isRequired)
                             .min(4, MyLANG.Password + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                             .max(24, MyLANG.Password + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
        password_confirm: yup.string()
                             .required(MyLANG.ConfirmPassword + ' ' + MyLANG.isRequired)
                             .min(4, MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                             .max(24, MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character)
                             .oneOf([yup.ref('password'), null], MyLANG.PasswordMustMatch),
        phone           : yup.string()
                             .required(MyLANG.PhoneNumber + ' ' + MyLANG.isRequired)
                             .min(5, MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMinimum + ' 5 ' + MyLANG.character)
                             .max(16, MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMaximum + ' 16 ' + MyLANG.character)
                             .matches(MyConstant.Validation.phone, MyLANG.InvalidPhone),
        reference_code  : yup.string()
                             .max(16, MyLANG.ReferenceCode + ' ' + MyLANG.mustBeMaximum + ' 16 ' + MyLANG.character),
    }
);

const signupForm: any = {
    first_name      : {
        ref           : {name: 'first_name'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.FirstName + ' ' + MyLANG.isRequired,
            minLength: {value: 2, message: MyLANG.FirstName + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character},
        }
    },
    last_name       : {
        ref           : {name: 'last_name'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.LastName + ' ' + MyLANG.isRequired,
            minLength: {value: 1, message: MyLANG.LastName + ' ' + MyLANG.mustBeMinimum + ' 1 ' + MyLANG.character},
        }
    },
    email           : {
        ref           : {name: 'email'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Email + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Email + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
            pattern  : {
                value  : MyConstant.Validation.email,
                message: MyLANG.InvalidEmail
            }
        }
    },
    password        : {
        ref           : {name: 'password'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.Password + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.Password + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
        },
    },
    password_confirm: {
        ref           : {name: 'password_confirm'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.ConfirmPassword + ' ' + MyLANG.isRequired,
            minLength: {value: 4, message: MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character},
        },
    },
    phone           : {
        ref           : {name: 'phone'},
        value         : null,
        shouldValidate: true,
        validation    : {
            required : MyLANG.PhoneNumber + ' ' + MyLANG.isRequired,
            minLength: {value: 5, message: MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMinimum + ' 5 ' + MyLANG.character},
            pattern  : {
                value  : MyConstant.Validation.phone,
                message: MyLANG.InvalidPhone
            }
        },
    },
};

const SignupScreen = ({}) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${SignupScreen.name}. renderCount: `, renderCount);
    }

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            validationSchema    : SignupFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );

    useEffect(() => {

        // MyUtil.printConsole(true, 'log', `LOG: ${SignupScreen.name}. useEffect: `, 'register');

        for (const key of Object.keys(SignupFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
    }, [register]);

    const formSubmit = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});
        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
            MyAuth.signup({
                              mode          : MyConstant.LOGIN_MODE.EMAIL,
                              first_name    : formValue.data.first_name,
                              last_name     : formValue.data.last_name,
                              email         : formValue.data.email,
                              password      : formValue.data.password,
                              phone         : formValue.data.phone,
                              reference_code: formValue.data.reference_code,
                          },
                          MyConstant.SHOW_MESSAGE.ALERT,
                          MyLANG.Registering + '...',
                          false,
                          null,
                          MyConstant.NAVIGATION_ACTIONS.POP_TO_ROOT
            );
        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };

    return (
        <Fragment>
            {MyStyle.platformOS === "ios" ? <StatusBarGradientPrimary/> : <StatusBarDark/>}
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <LinearGradient style = {[MyStyleSheet.SafeAreaView3, {}]}
                                start = {MyStyle.LGWhitish.start}
                                end = {MyStyle.LGWhitish.end}
                                locations = {MyStyle.LGWhitish.locations}
                                colors = {MyStyle.LGWhitish.colors}>

                    <ScrollView contentInsetAdjustmentBehavior = "automatic"
                                contentContainerStyle = {{paddingTop: MyStyle.paddingVerticalList}}
                    >

                        <View style = {[MyStyleSheet.viewPageLogin, {alignItems: "center"}]}>
                            {/*<Image source = {MyImage.logo1024}
                                   resizeMode = "contain"
                                   style = {styles.imageLogo}
                            />*/}
                            <Text style = {styles.textRegister}>
                                {MyLANG.Register}
                            </Text>
                            <Text style = {styles.textRegisterDescription}>
                                {MyLANG.RegistrationTitleDescription}
                            </Text>

                            <MyInput
                                floatingLabel = {MyLANG.EnterYourFirstName}
                                onChangeText = {(text: any) => setValue('first_name', text, true)}
                                value = {getValues().first_name}
                                iconLeft = {{name: 'user'}}
                                helperText = {{message: errors.first_name?.message ? errors.first_name.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourLastName}
                                onChangeText = {(text: any) => setValue('last_name', text, true)}
                                value = {getValues().last_name}
                                iconLeft = {{name: 'user'}}
                                helperText = {{message: errors.last_name?.message ? errors.last_name.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourEmail}
                                onChangeText = {(text: any) => setValue('email', text, true)}
                                value = {getValues().email}
                                iconLeft = {{name: 'envelope'}}
                                helperText = {{message: errors.email?.message ? errors.email.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourPassword}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password', text, true)}
                                value = {getValues().password}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password?.message ? errors.password.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourConfirmPassword}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password_confirm', text, true)}
                                value = {getValues().password_confirm}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password_confirm?.message ? errors.password_confirm.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourPhone}
                                placeholderLabel = "+60 00 0000 0000"
                                mask = {"+60 [00] [0000] [9999]"}
                                inputProps = {{keyboardType: 'phone-pad'}}
                                onChangeText = {(text: any) => setValue('phone', text, true)}
                                value = {getValues().phone}
                                iconLeft = {{name: 'phone'}}
                                helperText = {{message: errors.phone?.message ? errors.phone.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.ReferenceCode + ' (' + MyLANG.Optional + ')'}
                                onChangeText = {(text: any) => setValue('reference_code', text, true)}
                                value = {getValues().reference_code}
                                iconLeft = {{name: 'present'}}
                                helperText = {{message: errors.reference_code?.message ? errors.reference_code.message : null}}
                            />

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.Register}
                                linearGradientStyle = {{marginTop: MyStyle.marginButtonTop}}
                                onPress = {(e: any) => {
                                    formSubmit(e);
                                }}
                            />

                            <Text style = {styles.textOrConnectUsing}>
                                {MyLANG.OrRegisterUsing}
                            </Text>
                            <View style = {[MyStyle.RowCenter, {marginTop: 7}]}>
                                <MyButton
                                    color = {MyStyle.LGButtonFacebook}
                                    textTransform = "capitalize"
                                    iconLeft = {{fontFamily: MyConstant.VectorIcon.Fontisto, name: 'facebook'}}
                                    linearGradientStyle = {{marginRight: 7}}
                                    title = {MyLANG.Facebook}
                                    onPress = {MyFunction.loginFacebook}
                                />
                                <MyButton
                                    color = {MyStyle.LGButtonGoogle}
                                    textTransform = "capitalize"
                                    iconLeft = {{fontFamily: MyConstant.VectorIcon.Fontisto, name: 'google'}}
                                    linearGradientStyle = {{marginLeft: 7}}
                                    title = {MyLANG.Google}
                                    onPress = {MyFunction.loginGoogle}
                                />
                            </View>

                            <View style = {[MyStyle.RowCenter, {marginTop: 44}]}>
                                <Text style = {styles.textAlreadyHaveAccount}>
                                    {MyLANG.AlreadyHaveAnAccount}
                                </Text>
                                <TouchableOpacity
                                    activeOpacity = {0.7}
                                    onPress = {
                                        () => MyUtil.commonAction(false,
                                                                  null,
                                                                  MyConstant.CommonAction.goBack,
                                                                  null,
                                                                  null,
                                                                  null
                                        )
                                    }
                                >
                                    <Text style = {styles.textSignIn}>
                                        {MyLANG.SignIn}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        </Fragment>
    );
};

SignupScreen.navigationOptions = {};

export default SignupScreen;

const styles = StyleSheet.create(
    {
        imageLogo              : {
            width : MyStyle.screenWidth * 0.60,
            height: (MyStyle.screenWidth * 0.60) / (1024 / 249),

            marginTop: 24,
        },
        textRegister           : {
            alignSelf: "flex-start",
            ...MyStyleSheet.headerPageLarge
        },
        textRegisterDescription: {
            marginTop   : 2,
            marginBottom: 24,
            alignSelf   : "flex-start",
            ...MyStyleSheet.subHeaderPage
        },
        textOrConnectUsing     : {
            marginTop   : 32,
            marginBottom: 7,
            ...MyStyleSheet.subHeaderPage
        },
        textAlreadyHaveAccount : {
            ...MyStyleSheet.subHeaderPage,
            color: MyColor.textDarkPrimary,
        },
        textSignIn             : {
            ...MyStyleSheet.subHeaderPage,
            paddingLeft: 5,
            fontFamily : MyStyle.FontFamily.Roboto.medium,
            color      : MyColor.Primary.first,
        },
    }
);

