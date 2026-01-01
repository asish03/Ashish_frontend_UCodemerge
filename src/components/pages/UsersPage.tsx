import { useState } from 'react';
import { User } from '../../App';
import { Users, UserPlus, Crown, Code, Search, MoreVertical, Shield } from 'lucide-react';

interface UsersPageProps {
  user: User;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'developer';
  status: 'active' | 'inactive';
  lastActive: string;
  projectsCount: number;
  mergesCount: number;
  joinedAt: string;
}

export function UsersPage({ user }: UsersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'owner@asembleai.com',
      role: 'owner',
      status: 'active',
      lastActive: '2 minutes ago',
      projectsCount: 12,
      mergesCount: 147,
      joinedAt: 'Jan 2024',
    },
    {
      id: '2',
      name: 'Sam Williams',
      email: 'dev@asembleai.com',
      role: 'developer',
      status: 'active',
      lastActive: '5 minutes ago',
      projectsCount: 8,
      mergesCount: 89,
      joinedAt: 'Feb 2024',
    },
    {
      id: '3',
      name: 'Sarah Chen',
      email: 'sarah@asembleai.com',
      role: 'developer',
      status: 'active',
      lastActive: '1 hour ago',
      projectsCount: 15,
      mergesCount: 203,
      joinedAt: 'Jan 2024',
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike@asembleai.com',
      role: 'developer',
      status: 'active',
      lastActive: '3 hours ago',
      projectsCount: 6,
      mergesCount: 54,
      joinedAt: 'Mar 2024',
    },
    {
      id: '5',
      name: 'Jennifer Lee',
      email: 'jennifer@asembleai.com',
      role: 'developer',
      status: 'inactive',
      lastActive: '2 days ago',
      projectsCount: 3,
      mergesCount: 21,
      joinedAt: 'Apr 2024',
    },
  ];

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: teamMembers.length, icon: <Users className="w-5 h-5" /> },
    {
      label: 'Owners',
      value: teamMembers.filter((m) => m.role === 'owner').length,
      icon: <Crown className="w-5 h-5" />,
    },
    {
      label: 'Developers',
      value: teamMembers.filter((m) => m.role === 'developer').length,
      icon: <Code className="w-5 h-5" />,
    },
    {
      label: 'Active',
      value: teamMembers.filter((m) => m.status === 'active').length,
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">User Management</h1>
            <p className="text-slate-600">Manage team members and their permissions (RBAC)</p>
          </div>
          {user.role === 'owner' && (
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Form */}
      {showAddUser && user.role === 'owner' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl mb-4">Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter email address"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-700 mb-2">Role</label>
            <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="developer">Developer</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              Send Invitation
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search users by name or email..."
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl">Team Members ({filteredMembers.length})</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {filteredMembers.map((member) => (
            <div key={member.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-slate-900">{member.name}</h3>
                      {member.role === 'owner' && (
                        <Crown className="w-4 h-4 text-yellow-600" />
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="grid grid-cols-4 gap-8">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Role</p>
                      <p className="text-sm text-slate-900 capitalize">{member.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Projects</p>
                      <p className="text-sm text-slate-900">{member.projectsCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Merges</p>
                      <p className="text-sm text-slate-900">{member.mergesCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Active</p>
                      <p className="text-sm text-slate-900">{member.lastActive}</p>
                    </div>
                  </div>

                  {user.role === 'owner' && (
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-slate-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Information */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl mb-4">Role-Based Access Control (RBAC)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg text-slate-900">Owner Role</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></span>
                <span className="text-sm text-slate-600">Full system access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></span>
                <span className="text-sm text-slate-600">User management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></span>
                <span className="text-sm text-slate-600">View all analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></span>
                <span className="text-sm text-slate-600">System configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2"></span>
                <span className="text-sm text-slate-600">Billing and subscription</span>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg text-slate-900">Developer Role</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                <span className="text-sm text-slate-600">Code merging operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                <span className="text-sm text-slate-600">Language conversion</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                <span className="text-sm text-slate-600">Repository integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                <span className="text-sm text-slate-600">AI-assisted workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                <span className="text-sm text-slate-600">View personal analytics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
