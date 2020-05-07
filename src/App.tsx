import React from 'react';
import GlobalSyle from './styles/global';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App: React.FC = () => (
    <>
        <SignUp />
        <GlobalSyle />
    </>
);

export default App;
