import {MyConfig} from "../shared/MyConfig";

const initialState: any = MyConfig.Intro;

const types = {
    UPDATE: 'UPDATE',
    EMPTY : "EMPTY",
}

export const introUpdate = (item: any) => {
    return {
        type   : types.UPDATE,
        payload: item,
    }
}

export const introEmpty = () => {
    return {
        type: types.EMPTY,
    }
}

const IntroReducer = (state: any = initialState, action: any) => {
    switch (action.type) {

        case types.UPDATE:
            return action.payload;

        case types.EMPTY:
            return initialState;
        default:
            return state;
    }
}

export default IntroReducer;

