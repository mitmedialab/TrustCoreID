import { USER_DATA } from '../actions/anon';
import { ACTIVITY_DATA } from '../actions/activityFeed';

export default function items(state = {
    items: [],
    lastIndex: 0,
    userData: {}
}, action) {

    switch (action.type) {
        case USER_DATA:
            return Object.assign({}, state, {userData: action.payload});
        case ACTIVITY_DATA:
            let change = Object.assign({}, state);
            change.lastIndex += action.payload.list.rows.length;
            change.items = change.items.concat(action.payload.list.rows);
            return change;
        default:
            return state;
    }

}

