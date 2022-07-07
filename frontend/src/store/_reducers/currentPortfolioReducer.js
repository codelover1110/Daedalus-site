

export function currentPortfolioReducer(state = {}, action) {
    switch(action.type) {
        case :
            return { currentPortfolio: action.strategy };
        default:
            return state;
    }
}
