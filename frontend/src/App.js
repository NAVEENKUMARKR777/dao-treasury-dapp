// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { IntentProvider } from './context/IntentContext';
import PermitForm from './components/PermitForm';
import IntentForm from './components/IntentForm';
import MultiSig from './components/MultiSig';
import CrossChainBridge from './components/CrossChainBridge';
import './styles/App.css'; // Import global styles

const App = () => {
  return (
    <Router>
      <WalletProvider>
        <IntentProvider>
          <div className="container">
            <h1>DAO Treasury DApp</h1>
            <Routes>
              <Route path="/" element={<PermitForm />} />
              <Route path="/intent" element={<IntentForm />} />
              <Route path="/multisig" element={<MultiSig />} />
              <Route path="/bridge" element={<CrossChainBridge />} />
            </Routes>
          </div>
        </IntentProvider>
      </WalletProvider>
    </Router>
  );
};

export default App;
 
