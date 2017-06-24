import { USER_DATA } from '../actions/anon';

export default function counter(state = {email: ''}, action) {

    switch (action.type) {
        case USER_DATA:
            console.log(action.payload)
            return Object.assign(
                {
                    email: action.payload.email,
                    id: action.payload.id
                });
        default:
            return state;
    }
}
