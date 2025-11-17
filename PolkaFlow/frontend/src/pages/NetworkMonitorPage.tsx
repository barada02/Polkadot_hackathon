import NetworkMonitor from '../components/pages/NetworkMonitor';
import type { PageType } from '../App';

interface NetworkMonitorPageProps {
  onNavigate: (page: PageType) => void;
}

export const NetworkMonitorPage = ({ }: NetworkMonitorPageProps) => {
  return <NetworkMonitor address="" />;
};