const initialState: any = {
    accuracy : null,
    latitude : null,
    longitude: null,

    address     : {
        street_number: null,
        street       : null,
        city         : null,
        state        : null,
        country      : null,
        postal_code  : null,
    },
    address_text: null,

    plus_code         : null,
    address_components: null,
    formatted_address : null,
    geometry          : null,
    place_id          : null,
    types             : null,
}

const types = {
    UPDATE_USER_LOCATION: 'UPDATE_USER_LOCATION',
    EMPTY_USER_LOCATION : 'EMPTY_USER_LOCATION',
}

export const userLocationUpdate = (data: any, key: any) => {
    return {
        type   : types.UPDATE_USER_LOCATION,
        payload: {
            data,
            key,
        },
    }
}

export const userLocationEmpty = () => {
    return {
        type   : types.EMPTY_USER_LOCATION,
        payload: null,
    }
}

const UserLocationReducer = (state: string = initialState, action: any) => {
    switch (action.type) {

        case types.UPDATE_USER_LOCATION:

            if (action.payload?.key === 'all') {

                return action.payload?.data;

            } else if (Array.isArray(action.payload?.key) && action.payload?.key?.length > 0) {

                const currentState: any = state;

                for (const key of action.payload?.key) {
                    console.log(key, action.payload?.data?.[key]);
                    if (action.payload?.data?.[key]) {
                        currentState[key] = action.payload?.data?.[key];
                    }
                }

                return currentState;

            } else if (action.payload?.key?.length > 0) {
                const currentState: any           = state;
                currentState[action.payload?.key] = action.payload?.data;

                return currentState;

            } else {
                return state;
            }

        case types.EMPTY_USER_LOCATION:
            return initialState;

        default:
            return state;
    }
}

export default UserLocationReducer;

