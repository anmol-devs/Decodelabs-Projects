import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  StatsSkeleton,
  ChartSkeleton,
  ActivitySkeleton,
} from '../components/SkeletonLoaders';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  RxPerson,
  RxActivityLog,
  RxRocket,
  RxCalendar,
  RxExclamationTriangle,
} from 'react-icons/rx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/dashboard/stats');
      setData(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard metrics. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <div>
            <ActivitySkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-red-200 dark:border-red-900 rounded-3xl bg-red-50/20 dark:bg-red-950/10">
        <RxExclamationTriangle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Sync Error
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 text-center max-w-sm">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { stats, charts, activities } = data || {};

  // Custom colors for Donut chart
  const PIE_COLORS = ['#6366f1', '#06b6d4', '#10b981'];

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow border border-slate-800">
          {`${payload[0].name}: ${payload[0].value}`}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Directory */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm flex items-center justify-between transition-all"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Members
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
              {stats?.totalMembers || 0}
            </h3>
            <p className="text-xs text-slate-400 mt-1">In your CRM directory</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-650 dark:text-indigo-400">
            <RxPerson className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Card 2: Active Signal */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm flex items-center justify-between transition-all"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Active Members
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
              {stats?.activeMembers || 0}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.totalMembers
                ? `${Math.round(
                    (stats.activeMembers / stats.totalMembers) * 100
                  )}% active status`
                : '0% active status'}
            </p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <RxRocket className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Card 3: Avg Age */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm flex items-center justify-between transition-all"
        >
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Average Age
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
              {stats?.averageAge || 0}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Years of age average</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
            <RxCalendar className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Graphs & Timeline Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City distribution chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm flex flex-col h-96">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-6">
            City Distribution (Top Locations)
          </h4>
          <div className="flex-1 w-full min-h-0">
            {charts?.cityDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.cityDistribution} barSize={24}>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Bar
                    dataKey="value"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No city data available.
              </div>
            )}
          </div>
        </div>

        {/* Role Donut Chart */}
        <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm flex flex-col h-96">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-6">
            Role Distribution
          </h4>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            {charts?.roleDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.roleDistribution}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {charts.roleDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    formatter={(value) => (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-400">
                No role data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Activity Log */}
      <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <RxActivityLog className="w-5 h-5 text-indigo-500" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Recent System Activity
          </h4>
        </div>

        <div className="flow-root">
          <ul className="-mb-8">
            {activities && activities.length > 0 ? (
              activities.map((activity, activityIdx) => (
                <li key={activity._id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-[#121826] ${
                            activity.action === 'CREATE'
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : activity.action === 'UPDATE'
                              ? 'bg-blue-100 text-blue-650 dark:bg-blue-950/60 dark:text-blue-400'
                              : activity.action === 'DELETE'
                              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                              : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                          }`}
                        >
                          <span className="text-[10px] font-bold">
                            {activity.action.charAt(0)}
                          </span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {activity.details}{' '}
                            <span className="font-semibold text-slate-650 dark:text-slate-200">
                              (by {activity.user?.name || 'Unknown'})
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-[10px] whitespace-nowrap text-slate-400 dark:text-slate-500 font-medium">
                          {new Date(activity.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                No recent system logs recorded.
              </div>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
