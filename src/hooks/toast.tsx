import React, { createContext, useCallback, useState, useContext } from 'react';
import ToastContainer from '../components/ToastContainer';
import { uuid } from 'uuidv4';
export interface ToastMessage {
    id: string;
    type?: 'success' | 'error' | 'info';
    title: string;
    description?: string;
}

interface ToastContextData {
    addToast(message: Omit<ToastMessage, 'id'>): void;
    removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<ToastMessage[]>([]);
    const addToast = useCallback(
        ({ type, description, title }: Omit<ToastMessage, 'id'>) => {
            const id = uuid();

            const toast = {
                id,
                type,
                description,
                title,
            };

            setMessages((state) => [...state, toast]);
        },
        [],
    );

    const removeToast = useCallback((id: string) => {
        setMessages((state) => state.filter((message) => message.id !== id));
    }, []);
    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer messages={messages} />
        </ToastContext.Provider>
    );
};

export function useToast(): ToastContextData {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be within an ToastProvider');
    }
    return context;
}
