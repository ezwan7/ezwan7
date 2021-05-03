const initialState: any = {}

const types = {
    UPDATE_APP_DATA: 'UPDATE_APP_DATA',
    EMPTY_APP_DATA : 'EMPTY_APP_DATA',
}

export const appDataUpdate = (data: any, key: string) => {
    return {
        type   : types.UPDATE_APP_DATA,
        payload: {
            data,
            key,
        },
    }
}

export const appDataEmpty = () => {
    return {
        type   : types.EMPTY_APP_DATA,
        payload: null,
    }
}

const AppDataReducer = (state: string = initialState, action: any) => {
    switch (action.type) {

        case types.UPDATE_APP_DATA:
            if (action.payload?.key === 'all') {

                return action.payload?.data;

            } else if (Array.isArray(action.payload?.key) && action.payload?.key?.length > 0) {
                return action.payload?.data;

            } else if (action.payload?.key?.length > 0) {
                const currentState: any           = state;
                currentState[action.payload?.key] = action.payload?.data;

                return currentState;
            }

        case types.EMPTY_APP_DATA:
            return initialState;

        default:
            return state;
    }
}

export default AppDataReducer;

