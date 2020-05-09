import React from 'react';
import GlobalSyle from './styles/global';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AppProvider from './hooks';

const App: React.FC = () => (
    <>
        <AppProvider>
            <SignIn />
        </AppProvider>
        <GlobalSyle />
    </>
);

export default App;
