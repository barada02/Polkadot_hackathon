import { useState } from 'react';
import './App.css';
import { Header } from './components/common/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FeeAnalyzerPage } from './pages/FeeAnalyzerPage';
import { OptimizerPage } from './pages/OptimizerPage';
import { NetworkMonitorPage } from './pages/NetworkMonitorPage';
import { DemoPage } from './pages/DemoPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { NotificationArea } from './components/common/NotificationArea';

// Navigation types for main app
export type PageType = 'dashboard' | 'fees' | 'optimizer' | 'network' | 'demo';

function App() {
  const [isInMainApp, setIsInMainApp] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const enterMainApp = (address: string, startPage: PageType = 'dashboard') => {
    setCurrentAddress(address);
    setCurrentPage(startPage);
    setIsInMainApp(true);
  };

  const navigate = (page: PageType, address?: string) => {
    setCurrentPage(page);
    if (address) setCurrentAddress(address);
  };

  const backToLanding = () => {
    setIsInMainApp(false);
    setCurrentAddress('');
    setCurrentPage('dashboard');
  };

  // Show landing page if not in main app
  if (!isInMainApp) {
    return (
      <ErrorBoundary>
        <LandingPage onEnterApp={enterMainApp} />
        <NotificationArea />
      </ErrorBoundary>
    );
  }

  // Show main application with navigation
  return (
    <ErrorBoundary>
      <div className="app">
        <Header 
          currentPage={currentPage} 
          currentAddress={currentAddress}
          onNavigate={navigate} 
          onBackToLanding={backToLanding}
        />
        
        <main className="main-content">
          {currentPage === 'dashboard' && <DashboardPage address={currentAddress} onNavigate={navigate} />}
          {currentPage === 'fees' && <FeeAnalyzerPage address={currentAddress} onNavigate={navigate} />}
          {currentPage === 'optimizer' && <OptimizerPage address={currentAddress} onNavigate={navigate} />}
          {currentPage === 'network' && <NetworkMonitorPage onNavigate={navigate} />}
          {currentPage === 'demo' && <DemoPage onEnterApp={enterMainApp} />}
        </main>
        
        <NotificationArea />
      </div>
    </ErrorBoundary>
  );
}

export default App;
