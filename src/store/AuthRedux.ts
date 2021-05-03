const initialState: any = {
    user          : {},
    auth_token    : null,
    firebase_token: null,
};

const types = {
    UPDATE_AUTH_TOKEN    : 'UPDATE_AUTH_TOKEN',
    UPDATE_FIREBASE_TOKEN: 'UPDATE_FIREBASE_TOKEN',
    SIGN_IN              : 'SIGN_IN',
    SIGN_OUT             : "SIGN_OUT",
    SIGN_UP              : "SIGN_UP",
    UPDATE_USER          : "UPDATE_USER",
    EMPTY_AUTH           : 'EMPTY_AUTH',
}

export const auth_token_update = (item: any) => {
    return {
        type   : types.UPDATE_AUTH_TOKEN,
        payload: item,
    }
}

export const firebase_token_update = (item: any) => {
    return {
        type   : types.UPDATE_FIREBASE_TOKEN,
        payload: item,
    }
}

export const login = (item: any) => {
    return {
        type   : types.SIGN_IN,
        payload: item,
    }
}

export const logout = () => {
    return {
        type: types.SIGN_OUT,
    }
}

export const updateUser = (data: any, key: any) => {
    return {
        type   : types.UPDATE_USER,
        payload: {
            data,
            key,
        },
    }
}

export const authEmpty = () => {
    return {
        type   : types.EMPTY_AUTH,
        payload: null,
    }
}

const AuthReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.UPDATE_AUTH_TOKEN:
            const auth_token: any = action?.payload;

            return {
                ...state,
                auth_token: auth_token
            }

        case types.UPDATE_FIREBASE_TOKEN:
            const firebase_token: any = action?.payload;

            return {
                ...state,
                firebase_token: firebase_token,
            }

        case types.UPDATE_USER:
            if (action.payload?.key === 'all') {
                return {
                    ...state,
                    user: action?.payload?.data
                }

            } else if (Array.isArray(action.payload?.key) && action.payload?.key?.length > 0) {
                return {
                    ...state,
                    user: action?.payload?.data
                }

            } else if (action.payload?.key?.length > 0) {
                const currentUser: any           = state?.user;
                currentUser[action.payload?.key] = action?.payload?.data;

                return {
                    ...state,
                    user: currentUser
                }
            }

        case types.SIGN_IN:
            return {
                ...state,
                user: action.payload
            }

        case types.SIGN_OUT:
            return {
                ...state,
                user: {}
            }

        case types.EMPTY_AUTH:
            return initialState;

        default:
            return state;
    }
}

export default AuthReducer;

