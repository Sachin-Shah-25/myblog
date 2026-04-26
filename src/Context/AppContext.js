"use client"

import { createContext, useState,useEffect } from "react"


export const AppContext = createContext();


const ContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let id = setTimeout(() => {
            setLoading(true)
        }, 2000)
        return () => clearTimeout(id)
    }, [])
    return <AppContext.Provider value={{ loading ,setLoading}}>
        {children}
    </AppContext.Provider>
}


export default ContextProvider