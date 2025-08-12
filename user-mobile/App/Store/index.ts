import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './Slices/AuthSlice';
// import servicesReducer from './Slices/ServiceSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // services: servicesReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;  // <-- Added default export here
