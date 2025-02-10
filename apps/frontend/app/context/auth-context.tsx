import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/validate");
                if (res.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    router.push("/login");
                }
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        validateAuth();
    }, [router]);

    return <AuthContext.Provider value={{ isAuthenticated, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
