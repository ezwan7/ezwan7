import {CommonActions, DrawerActions, StackActions, TabActions} from '@react-navigation/native';
import {MyConstant} from "./MyConstant";

let _navigator: any;

const setTopLevelNavigator = (navigatorRef: any) => {
    _navigator = navigatorRef;
}

const getCurrentNavigation = () => {
    console.log('getCurrentNavigation', _navigator);
}

// COPY IN MyUtil
const commonAction = (loginRequired: boolean, actionType: string, routeName: any, params: any) => {
    printConsole(true, 'log', 'LOG: commonAction: ', {
        'loginRequired': loginRequired,
        'actionType'   : actionType,
        'routeName'    : routeName,
        'params'       : params,
    });

    switch (actionType) {
        case MyConstant.CommonAction.navigate:
            _navigator.dispatch(CommonActions.navigate(routeName, params));
            break;
        case MyConstant.CommonAction.reset:
            _navigator.dispatch(CommonActions.reset(routeName)); // state with index
            break;
        case MyConstant.CommonAction.goBack:
            _navigator.dispatch(CommonActions.goBack());
            break;
        case MyConstant.CommonAction.setParams:
            _navigator.dispatch(CommonActions.setParams(params));
            break;
        default:
            break;
    }

    // NavigationService.commonAction(MyConstant.CommonAction.navigate, routeName, params);
};

const stackAction = (loginRequired: boolean, actionType: string, routeName: any, params: any) => {
    printConsole(true, 'log', 'LOG: stackAction: ', {
        'loginRequired': loginRequired,
        'actionType'   : actionType,
        'routeName'    : routeName,
        'params'       : params,
    });

    switch (actionType) {
        case MyConstant.StackAction.replace:
            _navigator.dispatch(StackActions.replace(routeName, params));
            break;
        case MyConstant.StackAction.push:
            _navigator.dispatch(StackActions.push(routeName, params));
            break;
        case MyConstant.StackAction.pop:
            _navigator.dispatch(StackActions.pop(routeName));
            break;
        case MyConstant.StackAction.popToTop:
            _navigator.dispatch(StackActions.popToTop());
            break;
        default:
            break;
    }

    // NavigationService.stackAction(MyConstant.StackAction.replace, routeName, params);
};

const drawerAction = (loginRequired: boolean, actionType: string, routeName: any, params: any) => {
    printConsole(true, 'log', 'LOG: drawerAction: ', {
        'loginRequired': loginRequired,
        'actionType'   : actionType,
        'routeName'    : routeName,
        'params'       : params,
    });

    switch (actionType) {
        case MyConstant.DrawerAction.openDrawer:
            _navigator.dispatch(DrawerActions.openDrawer());
            break;
        case MyConstant.DrawerAction.closeDrawer:
            _navigator.dispatch(DrawerActions.closeDrawer());
            break;
        case MyConstant.DrawerAction.toggleDrawer:
            _navigator.dispatch(DrawerActions.toggleDrawer());
            break;
        case MyConstant.DrawerAction.jumpTo:
            _navigator.dispatch(DrawerActions.jumpTo(routeName, params));
            break;
        default:
            break;
    }

    // NavigationService.drawerAction(MyConstant.DrawerAction.openDrawer, routeName, params);
};

const tabAction = (loginRequired: boolean, actionType: string, routeName: any, params: any) => {
    printConsole(true, 'log', 'LOG: tabAction: ', {
        'loginRequired': loginRequired,
        'actionType'   : actionType,
        'routeName'    : routeName,
        'params'       : params,
    });

    switch (actionType) {
        case MyConstant.TabAction.jumpTo:
            _navigator.dispatch(TabActions.jumpTo(routeName, params));
            break;
        default:
            break;
    }

    // NavigationService.tabAction(MyConstant.TabAction.jumpTo, routeName, params);
};

const printConsole = (show: boolean, type: string, title: string, message: any) => {
    if (show === true) {
        switch (type) {
            case 'log':
                console.log(title, message);
                break;
            case 'error':
                console.error(title, message);
                break;
            default:
                console.log(title, message);
                break;
        }
    }
};

export default {
    setTopLevelNavigator,
    getCurrentNavigation,

    commonAction,
    stackAction,
    drawerAction,
    tabAction,
};
