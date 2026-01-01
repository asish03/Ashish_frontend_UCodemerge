import { useState } from 'react';
import { User } from '../App';
import { Sidebar } from './Sidebar';
import { CodeMergerPage } from './pages/CodeMergerPage';
import { LanguageConverterPage } from './pages/LanguageConverterPage';
import { AIIntegrationPage } from './pages/AIIntegrationPage';
import { GuidedMergePage } from './pages/GuidedMergePage';
import { RepositoryIntegrationPage } from './pages/RepositoryIntegrationPage';
import { ConversionWorkflowPage } from './pages/ConversionWorkflowPage';
import { RiskMitigationPage } from './pages/RiskMitigationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { OverviewPage } from './pages/OverviewPage';
import { UsersPage } from './pages/UsersPage';

export type PageType =
  | 'overview'
  | 'code-merger'
  | 'language-converter'
  | 'ai-integration'
  | 'guided-merge'
  | 'repository-integration'
  | 'conversion-workflow'
  | 'risk-mitigation'
  | 'analytics'
  | 'users';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage user={user} />;
      case 'code-merger':
        return <CodeMergerPage />;
      case 'language-converter':
        return <LanguageConverterPage />;
      case 'ai-integration':
        return <AIIntegrationPage />;
      case 'guided-merge':
        return <GuidedMergePage />;
      case 'repository-integration':
        return <RepositoryIntegrationPage />;
      case 'conversion-workflow':
        return <ConversionWorkflowPage />;
      case 'risk-mitigation':
        return <RiskMitigationPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'users':
        return <UsersPage user={user} />;
      default:
        return <OverviewPage user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        user={user}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}