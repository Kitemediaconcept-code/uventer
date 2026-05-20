import type { Metadata } from 'next';
import ProcessPage from '@/components/how-it-works/ProcessPage';

export const metadata: Metadata = {
  title: 'How It Works | Uventer',
  description: 'Our five-step event methodology ensures flawless execution, from goals definition and budgeting, to spatial design and live delivery.',
  openGraph: {
    title: 'How It Works | Uventer Event Execution',
    description: 'Learn about our clear five-step process to plan and deliver premium business conferences, product launches, and corporate events.',
  }
};

export default function Page() {
  return <ProcessPage />;
}
