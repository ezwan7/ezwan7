const initialState: any = {
    biometryType  : null,
    deviceInfo    : null,
    about_us      : null,
    contact_us    : null,
    privacy_policy: null,
    term_services : null,
    refund_policy : null,
}

const types = {
    UPDATE_APP_INFO_DATA: 'UPDATE_APP_INFO_DATA',
    EMPTY_APP_INFO_DATA : 'EMPTY_APP_INFO_DATA',
}

export const appInfoUpdate = (data: any, key: string) => {
    return {
        type   : types.UPDATE_APP_INFO_DATA,
        payload: {
            data,
            key,
        },
    }
}

export const appInfoEmpty = () => {
    return {
        type   : types.EMPTY_APP_INFO_DATA,
        payload: null,
    }
}

const AppInfoReducer = (state: string = initialState, action: any) => {
    switch (action.type) {

        case types.UPDATE_APP_INFO_DATA:
            if (action.payload?.key === 'all') {

                return action.payload?.data;

            } else if (Array.isArray(action.payload?.key) && action.payload?.key?.length > 0) {
                return action.payload?.data;

            } else if (action.payload?.key?.length > 0) {
                const currentState: any           = state;
                currentState[action.payload?.key] = action.payload?.data;

                return currentState;
            }

        case types.EMPTY_APP_INFO_DATA:
            return initialState;

        default:
            return state;
    }
}

export default AppInfoReducer;

