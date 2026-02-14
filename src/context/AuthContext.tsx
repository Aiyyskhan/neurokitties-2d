import { createContext, FC, ReactNode, useState } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    
    return (
        <AuthContext value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext>
    );
}
export default AuthContext;