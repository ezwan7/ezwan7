const initialState: any = 'SplashStackScreen';

const types = {
    SWITCH_NAVIGATION: 'SWITCH_NAVIGATION'
}

/*const actions = {
    switchAppNavigator: (dispatch: any) => {
        dispatch(
            {
                type: types.SWITCH_NAVIGATION,
            }
        );
    }
}*/

export const switchAppNavigator = (name: string) => {
    return {
        type   : types.SWITCH_NAVIGATION,
        payload: name,
    }
}

const AppNavigatorReducer = (state: string = initialState, action: any) => {
    switch (action.type) {
        case types.SWITCH_NAVIGATION:
            return action.payload;

        default:
            return state;
    }
}

export default AppNavigatorReducer;

