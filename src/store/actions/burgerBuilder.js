import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

// mapDispatchToProps on BurgerBuilder.js
export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

// define setter instead of using setState()
export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients // payload
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

// asynchronous fetching for ingredients
export const initIngredients = () => {
    return dispatch => {
        // retrieve data from the backend
        axios.get('https://react-my-burger-52acc.firebaseio.com/ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data));
            })
            .catch(error => {
                dispatch(fetchIngredientsFailed());
            }); // add catch method not to show error screen!
    };
};