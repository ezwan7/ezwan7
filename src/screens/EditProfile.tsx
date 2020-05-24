import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';

import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Image,
    Modal,
    TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import * as yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {store} from "../store/MyStore";

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {StatusBarDark, StatusBarGradientPrimary} from '../components/MyComponent';
import {useForm} from "react-hook-form";
import {MyInput} from "../components/MyInput";
import {MyButton} from "../components/MyButton";
import {useSelector} from "react-redux";
import {MyFastImage} from "../components/MyFastImage";
import {updateUser} from "../store/AuthRedux";
import MyFunction from "../shared/MyFunction";

import {RadioButton} from 'react-native-paper';
import MyMaterialRipple from "../components/MyMaterialRipple";
import {MyModal} from "../components/MyModal";
import {ModalNotFullScreen, ModalRadioList} from "../shared/MyContainer";

let renderCount = 0;


const userFormSchema: any = yup.object().shape(
    {
        first_name   : yup.string()
                          .required(MyLANG.FirstName + ' ' + MyLANG.isRequired)
                          .min(2, MyLANG.FirstName + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                          .max(32, MyLANG.FirstName + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character),
        last_name    : yup.string()
                          .required(MyLANG.LastName + ' ' + MyLANG.isRequired)
                          .min(2, MyLANG.LastName + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                          .max(32, MyLANG.LastName + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character),
        email        : yup.string()
                          .required(MyLANG.Email + ' ' + MyLANG.isRequired)
                          .min(2, MyLANG.Email + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                          .max(64, MyLANG.Email + ' ' + MyLANG.mustBeMaximum + ' 64 ' + MyLANG.character)
                          .email(MyLANG.InvalidEmail),
        phone        : yup.string()
                          .required(MyLANG.PhoneNumber + ' ' + MyLANG.isRequired)
                          .min(5, MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMinimum + ' 5 ' + MyLANG.character)
                          .max(16, MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMaximum + ' 16 ' + MyLANG.character)
                          .matches(MyConstant.Validation.phone, MyLANG.InvalidPhone),
        date_of_birth: yup.object(),
        gender       : yup.object(),
    });

const passwordFormSchema: any = yup.object().shape(
    {
        password_current    : yup.string()
                                 .required(MyLANG.CurrentPassword + ' ' + MyLANG.isRequired)
                                 .min(4, MyLANG.CurrentPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                                 .max(24, MyLANG.CurrentPassword + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
        password_new        : yup.string()
                                 .required(MyLANG.NewPassword + ' ' + MyLANG.isRequired)
                                 .min(4, MyLANG.NewPassword + ' ' + MyLANG.mustBeMinimum + ' 4 ' + MyLANG.character)
                                 .max(24, MyLANG.NewPassword + ' ' + MyLANG.mustBeMaximum + ' 24 ' + MyLANG.character),
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

    const [isDatePickerVisible, setDatePickerVisibility]      = useState(false);
    const [modalVisible, setModalVisible]                     = useState(false);
    const [modalVisibleFileSource, setModalVisibleFileSource] = useState(false);

    const {register, getValues, setValue, handleSubmit, formState, errors, watch}: any                                                                                                                                                            = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            // defaultValues       : defaultValues,
            validationSchema    : userFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );
    const {register: registerPasswordForm, getValues: getValuesPasswordForm, setValue: setValuePasswordForm, handleSubmit: handleSubmitPasswordForm, formState: formStatePasswordForm, errors: errorsPasswordForm, reset: resetPasswordForm}: any = useForm(
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

        MyUtil.printConsole(true, 'log', `LOG: ${EditProfile.name}. useEffect: register: `, '');

        for (const key of Object.keys(userFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userFormSchema]);

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${EditProfile.name}. useEffect: registerPasswordForm: `, '');

        for (const key of Object.keys(passwordFormSchema['fields'])) {
            if (key) {
                registerPasswordForm({name: key});
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerPasswordForm]);

    const userFormValue                = getValues();
    const {date_of_birth, gender}: any = watch(['date_of_birth', 'gender']);
    const passwordFormValue            = getValuesPasswordForm();

    useEffect(() => {

        MyUtil.printConsole(true, 'log', `LOG: ${EditProfile.name}. useEffect: `, {user});

        /*for (const key of Object.keys(userFormSchema['fields'])) {
            if (key) {
                setValue(key, user[user], true);
            }
        }*/
        setValue('first_name', user.customers_firstname, false);
        setValue('last_name', user.customers_lastname, false);
        setValue('email', user.email, false);
        setValue('phone', user.customers_telephone, false);
        if (user?.customers_dob) {
            const dob = new Date(user.customers_dob);
            setValue('date_of_birth', {
                value       : dob,
                formatted   : MyUtil.momentFormat(dob, MyConstant.MomentFormat["1st Jan, 1970"]),
                db_formatted: MyUtil.momentFormat(dob, MyConstant.MomentFormat["1970-01-01"])
            }, false);
        }
        if (user?.customers_gender) {
            const gender_find: any = MyConfig.genderList.find((e: any) => Number(e?.id) === Number(user.customers_gender));
            setValue('gender', gender_find, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const formSubmit = async (e: any) => {

        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);

        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});

        if (formValue && formValue.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {
            const response: any = await MyUtil
                .myHTTP({required: true, promptLogin: true}, MyConstant.HTTP_POST, MyAPI.update_profile,
                        {
                            'language_id': MyConfig.LanguageActive,

                            'customers_id'       : user?.id,
                            'customers_firstname': formValue.data.first_name,
                            'customers_lastname' : formValue.data.last_name,
                            'email'              : formValue.data.email,
                            'customers_telephone': formValue.data.phone,
                            'customers_dob'      : formValue.data.date_of_birth?.db_formatted,
                            'customers_gender'   : formValue.data.gender?.id,

                            'app_ver'      : MyConfig.app_version,
                            'app_build_ver': MyConfig.app_build_version,
                            'platform'     : MyConfig.app_platform,
                            'device'       : null,
                        }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, MyLANG.PleaseWait + '...', true, false
                );

            MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
                'apiURL': MyAPI.update_profile, 'response': response
            });

            if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

                const data = response.data?.data?.data?.[0];
                if (data?.id > 0) {

                    store.dispatch(updateUser(data, 'all'));

                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.ProfileUpdated, false);

                } else {

                    MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, data?.message ? data?.message : MyLANG.UnknownError, false);
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

    const formSubmitPasswordForm = async (e: any) => {

        const formValue: any = await MyUtil.formProcess(e, getValuesPasswordForm, handleSubmitPasswordForm, formStatePasswordForm, errorsPasswordForm);

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

                    resetPasswordForm();
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

    const onModalItem = async (item: any) => {

        setModalVisibleFileSource(false);

        let response: any = null;

        switch (item?.key) {
            case 'Camera':
                response = await MyUtil.imagePicker(MyConfig.DefatulImagePickerOptions,
                                                    MyConstant.IMAGE_PICKER.OPEN_TYPE.Camera,
                                                    MyConstant.SHOW_MESSAGE.TOAST,
                )
                break;
            case 'Gallery':
                response = await MyUtil.imagePicker(MyConfig.DefatulImagePickerOptions,
                                                    MyConstant.IMAGE_PICKER.OPEN_TYPE.ImageLibrary,
                                                    MyConstant.SHOW_MESSAGE.TOAST,
                )
                break;
            default:
                break;
        }

        if (response) {

            MyUtil.printConsole(true, 'log', 'LOG: imagePicker: await-response: ', {'response': response});

            if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.data && response.data?.type && Number(response.data?.fileSize) > 0) {

                uploadProfilePhoto(response.data);

            }
        }
    };

    const uploadProfilePhoto = async (data: any) => {

        const response: any = await MyUtil
            .myHTTP(true, MyConstant.HTTP_POST, MyAPI.upload_profile_photo,
                    {
                        'language_id': MyConfig.LanguageActive,

                        'customers_id'     : user?.id,
                        'customers_picture': `data:${data?.type};base64,` + data?.data,

                        'app_ver'      : MyConfig.app_version,
                        'app_build_ver': MyConfig.app_build_version,
                        'platform'     : MyConfig.app_platform,
                        'device'       : null,
                    }, {}, false, MyConstant.HTTP_JSON, MyConstant.TIMEOUT.Medium, MyLANG.PleaseWait + '...', true, false
            );

        MyUtil.printConsole(true, 'log', 'LOG: myHTTP: await-response: ', {
            'apiURL': MyAPI.upload_profile_photo, 'response': response
        });

        if (response?.type === MyConstant.RESPONSE.TYPE.data && response.data?.status === 200 && response.data?.data?.success === '1') {

            const data = response.data?.data?.data?.[0];
            if (data?.id > 0) {

                store.dispatch(updateUser(data, 'all'));

                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.ProfilePhotoUploadedSuccessfully, false);
            }

        } else {

            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.FileUploadFailed, false);
        }

        /*MyFunction.uploadFile(
            {apiUrl: MyAPI.upload_profile_photo, user_id: user?.id, file: response.data},
            MyLANG.PleaseWait + '...',
            {
                'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                'message'    : MyLANG.ProfilePhotoUploadedSuccessfully
            },
            {
                'showMessage': MyConstant.SHOW_MESSAGE.ALERT,
                'message'    : MyLANG.FileUploadFailed
            }
        );*/
    };

    const openGenderModal = () => {
        MyUtil.printConsole(true, 'log', `LOG: openGenderModal: `, {gender});

        setModalVisible(true);
    };

    const onGender = (item: any) => {

        setModalVisible(false);

        setValue('gender', item, false);

        MyUtil.printConsole(true, 'log', 'LOG: onGender: ', {item, gender});
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDatePicker = (date: any) => {
        hideDatePicker();
        setValue('date_of_birth', {
                     value       : date,
                     formatted   : MyUtil.momentFormat(date, MyConstant.MomentFormat["1st Jan, 1970"]),
                     db_formatted: MyUtil.momentFormat(date, MyConstant.MomentFormat["1970-01-01"])
                 }, true
        )
    };


    return (
        <Fragment>
            {MyStyle.platformOS === "ios" ? <StatusBarGradientPrimary/> : <StatusBarDark/>}
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <LinearGradient
                    style = {[MyStyleSheet.SafeAreaView3, {}]}
                    start = {MyStyle.LGWhitish.start}
                    end = {MyStyle.LGWhitish.end}
                    locations = {MyStyle.LGWhitish.locations}
                    colors = {MyStyle.LGWhitish.colors}
                >

                    <ScrollView contentInsetAdjustmentBehavior = "automatic">

                        <View style = {[MyStyleSheet.viewPageLogin, {
                            alignItems   : "center",
                            marginTop    : MyStyle.marginVerticalPage,
                            paddingBottom: MyStyle.paddingVerticalList
                        }]}>

                            <MyFastImage
                                source = {[user?.customers_picture?.length > 9 ? {'uri': user?.customers_picture} : MyImage.defaultAvatar, MyImage.defaultAvatar]}
                                style = {MyStyleSheet.imagePageCard}
                                resizeMode = "cover"
                            />
                            <MyButton
                                fill = "transparent"
                                color = {MyColor.Primary.first}
                                shadow = "none"
                                title = {MyLANG.ChangePhoto}
                                viewStyle = {{marginTop: 15}}
                                textStyle = {{fontFamily: MyStyle.FontFamily.OpenSans.semiBold}}
                                onPress = {() => setModalVisibleFileSource(true)}
                            />
                        </View>
                        <View style = {{height: MyStyle.marginViewGapCard, backgroundColor: MyColor.Material.WHITE}}></View>

                        <View style = {[MyStyleSheet.viewPageLogin, {}]}>
                            <Text style = {[{...MyStyleSheet.headerPageMedium, marginBottom: MyStyle.marginVerticalList}]}>
                                {MyLANG.EditProfile}
                            </Text>
                            <Text style = {editProfile.textEditProfile}>
                                {MyLANG.EditProfileDesc}
                            </Text>

                            <MyInput
                                floatingLabel = {MyLANG.EnterYourFirstName}
                                onChangeText = {(text: any) => setValue('first_name', text, true)}
                                value = {userFormValue.first_name}
                                iconLeft = {{name: 'user'}}
                                helperText = {{message: errors.first_name?.message ? errors.first_name.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourLastName}
                                onChangeText = {(text: any) => setValue('last_name', text, true)}
                                value = {userFormValue.last_name}
                                iconLeft = {{name: 'user'}}
                                helperText = {{message: errors.last_name?.message ? errors.last_name.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourEmail}
                                onChangeText = {(text: any) => setValue('email', text, true)}
                                value = {userFormValue.email}
                                iconLeft = {{name: 'envelope'}}
                                helperText = {{message: errors.email?.message ? errors.email.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.EnterYourPhone}
                                floatingLabelFloated = {true}
                                placeholderLabel = "+60 00 0000 0000"
                                mask = {"+60 [00] [0000] [9999]"}
                                inputProps = {{keyboardType: 'phone-pad'}}
                                onChangeText = {(text: any) => setValue('phone', text, true)}
                                value = {userFormValue.phone}
                                iconLeft = {{name: 'phone'}}
                                helperText = {{message: errors.phone?.message ? errors.phone.message : null}}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.SelectYourDateOfBirth}
                                inputProps = {{
                                    editable: false,
                                }}
                                value = {date_of_birth?.formatted}
                                iconLeft = {{name: 'calendar'}}
                                iconRight = {{fontFamily: MyConstant.VectorIcon.Entypo, name: 'chevron-down'}}
                                helperText = {{message: errors.date_of_birth?.message ? errors.date_of_birth.message : null}}
                                onPress = {showDatePicker}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.SelectYourGender}
                                inputProps = {{
                                    editable: false,
                                }}
                                value = {gender?.name}
                                iconLeft = {{name: 'symbol-female'}}
                                iconRight = {{fontFamily: MyConstant.VectorIcon.Entypo, name: 'chevron-down'}}
                                helperText = {{message: errors.gender?.message ? errors.gender.message : null}}
                                onPress = {openGenderModal}
                            />
                            <MyInput
                                floatingLabel = {MyLANG.ReferenceCode}
                                inputProps = {{editable: false}}
                                value = {user['reference_code']}
                                iconLeft = {{name: 'present'}}
                                helperText = {{message: errors.reference_code?.message ? errors.reference_code.message : null}}
                            />

                            <MyButton
                                color = {MyStyle.LGButtonPrimary}
                                title = {MyLANG.UpdateProfile}
                                viewStyle = {{marginTop: MyStyle.marginButtonTop, marginBottom: MyStyle.marginButtonBottom}}
                                onPress = {(e: any) => {
                                    formSubmit(e);
                                }}
                            />
                        </View>

                        {
                            user?.password?.length > 0 &&
                            <>
                                <View style = {{height: MyStyle.marginViewGapCard, backgroundColor: MyColor.Material.WHITE}}></View>

                                <View style = {[MyStyleSheet.viewPageLogin, {}]}>
                                    <Text style = {[{...MyStyleSheet.headerPageMedium, marginBottom: MyStyle.marginVerticalList}]}>
                                        {MyLANG.ChangePassword}
                                    </Text>

                                    <Text style = {editProfile.textCurrentPassword}>
                                        {MyLANG.ChangePasswordCurrent}
                                    </Text>
                                    <MyInput
                                        floatingLabel = {MyLANG.EnterYourCurrentPassword}
                                        inputProps = {{secureTextEntry: true}}
                                        onChangeText = {(text: any) => setValuePasswordForm('password_current', text, true)}
                                        value = {passwordFormValue.password_current}
                                        iconLeft = {{name: 'lock'}}
                                        iconRight = {{name: 'eye'}}
                                        iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                        helperText = {{message: errorsPasswordForm.password_current?.message ? errorsPasswordForm.password_current.message : null}}
                                    />

                                    <Text style = {editProfile.textNewPasswordSection}>
                                        {MyLANG.ChangePasswordNew}
                                    </Text>
                                    <MyInput
                                        floatingLabel = {MyLANG.EnterYourNewPassword}
                                        inputProps = {{secureTextEntry: true}}
                                        onChangeText = {(text: any) => setValuePasswordForm('password_new', text, true)}
                                        value = {passwordFormValue.password_new}
                                        iconLeft = {{name: 'lock'}}
                                        iconRight = {{name: 'eye'}}
                                        iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                        helperText = {{message: errorsPasswordForm.password_new?.message ? errorsPasswordForm.password_new.message : null}}
                                    />
                                    <MyInput
                                        floatingLabel = {MyLANG.ConfirmYourNewPassword}
                                        inputProps = {{secureTextEntry: true}}
                                        onChangeText = {(text: any) => setValuePasswordForm('password_new_confirm', text, true)}
                                        value = {passwordFormValue.password_new_confirm}
                                        iconLeft = {{name: 'lock'}}
                                        iconRight = {{name: 'eye'}}
                                        iconRightOnPress = {{type: MyConstant.InputIconRightOnPress.secureTextEntry}}
                                        helperText = {{message: errorsPasswordForm.password_new_confirm?.message ? errorsPasswordForm.password_new_confirm.message : null}}
                                    />

                                    <MyButton
                                        color = {MyStyle.LGButtonPrimary}
                                        title = {MyLANG.ChangePassword}
                                        viewStyle = {{marginTop: MyStyle.marginButtonTop, marginBottom: MyStyle.marginButtonBottom}}
                                        onPress = {(e: any) => {
                                            formSubmitPasswordForm(e);
                                        }}
                                    />
                                </View>
                            </>
                        }

                    </ScrollView>

                </LinearGradient>

                <DateTimePickerModal
                    isVisible = {isDatePickerVisible}
                    mode = "date"
                    date = {date_of_birth?.value}
                    onConfirm = {handleConfirmDatePicker}
                    onCancel = {hideDatePicker}
                />

                <MyModal
                    visible = {modalVisible}
                    onRequestClose = {() => setModalVisible(false)}
                    children = {
                        <ModalNotFullScreen
                            onRequestClose = {() => setModalVisible(false)}
                            children = {
                                <ModalRadioList
                                    title = {MyLANG.SelectGender}
                                    selected = {gender?.id}
                                    onItem = {(item: any) => onGender(item)}
                                    items = {MyConfig.genderList}
                                    subTitleText = "name"
                                    /*iconLeft = {[
                                        {
                                            fontFamily: MyConstant.VectorIcon.Ionicons,
                                            name      : 'ios-male',
                                            size      : 21,
                                        },
                                        {
                                            fontFamily: MyConstant.VectorIcon.Ionicons,
                                            name      : 'ios-female',
                                            size      : 21,
                                        },
                                        {
                                            fontFamily: MyConstant.VectorIcon.Ionicons,
                                            name      : 'ios-radio-button-off',
                                            size      : 21,
                                        },
                                    ]}*/
                                />
                            }
                        />
                    }
                />

                <MyModal
                    visible = {modalVisibleFileSource}
                    onRequestClose = {() => setModalVisibleFileSource(false)}
                    children = {
                        <ModalNotFullScreen
                            onRequestClose = {() => setModalVisibleFileSource(false)}
                            children = {
                                <ModalRadioList
                                    title = {MyLANG.SelectFileSource}
                                    onItem = {(item: any) => onModalItem(item)}
                                    items = {MyConfig?.fileSourceProfilePhto}
                                    titleText = "title"
                                    bodyText = "bodyText"
                                    radio = {false}
                                />
                            }
                        />
                    }
                />

            </SafeAreaView>
        </Fragment>
    )
}

EditProfile.navigationOptions = {}

const editProfile = StyleSheet.create(
    {
        textEditProfile: {
            ...MyStyleSheet.subHeaderPage,
        },

        textCurrentPassword   : {
            ...MyStyleSheet.subHeaderPage
        },
        textNewPasswordSection: {
            marginTop: MyStyle.marginVerticalList,
            ...MyStyleSheet.subHeaderPage
        },
    }
)

export default EditProfile;

