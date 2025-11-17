import Optimizer from '../components/pages/Optimizer';
import type { PageType } from '../App';

interface OptimizerPageProps {
  address: string;
  onNavigate: (page: PageType, address?: string) => void;
}

export const OptimizerPage = ({ address }: OptimizerPageProps) => {
  return <Optimizer address={address} />;
};