const initialState: any = {
    user: {},
};

const types = {
    SIGN_IN : 'SIGN_IN',
    SIGN_OUT: "SIGN_OUT",
    SIGN_UP : "SIGN_UP",
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

const AuthReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.SIGN_IN:
            return {
                ...state,
                user: action.payload
            }

        case types.SIGN_OUT:
            return {
                ...initialState,
            }
        default:
            return state;
    }
}

export default AuthReducer;

