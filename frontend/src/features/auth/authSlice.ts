import { AuthLoginCredentials, AuthTokens } from '@/types/authTypes';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
export interface AuthState {
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
    status: 'idle',
    isAuthenticated: false,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const authAsync = createAsyncThunk(
    'auth/fetchTokens',
    async (value: AuthLoginCredentials) => {
        //   const response = await AuthenticationService.login(value);
        //   // The value we return becomes the `fulfilled` action payload
        //   if (response.status == 200) {
        //     storeTokensState(response.data);
        //   }
        //   return response.data;
    },
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setAuthStatus: (state, action: PayloadAction<boolean>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            //   state.value += 1;
            state.isAuthenticated = action.payload;
        },
    },

});

export const { setAuthStatus } = authSlice.actions;

export default authSlice.reducer;
