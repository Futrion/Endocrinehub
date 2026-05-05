import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(undefined); // undefined = loading
    const [role, setRole] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [apellidos, setApellidos] = useState(null);

    async function fetchRole(userId) {
        if (!userId) { setRole(null); setNombre(null); setApellidos(null); return; }
        const { data } = await supabase
            .from('profiles')
            .select('role, nombre, apellidos')
            .eq('id', userId)
            .single();
        setRole(data?.role ?? null);
        setNombre(data?.nombre ?? null);
        setApellidos(data?.apellidos ?? null);
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            fetchRole(session?.user?.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            fetchRole(session?.user?.id);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = (email, password) =>
        supabase.auth.signInWithPassword({ email, password });

    const signOut = () => supabase.auth.signOut();

    const signUp = (email, password, nombre, apellidos) =>
        supabase.auth.signUp({ email, password, options: { data: { nombre, apellidos } } });

    const resetPassword = (email) =>
        supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}reset-password`,
        });

    const updatePassword = (newPassword) =>
        supabase.auth.updateUser({ password: newPassword });

    const isAdmin = role === 'admin';

    return (
        <AuthContext.Provider value={{ session, role, isAdmin, nombre, apellidos, signIn, signOut, signUp, resetPassword, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
