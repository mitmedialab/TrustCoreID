import * as Actions from '../actions/newDocument';
import * as Schemas from '../schemas'

export default function counter(state = {
    schemas: Schemas.default
}, action) {

    switch (action.type) {

        default:
            return state;
    }
}
