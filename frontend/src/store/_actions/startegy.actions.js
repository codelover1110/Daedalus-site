import { strategyConstants } from '../_constants';

function setActiveStrategy(strategy) {
    return dispatch => {
        dispatch(setStrategy(strategy));
    };

    function setStrategy(strategy) { return { type: strategyConstants.SET_ACTIVE_STRATEGY, strategy } };
}

export const strategyActions = {
    setActiveStrategy
}