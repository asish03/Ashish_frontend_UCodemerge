import { User } from '../../App';
import {
  GitMerge,
  Languages,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface OverviewPageProps {
  user: User;
}

export function OverviewPage({ user }: OverviewPageProps) {
  const stats = [
    {
      label: 'Total Merges',
      value: '1,247',
      change: '+12%',
      icon: <GitMerge className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Conversions',
      value: '892',
      change: '+8%',
      icon: <Languages className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      label: 'AI Assists',
      value: '2,134',
      change: '+24%',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Success Rate',
      value: '96.8%',
      change: '+2.1%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'merge',
      title: 'Merged React + Vue projects',
      user: 'Sarah Chen',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'conversion',
      title: 'Converted JavaScript to TypeScript',
      user: 'Mike Johnson',
      time: '15 minutes ago',
      status: 'success',
    },
    {
      id: 3,
      type: 'merge',
      title: 'AI-assisted merge: Lovable + Cursor',
      user: 'Alex Kim',
      time: '1 hour ago',
      status: 'in-progress',
    },
    {
      id: 4,
      type: 'conversion',
      title: 'COBOL to Python migration',
      user: 'Jennifer Lee',
      time: '3 hours ago',
      status: 'success',
    },
    {
      id: 5,
      type: 'merge',
      title: 'Repository merge with conflict detection',
      user: 'David Park',
      time: '5 hours ago',
      status: 'needs-review',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'needs-review':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Welcome back, {user.name}!</h1>
        <p className="text-slate-600">
          Here's an overview of your code integration platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} rounded-lg p-3 text-white`}>
                {stat.icon}
              </div>
              <span className="text-green-600 text-sm">{stat.change}</span>
            </div>
            <div>
              <p className="text-2xl mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(activity.status)}
                    <h3 className="text-slate-900">{activity.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    activity.type === 'merge'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
