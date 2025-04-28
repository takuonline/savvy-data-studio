import { injectStore } from '@/services/http-common';
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import sidebarReducer from '../features/activeSidebar/activeSidebar';
import authReducer from '../features/auth/authSlice';
import nodeGraphReducer from '../features/nodeGraphState/nodeGraphSlice';

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        nodeGraph: nodeGraphReducer,
        auth: authReducer,
    },
});
injectStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
