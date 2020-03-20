import {CommonActions} from '@react-navigation/native';

let _navigator: any;

const setTopLevelNavigator = (navigatorRef: any) => {
    _navigator = navigatorRef;
}

const navigate = (routeName: any, params: any) => {

    _navigator.dispatch(
        CommonActions.navigate(
            routeName,
            params
        )
    )
}

const goBack = () => {

    _navigator.dispatch(
        CommonActions.goBack()
    )
}

const reset = (index: any, routes: any) => {

    _navigator.dispatch(
        CommonActions.reset({index, routes})
    )
}

const setParams = (params: any) => {

    _navigator.dispatch(
        CommonActions.setParams(params)
    )
}

export default {
    navigate,
    goBack,
    reset,
    setParams,
    setTopLevelNavigator,
};
