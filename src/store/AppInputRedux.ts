const initialState: any = {
    payment_method : [],
    delivery_method: [],
    countries      : [],
    filter_method  : [],
    pickup_address : [],
}

const types = {
    UPDATE_APP_INPUT_DATA: 'UPDATE_APP_INPUT_DATA',
    EMPTY_APP_INPUT_DATA : 'EMPTY_APP_INPUT_DATA',
}

export const appInputUpdate = (data: any, key: string) => {
    return {
        type   : types.UPDATE_APP_INPUT_DATA,
        payload: {
            data,
            key,
        },
    }
}

export const appInputEmpty = () => {
    return {
        type   : types.EMPTY_APP_INPUT_DATA,
        payload: null,
    }
}

const AppInputReducer = (state: string = initialState, action: any) => {
    switch (action.type) {

        case types.UPDATE_APP_INPUT_DATA:
            if (action.payload?.key === 'all') {
                return action.payload?.data;

            } else if (Array.isArray(action.payload?.key) && action.payload?.key?.length > 0) {
                return action.payload?.data;

            } else if (action.payload?.key?.length > 0) {
                const currentState: any           = state;
                currentState[action.payload?.key] = action.payload?.data;

                return currentState;

            } else {

                return state;
            }

        case types.EMPTY_APP_INPUT_DATA:
            return initialState;

        default:
            return state;
    }
}

export default AppInputReducer;

