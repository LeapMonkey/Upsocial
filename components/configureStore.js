import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";

const initialState = {};

const middleware = [thunk];

const rootReducer = combineReducers({
    auth: authReducer,
});

const configureStore = () => {
    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware))
    );
};

export default configureStore;
