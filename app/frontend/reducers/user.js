import { USER_DATA } from '../actions/anon';

export default function counter(state = {email: ''}, action) {

    switch (action.type) {
        case USER_DATA:
            return Object.assign({email: action.payload});
        default:
            return state;
    }
}
