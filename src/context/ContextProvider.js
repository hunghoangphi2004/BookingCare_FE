import { createContext, useContext, useState } from "react"
import Cookie from 'js-cookie'
const StateContext = createContext();


export const ContextProvider = ({ children }) => {

    const initialUserState = { email: '', password: '', confirmPassword: '', registerOTP: '', forgetPasswordOTP: '' }
    const [userFormData, setUserFormData] = useState(initialUserState) 

    return (
        <StateContext.Provider
            value={{
                userFormData, setUserFormData
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)