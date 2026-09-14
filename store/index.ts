
import { configureStore } from '@reduxjs/toolkit'
import { uiSLice } from './slices/uiSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            ui: uiSLice.reducer
        }
    })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
