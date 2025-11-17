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

// Navigation types
export type PageType = 'landing' | 'dashboard' | 'fees' | 'optimizer' | 'network' | 'demo';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const navigate = (page: PageType, address?: string) => {
    setCurrentPage(page);
    if (address) setCurrentAddress(address);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Header currentPage={currentPage} onNavigate={navigate} />
        
        <main className="main-content">
          {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
          {currentPage === 'dashboard' && <DashboardPage address={currentAddress} onNavigate={navigate} />}
          {currentPage === 'fees' && <FeeAnalyzerPage address={currentAddress} onNavigate={navigate} />}
          {currentPage === 'optimizer' && <OptimizerPage address={currentAddress} onNavigate={navigate} />}
          {currentPage === 'network' && <NetworkMonitorPage onNavigate={navigate} />}
          {currentPage === 'demo' && <DemoPage onNavigate={navigate} />}
        </main>
        
        <NotificationArea />
      </div>
    </ErrorBoundary>
  );
}

export default App;
