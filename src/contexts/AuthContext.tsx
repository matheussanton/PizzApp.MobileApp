import React, { useState, createContext, ReactNode, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { api } from '../services/api'


type AuthContextData = {
    user: UserProps,
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
}

type UserProps = {
    id: string,
    name: string,
    email: string,
    token: string
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string,
    password: string
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    });

    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user.id;

    useEffect(() => {

        async function getUser() {

            //pegar dados do usuario
            const userInfo = await AsyncStorage.getItem('@pizzapp')
            let userProps: UserProps = JSON.parse(userInfo || "{}");

            if (Object.keys(userProps).length > 0) {
                api.defaults.headers.common['Authorization'] = `Bearer ${userProps.token}`;

                setUser({
                    id: userProps.id,
                    name: userProps.name,
                    email: userProps.email,
                    token: userProps.token
                });
            }

            setLoading(false);
        }

        getUser();

    }, [])

    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true);

        try {
            const response = await api.post('/session', {
                email, password
            });

            // console.log(response.data);
            const { id, name, token } = response.data;

            const data = {
                ...response.data
            };

            await AsyncStorage.setItem('@pizzapp', JSON.stringify(data))

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser({
                id,
                name,
                email,
                token
            });


            setLoadingAuth(false);

        } catch (error) {
            console.log("erro ao acessar: " + error);
            setLoadingAuth(false);
        }
    }

    async function signOut() {
        await AsyncStorage.clear()
            .then(() => {
                setUser({
                    id: '',
                    name: '',
                    email: '',
                    token: ''
                })
            }
            )
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                signIn,
                signOut,
                loadingAuth,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    )
}
