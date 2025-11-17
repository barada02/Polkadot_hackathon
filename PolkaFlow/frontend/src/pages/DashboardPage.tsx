import Dashboard from '../components/pages/Dashboard';
import type { PageType } from '../App';

interface DashboardPageProps {
  address: string;
  onNavigate: (page: PageType, address?: string) => void;
}

export const DashboardPage = ({ address, onNavigate }: DashboardPageProps) => {
  return <Dashboard address={address} />;
};