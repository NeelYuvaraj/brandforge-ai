import React from 'react';
import { BrandProvider, useBrandData } from './context/BrandContext';
import Landing from './components/Landing';
import ChatFlow from './components/ChatFlow';
import GeneratingScreen from './components/GeneratingScreen';
import PortfolioGenerator from './components/PortfolioGenerator';

function Router() {
  const { screen } = useBrandData();

  switch (screen) {
    case 'landing':
      return <Landing />;
    case 'interview':
      return <ChatFlow />;
    case 'generating':
      return <GeneratingScreen />;
    case 'preview':
      return <PortfolioGenerator />;
    default:
      return <Landing />;
  }
}

function App() {
  return (
    <BrandProvider>
      <Router />
    </BrandProvider>
  );
}

export default App;
