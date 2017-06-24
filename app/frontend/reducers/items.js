import { USER_DATA } from '../actions/anon';

export default function items(state = {
    list: {},
    email: ''
}, action) {
    let newState = state;

    switch (action.type) {
        case USER_DATA:
            return Object.assign({email: action.payload});
        case 'DOCUMENTS':
            let list = action.payload.rows.reduce((memo, item) => {
                console.log(item);
                let document = item.doc;
                if (document.from === state.email && !document.signatures) {
                    memo[1].push(document);
                } else if (document.signatures && document.signatures.length === document.to.length + 1) {
                    memo[3].push(document);
                } else if (document.from !== state.email) {
                    memo[0].push(document);
                } else {
                    memo[2].push(document);
                }
                return memo;
            }, {0: [], 1: [], 2: [], 3: [], 4: []});
            newState = Object.assign({}, state, {list});

            break;
        default:
            return state;
    }

    return newState;
}

