import React, {Fragment, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useFocusEffect} from "@react-navigation/native";
import {useSelector} from "react-redux";

import {View, Text, SafeAreaView, ScrollView} from 'react-native';

import MyUtil from '../common/MyUtil';
import {MyStyle, MyStyleSheet} from '../common/MyStyle';
import MyColor from '../common/MyColor';
import MyImage from '../shared/MyImage';
import {MyAPI, MyConfig} from '../shared/MyConfig';
import MyLANG from '../shared/MyLANG';
import {MyConstant} from '../common/MyConstant';
import MyIcon from '../components/MyIcon';

import {ButtonPageFotter, StatusBarLight} from '../components/MyComponent';
import {MyButton} from "../components/MyButton";
import {MyInput} from "../components/MyInput";

import {Switch} from 'react-native-paper';
import {ShadowBox} from "react-native-neomorph-shadows";
import * as yup from "yup";
import MyFunction from "../shared/MyFunction";
import MyMaterialRipple from "../components/MyMaterialRipple";
import LinearGradient from "react-native-linear-gradient";


let renderCount = 0;

const addressFormSchema: any = yup.object().shape(
    {
        id            : yup.number()
                           .max(14, MyLANG.ID + ' ' + MyLANG.mustBeMaximum + ' 14 ' + MyLANG.character),
        address_title : yup.string()
                           .required(MyLANG.AddressTitle + ' ' + MyLANG.isRequired)
                           .min(2, MyLANG.AddressTitle + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                           .max(32, MyLANG.AddressTitle + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character),
        full_name     : yup.string()
                           .required(MyLANG.FullName + ' ' + MyLANG.isRequired)
                           .min(2, MyLANG.FullName + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                           .max(32, MyLANG.FullName + ' ' + MyLANG.mustBeMaximum + ' 32 ' + MyLANG.character),
        phone         : yup.string()
                           .required(MyLANG.PhoneNumber + ' ' + MyLANG.isRequired)
                           .min(5, MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMinimum + ' 5 ' + MyLANG.character)
                           .max(16, MyLANG.PhoneNumber + ' ' + MyLANG.mustBeMaximum + ' 16 ' + MyLANG.character)
                           .matches(MyConstant.Validation.phone, MyLANG.InvalidPhone),
        street_address: yup.string()
                           .required(MyLANG.StreetAddress + ' ' + MyLANG.isRequired)
                           .min(2, MyLANG.StreetAddress + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                           .max(256, MyLANG.StreetAddress + ' ' + MyLANG.mustBeMaximum + ' 256 ' + MyLANG.character),
        country       : yup.object()
                           .required(MyLANG.Country + ' ' + MyLANG.isRequired),
        state         : yup.object()
                           .required(MyLANG.State + ' ' + MyLANG.isRequired),
        city          : yup.string()
                           .required(MyLANG.City + ' ' + MyLANG.isRequired)
                           .min(2, MyLANG.City + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                           .max(256, MyLANG.City + ' ' + MyLANG.mustBeMaximum + ' 256 ' + MyLANG.character),
        postal_code   : yup.string()
                           .required(MyLANG.PostalCode + ' ' + MyLANG.isRequired)
                           .min(2, MyLANG.PostalCode + ' ' + MyLANG.mustBeMinimum + ' 2 ' + MyLANG.character)
                           .max(128, MyLANG.PostalCode + ' ' + MyLANG.mustBeMaximum + ' 128 ' + MyLANG.character),
        note          : yup.string()
                           .max(512, MyLANG.Note + ' ' + MyLANG.mustBeMaximum + ' 512 ' + MyLANG.character),
        is_default    : yup.bool(),
        location      : yup.object(),
    }
);

let defaultValues: any = {
    id            : null,
    address_title : null,
    full_name     : null,
    phone         : null,
    street_address: null,
    country       : null,
    state         : null,
    city          : null,
    postal_code   : null,
    note          : null,
    is_default    : null,
    location      : null,
}

const MyAddressForm = ({route, navigation}: any) => {

    if (__DEV__) {
        renderCount += 1;
        MyUtil.printConsole(true, 'log', `LOG: ${MyAddressForm.name}. renderCount: `, {renderCount});
    }

    const user: any = useSelector((state: any) => state.auth.user);

    const countries: any = useSelector((state: any) => state.app_input?.countries);

    const [pageType, setPageType]: any = useState(null);

    useFocusEffect(
        useCallback(() => {

            MyUtil.printConsole(true, 'log', `LOG: ${MyAddressForm.name}. useFocusEffect: `, route?.params);

            // Populate Select Dropdown from Country or State Option Page:
            if (route?.params?.setValue?.name && route?.params?.setValue?.key && route?.params?.value?.id) {
                setValue(route.params.setValue.name, route.params.value, route.params.setValue.shouldValidate);
                if (route?.params?.resetValue?.length > 0) {
                    for (const [index, reset] of route?.params?.resetValue.entries()) {
                        setValue(reset.name, reset.value, reset.shouldValidate);
                    }
                }
            }

            // Populate Location Data from Google Map Page:
            if (route?.params?.location?.longitude && route?.params?.location?.longitude && route?.params?.location?.address) {

                populateAddress(route?.params?.location);
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params])
    );

    useEffect(() => {

        if (route?.params?.title) {
            navigation.setOptions(
                {
                    title: route?.params?.title,
                })
        }

        if (route?.params?.pageType) {
            setPageType(route?.params?.pageType);
        }

        // Populate for Edit Address:
        const item = route?.params?.item;
        if (route?.params?.pageType === 'EDIT' && item?.countries_id) {
            const country_find = countries.find((e: any) => e.id === item?.countries_id);
            if (country_find?.id) {
                if (item?.zone_name) {
                    populateState(country_find, item?.zone_name);
                } else {
                    setValue('country', country_find, true);
                    setValue('state', {}, true);
                }
            } else {
                setValue('country', {}, true);
            }
        }

        MyUtil.printConsole(true, 'log', `LOG: ${MyAddressForm.name}. useEffect: `, {countries, params: route?.params});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {register, getValues, setValue, handleSubmit, formState, errors, reset, triggerValidation, watch}: any = useForm(
        {
            mode                : 'onSubmit',
            reValidateMode      : 'onChange',
            defaultValues       : route?.params?.pageType === 'EDIT' ? {
                id            : route?.params?.item?.address_id,
                address_title : route?.params?.item?.company,
                full_name     : route?.params?.item?.firstname + ' ' + route?.params?.item?.lastname,
                phone         : route?.params?.item?.phone,
                street_address: route?.params?.item?.street,
                // country       : null,
                // state         : null,
                city          : route?.params?.item?.city,
                postal_code   : route?.params?.item?.postcode,
                note          : route?.params?.item?.note,
                is_default    : route?.params?.item?.default_address === route?.params?.item?.address_id ? true : false,
                // location      : null,
            } : {},
            validationSchema    : addressFormSchema,
            validateCriteriaMode: 'all',
            submitFocusError    : true,
        }
    );

    useEffect(() => {
        MyUtil.printConsole(true, 'log', `LOG: ${MyAddressForm.name}. useEffect: `, 'register');

        for (const key of Object.keys(addressFormSchema['fields'])) {
            if (key) {
                register({name: key});
            }
        }

    }, [register]);

    const values                       = getValues();
    const {country, state, is_default} = watch(['country', 'state', 'is_default']);

    const openGoogleMap = () => {
        MyUtil.commonAction(false,
                            navigation,
                            MyConstant.CommonAction.navigate,
                            MyConfig.routeName.GoogleMap,
                            {
                                mapPageSource: MyConstant.MapPageSource.current_location,
                                location     : {
                                    // latitude : 23.8103,
                                    // longitude: 90.4125,
                                    // formatted_address: 'petronas twin towers',
                                },
                                onSubmit     : {
                                    type     : MyConstant.MapPageOnSubmit.select_and_GO_BACK,
                                    routeName: MyConfig.routeName.MyAddressForm,
                                }
                            },
                            null
        );

        route.params = null;
    }

    const populateAddress = async (location: any) => {

        const street_address: any = location?.address?.street_number?.length > 0 && location?.address?.street?.length > 0 ? (location.address.street_number + ', ' + location.address.street) : location?.address?.street_number?.length > 0 ? location.address.street_number : location?.address?.street?.length > 0 ? location.address.street : '';

        setValue('street_address', street_address, true);
        setValue('city', location?.address?.city, true);
        setValue('postal_code', location?.address?.postal_code, true);
        setValue('location', location, true);

        if (location?.address?.country) {
            const country_find = countries.find((e: any) => e.countries_name === location?.address?.country);
            if (country_find?.id) {
                if (location?.address?.state) {
                    populateState(country_find, location?.address?.state);
                } else {
                    setValue('country', country_find, true);
                }
            }
        }
    }

    const populateState = async (country_find: any, state: any) => {

        const states = await MyFunction.fetchStates(country_find.id);

        if (states?.length > 0) {
            const state_find = states.find((e: any) => e.zone_name === state);

            if (state_find?.id) {
                setValue('country', {...country_find, states: states}, false);
                setValue('state', state_find, true);

            } else {
                setValue('country', country_find, true);
                setValue('state', {}, true);
            }

        } else {
            setValue('country', country_find, true);
            setValue('state', {}, true);
        }
    }

    const onCountry = () => {
        if (countries?.length > 0) {
            MyUtil.commonAction(false,
                                navigation,
                                MyConstant.CommonAction.navigate,
                                MyConfig.routeName.OptionPage,
                                {
                                    title       : MyLANG.SelectCountry,
                                    allowSearch : true,
                                    items       : countries,
                                    listLimit   : MyConfig.ListLimit.optionList,
                                    listShow    : {
                                        image   : false,
                                        title   : 'countries_name',
                                        subTitle: false,
                                    },
                                    listSelected: values.country?.id,

                                    onItem: {
                                        type      : MyConstant.OptionPageOnItem.select_and_go_back,
                                        routeName : MyConfig.routeName.MyAddressForm,
                                        setValue  : {
                                            name          : 'country',
                                            key           : 'countries_name',
                                            shouldValidate: true,
                                        },
                                        resetValue: [
                                            {
                                                name          : 'state',
                                                value         : null,
                                                shouldValidate: false,
                                            }
                                        ]
                                    },
                                },
                                null
            );

            route.params = null;

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.CountryListNotFound, false);
        }
    }

    const onState = async () => {

        if (values?.country?.id > 0) {

            let states = values.country?.states;

            if (!states?.length) {

                states = await MyFunction.fetchStates(values.country.id);

                if (states?.length > 0) {
                    setValue('country', {...values.country, states: states}, false);

                } else {
                    return MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.StateListNotFound, false);
                }
            }

            MyUtil.commonAction(false,
                                navigation,
                                MyConstant.CommonAction.navigate,
                                MyConfig.routeName.OptionPage,
                                {
                                    title       : MyLANG.SelectState,
                                    allowSearch : false,
                                    items       : states,
                                    listLimit   : MyConfig.ListLimit.optionList,
                                    listShow    : {
                                        image   : false,
                                        title   : 'zone_name',
                                        subTitle: false,
                                    },
                                    listSelected: values.state?.id,

                                    onItem: {
                                        type     : MyConstant.OptionPageOnItem.select_and_go_back,
                                        routeName: MyConfig.routeName.MyAddressForm,
                                        setValue : {
                                            name          : 'state',
                                            key           : 'zone_name',
                                            shouldValidate: true,
                                        },
                                        // resetValue: {},
                                    },
                                },
                                null
            );

            route.params = null;

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.TOAST, MyLANG.PleaseSelectCountryFirst, false);
        }
    }

    const formSubmitAdd = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});

        if (formValue?.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {

            const address_string: string = MyUtil.generateAddress(null,
                                                                  formValue.data?.street_address,
                                                                  formValue.data?.city,
                                                                  formValue.data?.state?.zone_name,
                                                                  formValue.data?.country?.countries_name,
                                                                  formValue.data?.postal_code
            );
            const geocodeAddress: any    = await MyUtil.GeocodeAddress(address_string, MyLANG.PleaseWait + '...', false);
            MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: await-response: ', {'geocodeAddress': geocodeAddress});

            if (geocodeAddress?.type === MyConstant.RESPONSE.TYPE.data && geocodeAddress.data) {

                MyFunction.saveAddress(
                    {
                        apiUrl        : MyAPI.user_address_add,
                        user_id       : user?.id,
                        address_title : formValue.data?.address_title,
                        full_name     : formValue.data?.full_name,
                        phone         : formValue.data?.phone,
                        street_address: formValue.data?.street_address,
                        country       : formValue.data?.country?.id,
                        state         : formValue.data?.state?.id,
                        city          : formValue.data?.city,
                        postal_code   : formValue.data?.postal_code,
                        latitude      : geocodeAddress.data?.results?.[0].geometry?.location.lat,
                        longitude     : geocodeAddress.data?.results?.[0].geometry?.location.lng,
                        note          : formValue.data?.note,
                        is_default    : formValue.data?.is_default,
                    },
                    MyLANG.PleaseWait + '...',
                    {
                        'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                        'message'    : MyLANG.AddressAddedSuccessfully
                    },
                    {
                        'showMessage': MyConstant.SHOW_MESSAGE.ALERT,
                        'message'    : MyLANG.FailedToAddAddress
                    },
                    {
                        loginRequired: true,
                        navigation   : navigation,
                        actionType   : MyConstant.NAVIGATION_ACTIONS.NAVIGATE,
                        routeName    : MyConfig.routeName.MyAddress,
                        params       : {'fetchAddress': true},
                    },
                );

            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.InvalidAddress, false);
            }

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };

    const formSubmitEdit = async (e: any) => {
        const formValue: any = await MyUtil.formProcess(e, getValues, handleSubmit, formState, errors);
        MyUtil.printConsole(true, 'log', 'LOG: formProcess: await-response: ', {'formValue': formValue});

        if (formValue?.type === MyConstant.RESPONSE.TYPE.data && formValue.data) {

            const address_string: string = MyUtil.generateAddress(null,
                                                                  formValue.data?.street_address,
                                                                  formValue.data?.city,
                                                                  formValue.data?.state?.zone_name,
                                                                  formValue.data?.country?.countries_name,
                                                                  formValue.data?.postal_code
            );
            const geocodeAddress: any    = await MyUtil.GeocodeAddress(address_string, MyLANG.PleaseWait + '...', false);
            MyUtil.printConsole(true, 'log', 'LOG: GeocodeAddress: await-response: ', {'geocodeAddress': geocodeAddress});

            if (geocodeAddress?.type === MyConstant.RESPONSE.TYPE.data && geocodeAddress.data) {

                MyFunction.updateAddress(
                    {
                        apiUrl        : MyAPI.user_address_edit,
                        id            : formValue.data?.id,
                        user_id       : user?.id,
                        address_title : formValue.data?.address_title,
                        full_name     : formValue.data?.full_name,
                        phone         : formValue.data?.phone,
                        street_address: formValue.data?.street_address,
                        country       : formValue.data?.country?.id,
                        state         : formValue.data?.state?.id,
                        city          : formValue.data?.city,
                        postal_code   : formValue.data?.postal_code,
                        latitude      : geocodeAddress.data?.results?.[0].geometry?.location.lat,
                        longitude     : geocodeAddress.data?.results?.[0].geometry?.location.lng,
                        note          : formValue.data?.note,
                        is_default    : formValue.data?.is_default,
                    },
                    MyLANG.PleaseWait + '...',
                    {
                        'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                        'message'    : MyLANG.AddressUpdatedSuccessfully
                    },
                    {
                        'showMessage': MyConstant.SHOW_MESSAGE.ALERT,
                        'message'    : MyLANG.FailedToUpdateAddress
                    },
                    {
                        loginRequired: true,
                        navigation   : navigation,
                        actionType   : MyConstant.NAVIGATION_ACTIONS.NAVIGATE,
                        routeName    : MyConfig.routeName.MyAddress,
                        params       : {'fetchAddress': true},
                    },
                );

            } else {
                MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT, MyLANG.InvalidAddress, false);
            }

        } else {
            MyUtil.showMessage(MyConstant.SHOW_MESSAGE.ALERT,
                               formValue.errorMessage ? formValue.errorMessage : MyLANG.FormInvalid,
                               false
            );
        }
    };

    const onDeleteAddress = async (e: any) => {

        MyUtil.showAlert(MyLANG.Attention, MyLANG.AddressDeleteAlert, false, [
            {
                text   : MyLANG.No,
                style  : 'cancel',
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'Cancel');
                },
            },
            {
                text   : MyLANG.Yes,
                onPress: () => {
                    MyUtil.printConsole(true, 'log', 'LOG: showAlert: ', 'OK');

                    MyFunction.deleteAddress(
                        {
                            apiUrl : MyAPI.user_address_delete,
                            user_id: user?.id,
                            id     : values?.id,
                        },
                        MyLANG.PleaseWait + '...',
                        {
                            'showMessage': MyConstant.SHOW_MESSAGE.TOAST,
                            'message'    : MyLANG.AddressDeletedSuccessfully
                        },
                        {
                            'showMessage': MyConstant.SHOW_MESSAGE.ALERT,
                            'message'    : MyLANG.FailedToDeleteAddress
                        },
                        {
                            loginRequired: true,
                            navigation   : navigation,
                            actionType   : MyConstant.NAVIGATION_ACTIONS.NAVIGATE,
                            routeName    : MyConfig.routeName.MyAddress,
                            params       : {'fetchAddress': true},
                        },
                    );
                }
            },
        ])


    };


    return (
        <Fragment>
            <StatusBarLight/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView1}/>
            <SafeAreaView style = {MyStyleSheet.SafeAreaView2}>
                <View style = {[MyStyleSheet.SafeAreaView3, {backgroundColor: MyColor.backgroundGrey}]}>

                    <ScrollView
                        contentInsetAdjustmentBehavior = "automatic"
                        contentContainerStyle = {{paddingTop: MyStyle.headerHeightAdjusted, flexGrow: 1}}
                    >

                        <View style = {[MyStyleSheet.viewPageCard, {marginTop: MyStyle.marginViewGapCard}]}>

                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.AddressTitle}
                                floatingLabelFloated = {true}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                placeholderLabel = {MyLANG.AddressTitleDescription}
                                onChangeText = {(text: any) => setValue('address_title', text, true)}
                                value = {values.address_title}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                helperText = {{message: errors.address_title?.message ? errors.address_title.message : null}}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.FullName}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                onChangeText = {(text: any) => setValue('full_name', text, true)}
                                value = {values.full_name}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                helperText = {{message: errors.full_name?.message ? errors.full_name.message : null}}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.Phone}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                placeholderLabel = "+60 00 0000 0000"
                                mask = {"+60 [00] [0000] [9999]"}
                                inputProps = {{keyboardType: 'phone-pad'}}
                                onChangeText = {(text: any) => setValue('phone', text, true)}
                                value = {values.phone}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                helperText = {{message: errors.phone?.message ? errors.phone.message : null}}
                            />

                        </View>

                        <View style = {MyStyleSheet.viewPageCard}>

                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.StreetAddress}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                onChangeText = {(text: any) => setValue('street_address', text, true)}
                                value = {values.street_address}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                helperText = {{message: errors.street_address?.message ? errors.street_address.message : null}}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.Country}
                                floatingLabelFloated = {true}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                placeholderLabel = {MyLANG.CountryDescription}
                                inputProps = {{
                                    editable: false,
                                }}
                                value = {country?.countries_name}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                iconRight = {{fontFamily: MyConstant.VectorIcon.Entypo, name: 'chevron-right'}}
                                helperText = {{message: errors.country?.message ? errors.country.message : null}}
                                onPress = {onCountry}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.State}
                                floatingLabelFloated = {true}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                placeholderLabel = {MyLANG.StateDescription}
                                inputProps = {{
                                    editable: false,
                                }}
                                value = {state?.zone_name}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                iconRight = {{fontFamily: MyConstant.VectorIcon.Entypo, name: 'chevron-right'}}
                                helperText = {{message: errors.state?.message ? errors.state.message : null}}
                                onPress = {onState}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.City}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                onChangeText = {(text: any) => setValue('city', text, true)}
                                value = {values.city}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                helperText = {{message: errors.city?.message ? errors.city.message : null}}
                            />
                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.PostalCode}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                onChangeText = {(text: any) => setValue('postal_code', text, true)}
                                value = {values.postal_code}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                helperText = {{message: errors.postal_code?.message ? errors.postal_code.message : null}}
                            />

                        </View>

                        <MyMaterialRipple
                            style = {[MyStyleSheet.viewPageCard, MyStyle.RowStartCenter]}
                            {...MyStyle.MaterialRipple.drawer}
                            onPress = {openGoogleMap}
                        >
                            <MyIcon.Fontisto
                                name = "map-marker-alt"
                                size = {26}
                                color = {MyColor.attentionDark}
                                style = {{}}
                            />
                            <View style = {[MyStyle.ColumnCenterStart, {flex: 1, marginHorizontal: 14}]}>
                                <Text style = {[MyStyleSheet.textListItemTitleDark]}>
                                    {MyLANG.SelectLocation}
                                </Text>
                                <Text style = {[MyStyleSheet.textListItemSubTitle]}>
                                    {MyLANG.SelectLocationDesc}
                                </Text>
                            </View>
                            <MyIcon.Entypo
                                name = "chevron-right"
                                size = {20}
                                color = {MyColor.Material.GREY["800"]}
                                style = {{}}
                            />
                        </MyMaterialRipple>

                        <View style = {MyStyleSheet.viewPageCard}>

                            <MyInput
                                mode = "line"
                                floatingLabel = {MyLANG.Note}
                                floatingLabelFloated = {true}
                                readyBorderColor = {{borderColor: MyColor.Primary.first}}
                                placeholderLabel = {MyLANG.AddressNoteDescription}
                                onChangeText = {(text: any) => setValue('note', text, true)}
                                value = {values.note}
                                viewStyle = {{borderColor: MyColor.Material.GREY["300"]}}
                                viewGroupStyle = {{marginTop: 10}}
                                helperText = {{message: errors.note?.message ? errors.note.message : null}}
                            />

                        </View>

                        <View style = {[MyStyleSheet.viewPageCard, MyStyle.RowBetweenCenter]}>
                            <Text style = {MyStyleSheet.textListItemTitleDark}>{MyLANG.SetAsDefaultAddress}</Text>
                            <Switch
                                onValueChange = {() => setValue('is_default', !values.is_default, true)}
                                value = {is_default}
                                color = {MyColor.Primary.first}
                            />
                        </View>

                        {pageType === 'EDIT' &&
                         <MyMaterialRipple
                             style = {[MyStyleSheet.viewPageCard, MyStyle.RowBetweenCenter, {marginTop: 15}]}
                             {...MyStyle.MaterialRipple.drawer}
                             onPress = {onDeleteAddress}
                         >
                             <Text style = {[MyStyleSheet.textListItemTitleDark]}>{MyLANG.DeleteAddress}</Text>
                             <MyIcon.FontAwesome5
                                 name = "trash"
                                 size = {20}
                                 color = {MyColor.attentionDark}
                                 style = {{}}
                             />
                         </MyMaterialRipple>
                        }
                    </ScrollView>

                    {pageType === 'NEW' &&
                     <ButtonPageFotter
                         title = {MyLANG.AddAddress}
                         onPress = {(e: any) => {
                             formSubmitAdd(e);
                         }}
                     />
                    }
                    {pageType === 'EDIT' &&
                     <ButtonPageFotter
                         title = {MyLANG.EditAddress}
                         onPress = {(e: any) => {
                             formSubmitEdit(e);
                         }}
                     />
                    }

                </View>

            </SafeAreaView>
        </Fragment>
    )
}

MyAddressForm.navigationOptions = {}

export default MyAddressForm;

