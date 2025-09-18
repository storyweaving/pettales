import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ToastType } from '../../types';

const SettingsView: React.FC = () => {
    const { state, dispatch, signOut } = useAppContext();
    const { theme } = state;

    const handleClose = () => {
        dispatch({ type: 'SET_COCKPIT_VIEW', payload: null });
    }

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        dispatch({ type: 'SET_THEME', payload: newTheme });
    }

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            dispatch({ type: 'ADD_TOAST', payload: { message: 'Sign out failed', type: ToastType.Error } });
        } else {
            dispatch({ type: 'ADD_TOAST', payload: { message: "You've been signed out.", type: ToastType.Info } });
        }
    };

    return (
        <div className="p-6 h-full flex flex-col bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between items-center bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="font-medium">Dark Mode</span>
                    <button
                        onClick={toggleTheme}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-800 ${
                            theme === 'dark' ? 'bg-orange-600' : 'bg-gray-200'
                        }`}
                    >
                        <span className="sr-only">Toggle Dark Mode</span>
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
                                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </li>
                <li className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                    <button onClick={handleSignOut} className="w-full flex items-center space-x-2 font-medium transition-colors hover:text-red-600 dark:hover:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Sign Out</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default SettingsView;