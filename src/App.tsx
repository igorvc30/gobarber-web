import React from 'react';
import GlobalSyle from './styles/global';
import { BrowserRouter as Router } from 'react-router-dom';
import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
    <Router>
        <AppProvider>
            <Routes />
        </AppProvider>
        <GlobalSyle />
    </Router>
);

export default App;
