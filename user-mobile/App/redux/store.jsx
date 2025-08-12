import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";
import rootReducer from "./rootReducer";

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Optional: Handle hydration if using SSR/SSG (uncomment if needed)
const reducer = (state, action) => {
  // if (action.type === HYDRATE) {
  //   return {
  //     ...state, // use previous state
  //     ...action.payload // apply delta from hydration
  //   };
  // }
  return rootReducer(state, action);
};

// Configure the store
export const store = configureStore({
  reducer: rootReducer, // or use 'reducer' if you need hydration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for saga
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      thunk: false, // Disable thunk since we're using saga
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: Export store methods if needed
export const { dispatch, getState } = store;