import { User } from '../App';
import { PageType } from './DashboardLayout';
import {
  Code2,
  GitMerge,
  Languages,
  Sparkles,
  GitPullRequest,
  FolderGit2,
  Workflow,
  Shield,
  BarChart3,
  Users,
  LayoutDashboard,
  LogOut,
  Crown,
} from 'lucide-react';

interface SidebarProps {
  user: User;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onLogout: () => void;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ReactNode;
  allowedRoles?: ('owner' | 'developer')[];
}

const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: 'code-merger',
    label: 'Code Merger',
    icon: <GitMerge className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'language-converter',
    label: 'Language Converter',
    icon: <Languages className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'ai-integration',
    label: 'AI Integration',
    icon: <Sparkles className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'guided-merge',
    label: 'Guided Merge',
    icon: <GitPullRequest className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'repository-integration',
    label: 'Repository Import',
    icon: <FolderGit2 className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'conversion-workflow',
    label: 'Conversion Workflow',
    icon: <Workflow className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'risk-mitigation',
    label: 'Risk Mitigation',
    icon: <Shield className="w-5 h-5" />,
    allowedRoles: ['developer'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    allowedRoles: ['owner'],
  },
];

export function Sidebar({ user, currentPage, onPageChange, onLogout }: SidebarProps) {
  const filteredNavItems = navItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(user.role)
  );

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg">AsembleAI</h1>
            <p className="text-xs text-slate-400">Code Integration</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{user.name}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              {user.role === 'owner' && <Crown className="w-3 h-3" />}
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-auto">
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}