import { ActiveSidebarPageEnum } from '@/components/enums/Enums';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

export interface SideBarState {
    activeSidebar: ActiveSidebarPageEnum;
}

const initialState: SideBarState = {
    activeSidebar: ActiveSidebarPageEnum.Dashboard,
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        onSidebarNavigate: (
            state,
            action: PayloadAction<ActiveSidebarPageEnum>,
        ) => {
            state.activeSidebar = action.payload;
        },
    },
});

export const { onSidebarNavigate } = sidebarSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.sidebar.value)`
export const activeSidebar = (state: RootState) => state.sidebar.activeSidebar;

export default sidebarSlice.reducer;
