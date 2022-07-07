import { strategyConstants } from '../_constants';

export function strategyReducer(state = {}, action) {
    switch(action.type) {
        case strategyConstants.SET_ACTIVE_STRATEGY:
            return { activeStrategy: action.strategy };
        default:
            return state;
    }
}
