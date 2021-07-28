import { navigations } from 'app/navigations'
import { SET_USER_NAVIGATION, getNavigationByUser } from '../actions/NavigationAction'

const initialState = [...navigations]

const NavigationReducer = function (state = initialState, action) {
    switch (action.type) {
        case SET_USER_NAVIGATION: {
            console.log('SET_USER_NAVIGATION');
            return [...action.payload]
        }
        default: {
            console.log('default');
            return [...state]
        }
    }
}

export default NavigationReducer
