import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from 'lucide-react';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      label: 'Total Operations',
      value: '2,847',
      change: '+18%',
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      label: 'Success Rate',
      value: '96.8%',
      change: '+2.3%',
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Avg Processing Time',
      value: '4.2s',
      change: '-12%',
      trend: 'down',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      label: 'Failed Operations',
      value: '92',
      change: '-8%',
      trend: 'down',
      icon: <XCircle className="w-6 h-6" />,
      color: 'bg-red-500',
    },
  ];

  const operationsByType = [
    { type: 'Code Merge', count: 1247, percentage: 44 },
    { type: 'Language Conversion', count: 892, percentage: 31 },
    { type: 'Repository Import', count: 456, percentage: 16 },
    { type: 'AI Integration', count: 252, percentage: 9 },
  ];

  const recentJobs = [
    {
      id: 'job-1',
      type: 'merge',
      status: 'completed',
      startTime: '10:23 AM',
      duration: '3.2s',
      files: 47,
      user: 'Sarah Chen',
    },
    {
      id: 'job-2',
      type: 'conversion',
      status: 'completed',
      startTime: '10:18 AM',
      duration: '5.8s',
      files: 23,
      user: 'Mike Johnson',
    },
    {
      id: 'job-3',
      type: 'import',
      status: 'running',
      startTime: '10:15 AM',
      duration: '1m 24s',
      files: 89,
      user: 'Alex Kim',
    },
    {
      id: 'job-4',
      type: 'merge',
      status: 'failed',
      startTime: '10:12 AM',
      duration: '2.1s',
      files: 34,
      user: 'Jennifer Lee',
    },
    {
      id: 'job-5',
      type: 'conversion',
      status: 'completed',
      startTime: '10:08 AM',
      duration: '4.5s',
      files: 56,
      user: 'David Park',
    },
  ];

  const performanceData = [
    { time: '00:00', operations: 12, avgTime: 3.2 },
    { time: '04:00', operations: 8, avgTime: 2.9 },
    { time: '08:00', operations: 45, avgTime: 4.1 },
    { time: '12:00', operations: 67, avgTime: 4.8 },
    { time: '16:00', operations: 52, avgTime: 3.9 },
    { time: '20:00', operations: 28, avgTime: 3.5 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            Completed
          </span>
        );
      case 'running':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
            <div className="animate-spin rounded-full h-2 w-2 border border-blue-600 border-t-transparent"></div>
            Running
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Failed</span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      merge: 'bg-purple-100 text-purple-700',
      conversion: 'bg-blue-100 text-blue-700',
      import: 'bg-green-100 text-green-700',
    };
    return badges[type as keyof typeof badges] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Analytics & Observability</h1>
            <p className="text-slate-600">
              Real-time metrics, performance data, and job-level analytics
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`${metric.color} rounded-lg p-3 text-white`}>{metric.icon}</div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`}
                />
                {metric.change}
              </div>
            </div>
            <div>
              <p className="text-2xl mb-1">{metric.value}</p>
              <p className="text-sm text-slate-600">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Operations by Type */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl">Operations by Type</h2>
          </div>
          <div className="space-y-4">
            {operationsByType.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-900">{item.type}</span>
                  <span className="text-sm text-slate-600">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl">Operations Over Time</h2>
          </div>
          <div className="space-y-3">
            {performanceData.map((data, index) => (
              <div key={data.time} className="flex items-end gap-2">
                <span className="text-xs text-slate-600 w-12">{data.time}</span>
                <div className="flex-1 flex items-end gap-2">
                  <div className="flex-1 bg-slate-100 rounded">
                    <div
                      className="bg-blue-500 rounded h-8 transition-all"
                      style={{ width: `${(data.operations / 70) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-600 w-8">{data.operations}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl">Recent Job Executions</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentJobs.map((job) => (
            <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getTypeBadge(job.type)}`}>
                        {job.type}
                      </span>
                      {getStatusBadge(job.status)}
                    </div>
                    <p className="text-sm text-slate-600">by {job.user}</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Start Time</p>
                      <p className="text-sm text-slate-900">{job.startTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Duration</p>
                      <p className="text-sm text-slate-900">{job.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Files</p>
                      <p className="text-sm text-slate-900">{job.files}</p>
                    </div>
                  </div>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observability Stack */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-slate-900 mb-3">Monitoring</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• Prometheus</p>
            <p className="text-sm text-slate-600">• Exporters</p>
            <p className="text-sm text-slate-600">• AlertManager</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-slate-900 mb-3">Visualization</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• Grafana</p>
            <p className="text-sm text-slate-600">• Custom Dashboards</p>
            <p className="text-sm text-slate-600">• Real-time Metrics</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-slate-900 mb-3">Tracing</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• Jaeger</p>
            <p className="text-sm text-slate-600">• OpenTelemetry SDK</p>
            <p className="text-sm text-slate-600">• Distributed Traces</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-slate-900 mb-3">Logging</h3>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">• Loki</p>
            <p className="text-sm text-slate-600">• ClickHouse</p>
            <p className="text-sm text-slate-600">• Log Aggregation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
