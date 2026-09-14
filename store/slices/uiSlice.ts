import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UIState {
    isSearchOpen: boolean
    isMobileMenuOpen: boolean
}

const initialState: UIState = {
    isSearchOpen: false,
    isMobileMenuOpen: false,
}

export const uiSLice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSearch: (state) => {
            state.isSearchOpen = !state.isSearchOpen
        },
        setSearchOpen: (state, action: PayloadAction<boolean>) => {
            state.isSearchOpen = action.payload
        },
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen
        }
    }
})

export const {toggleSearch, setSearchOpen, toggleMobileMenu} = uiSLice.actions
export default uiSLice.reducer
