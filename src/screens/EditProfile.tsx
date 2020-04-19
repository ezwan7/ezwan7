import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView, StyleSheet,
} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {StatusBarLight} from '../components/MyComponent';

import * as yup from "yup";
import {useForm} from "react-hook-form";
import {MyInput} from "../components/MyInput";
import {MyButton} from "../components/MyButton";
import {useSelector} from "react-redux";

let renderCount = 0;

const UserFormSchema: any = yup.object().shape(
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
                             .min(4, MyLANG.Code + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                             .max(24, MyLANG.Code + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
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
    });

const passwordFormSchema: any = yup.object().shape(
    {
        password_current    : yup.string()
                                 .required(MyLANG.CurrentPassword + ' ' + MyLANG.isRequired)
                                 .min(4, MyLANG.Code + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                                 .max(24, MyLANG.Code + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
        password_new        : yup.string()
                                 .required(MyLANG.NewPassword + ' ' + MyLANG.isRequired)
                                 .min(4, MyLANG.Code + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                                 .max(24, MyLANG.Code + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
        password_new_confirm: yup.string()
                                 .required(MyLANG.ConfirmNewPassword + ' ' + MyLANG.isRequired)
                                 .min(4, MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                                 .max(24, MyLANG.ConfirmPassword + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character)
                                 .oneOf([yup.ref('password_new'), null], MyLANG.PasswordMustMatch),
    });

const EditProfile = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${EditProfile.name}. renderCount: `, {renderCount});
    }

    const user: any = useSelector((state: any) => state.auth.user);

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            validationSchema    : passwordFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${EditProfile.name}. useEffect: `, {user});

        for (const key of Object.keys(passwordFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register]);

    const formSubmit = async (e: any) => {

        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);

        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});

        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
            const response: any = await MyUtil
                .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, MyAPI.password_change,
                        {
                            'language_id' : MyConfig.LanguageActive,
                            'customers_id': user?.id,
                            'oldpassword' : formValue.data.password_current,
                            'newpassword' : formValue.data.password_new,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, MyLANG.PleaseWait + '...', true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.password_change, 'response': response
            });

            if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.data) {

                const data = response.data?.data;
                if (data?.success === '1') {

                    reset();
                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.PasswordUpdated, false);

                } else {
                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, data?.message ? data?.message : MyLANG.UnknownError, false);


                }
            } else {

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.UnknownError, false);
            }

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };

    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted}}
                    >

                        <View style = {editProfile.viewProfileSection}>
                            <Text style = {[{...MyStyleSheet.headerPageMedium, marginBottom: MyStyle.marginVerticalList}]}>
                                {MyLANG.EditProfile}
                            </Text>
                            <Text style = {editProfile.textEditProfile}>
                                {MyLANG.EditProfileDesc}
                            </Text>

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.UpdateProfile}
                                linearGradientStyle = {{marginTop: MyStyle.marginButtonTop, marginBottom: MyStyle.marginButtonBottom}}
                                onPress = {(e: any) => {

                                }}
                            />
                        </View>

                        <View style = {editProfile.viewCurrentPasswordSection}>
                            <Text style = {[{...MyStyleSheet.headerPageMedium, marginBottom: MyStyle.marginVerticalList}]}>
                                {MyLANG.ChangePassword}
                            </Text>

                            <Text style = {editProfile.textCurrentPassword}>
                                {MyLANG.ChangePasswordCurrent}
                            </Text>
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourPassword}
                                floatingLabelBackground = {MyColor.Material.WHITE}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password_current', text, true)}
                                value = {getValues().password_current}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password_current?.message ? errors.password_current.message : null}}
                            />

                            <Text style = {editProfile.viewNewPasswordSection}>
                                {MyLANG.ChangePasswordNew}
                            </Text>
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourPassword}
                                floatingLabelBackground = {MyColor.Material.WHITE}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password_new', text, true)}
                                value = {getValues().password_new}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password_new?.message ? errors.password_new.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourConfirmPassword}
                                floatingLabelBackground = {MyColor.Material.WHITE}
                                inputProps = {{secureTextEntry: true}}
                                onChangeText = {(text: any) => setValue('password_new_confirm', text, true)}
                                value = {getValues().password_new_confirm}
                                iconLeft = {{name: 'lock'}}
                                iconRight = {{name: 'eye'}}
                                iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                helperText = {{message: errors.password_new_confirm?.message ? errors.password_new_confirm.message : null}}
                            />

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.ChangePassword}
                                linearGradientStyle = {{marginTop: MyStyle.marginButtonTop, marginBottom: MyStyle.marginButtonBottom}}
                                onPress = {(e: any) => {
                                    formSubmit(e);
                                }}
                            />
                        </View>

                    </ScrollView>

                </View>

            </SafeAreaView>
        </Fragment>
    )
}

EditProfile.navigationOptions = {}

const editProfile = StyleSheet.create(
    {
        viewProfileSection: {
            paddingHorizontal: MyStyle.paddingHorizontalPage,
            paddingVertical  : MyStyle.paddingVerticalPage,

            marginBottom: MyStyle.marginViewGapCard,

            backgroundColor: MyColor.Material.WHITE,
        },
        textEditProfile   : {
            ...MyStyleSheet.subHeaderPage
        },

        viewCurrentPasswordSection: {
            paddingHorizontal: MyStyle.paddingHorizontalPage,
            paddingVertical  : MyStyle.paddingVerticalPage,

            marginBottom: MyStyle.marginVerticalList,

            backgroundColor: MyColor.Material.WHITE,
        },
        textCurrentPassword       : {
            ...MyStyleSheet.subHeaderPage
        },
        viewNewPasswordSection    : {
            marginTop: MyStyle.marginVerticalList,
            ...MyStyleSheet.subHeaderPage
        },
    }
)

export default EditProfile;

