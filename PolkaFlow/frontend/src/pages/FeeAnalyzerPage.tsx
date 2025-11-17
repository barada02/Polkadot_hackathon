import FeeAnalyzer from '../components/pages/FeeAnalyzer';
import type { PageType } from '../App';

interface FeeAnalyzerPageProps {
  address: string;
  onNavigate: (page: PageType, address?: string) => void;
}

export const FeeAnalyzerPage = ({ address, onNavigate }: FeeAnalyzerPageProps) => {
  return <FeeAnalyzer address={address} />;
};