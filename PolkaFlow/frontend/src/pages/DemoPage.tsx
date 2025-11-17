import Demo from '../components/pages/Demo';
import type { PageType } from '../App';

interface DemoPageProps {
  onEnterApp: (address: string, startPage?: PageType) => void;
}

export const DemoPage = ({ onEnterApp }: DemoPageProps) => {
  return <Demo address="" />;
};