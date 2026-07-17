import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import api from '../services/api';
import { TableSkeleton } from '../components/SkeletonLoaders';
import MemberFormModal from '../components/MemberFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MemberDetailsModal from '../components/MemberDetailsModal';
import {
  RxPlus,
  RxMagnifyingGlass,
  RxPencil1,
  RxTrash,
  RxChevronLeft,
  RxChevronRight,
  RxEyeOpen,
  RxLockClosed,
  RxMixerHorizontal,
  RxPerson,
} from 'react-icons/rx';

export default function Directory() {
  const { user, isAdmin } = useAuth();

  // Search & Filters State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [citiesList, setCitiesList] = useState([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default to 5 to easily test pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Data State
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal Controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch Member Directory
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
        city: cityFilter,
        sortBy,
      };
      const res = await api.get('/users', { params });
      setMembers(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setTotalRecords(res.data.pagination.total);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load workspace members.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filters list (dynamic cities) from stats
  const fetchFilterAssets = async () => {
    try {
      const res = await api.get('/users/dashboard/stats');
      if (res.data.data && res.data.data.cities) {
        setCitiesList(res.data.data.cities);
      }
    } catch (err) {
      console.error('Failed to pre-fetch filter configurations:', err.message);
    }
  };

  useEffect(() => {
    fetchFilterAssets();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [debouncedSearch, roleFilter, statusFilter, cityFilter, sortBy, page, limit]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter, cityFilter, sortBy]);

  // Handle Form Submission (Create & Update)
  const handleFormSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (selectedMember) {
        // Update API
        await api.put(`/users/${selectedMember._id}`, data);
        toast.success('Workspace member updated successfully!');
      } else {
        // Create API
        await api.post('/users', data);
        toast.success('Workspace member added successfully!');
      }
      setIsFormOpen(false);
      setSelectedMember(null);
      fetchMembers();
      fetchFilterAssets(); // update cities dropdown list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action execution failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;
    setActionLoading(true);
    try {
      await api.delete(`/users/${selectedMember._id}`);
      toast.success('Workspace member removed successfully.');
      setIsDeleteOpen(false);
      setSelectedMember(null);
      fetchMembers();
      fetchFilterAssets(); // update cities dropdown list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Upper Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Workspace Members
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your CRM workspace users, credentials, roles, and status.
          </p>
        </div>

        {/* Create CTA */}
        {isAdmin ? (
          <button
            onClick={() => {
              setSelectedMember(null);
              setIsFormOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-650/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 glow-indigo"
          >
            <RxPlus className="w-4 h-4" />
            Add Member
          </button>
        ) : (
          <div className="relative group">
            <button
              disabled
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 text-sm font-semibold cursor-not-allowed border border-slate-300/10"
            >
              <RxLockClosed className="w-4 h-4" />
              Add Member
            </button>
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 rounded-lg bg-slate-900 text-white text-[10px] text-center z-30 font-medium">
              Administrator credentials required to create members.
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Panel */}
      <div className="p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white dark:bg-[#121826]/40 shadow-sm space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <RxMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]/30 text-sm text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            />
          </div>

          {/* Sort selection */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]/30 text-sm text-slate-700 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <option value="createdAt:desc">Sort: Newest First</option>
              <option value="createdAt:asc">Sort: Oldest First</option>
              <option value="name:asc">Sort: Name (A-Z)</option>
              <option value="name:desc">Sort: Name (Z-A)</option>
              <option value="age:asc">Sort: Age (Youngest)</option>
              <option value="age:desc">Sort: Age (Oldest)</option>
            </select>
          </div>

          {/* Quick toggle dropdown button to display all filters */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
            <RxMixerHorizontal className="w-4 h-4 text-indigo-500" />
            <span>Active Filters</span>
          </div>
        </div>

        {/* Dropdown Filters (Role, Status, City) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/40">
          {/* Role Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Workspace Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]/30 text-xs text-slate-650 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">All Roles</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]/30 text-xs text-slate-650 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
              Location City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b0f19]/30 text-xs text-slate-650 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="All">All Cities</option>
              {citiesList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Content Table / Mobile Grid */}
      {loading ? (
        <TableSkeleton />
      ) : members.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block w-full border border-slate-200/50 dark:border-slate-800/60 rounded-2xl overflow-hidden bg-white dark:bg-[#121826]/20 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-[#0f1524]/60 text-slate-400 dark:text-slate-500 font-semibold border-b border-slate-200/60 dark:border-slate-800/60">
                    <th className="p-4">Name / Contact</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Age</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/50">
                  {members.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors"
                    >
                      {/* Name Card */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-bold text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                              {member.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {member.email} • {member.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* City */}
                      <td className="p-4 text-slate-600 dark:text-slate-350 font-medium">
                        {member.city}
                      </td>

                      {/* Age */}
                      <td className="p-4 text-slate-600 dark:text-slate-350 font-medium">
                        {member.age} yrs
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/10">
                          {member.role}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            member.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/10'
                              : member.status === 'Inactive'
                              ? 'bg-slate-100 text-slate-550 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-600/10'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/10'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* Action Triggers */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDetailsOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="View Profile Details"
                          >
                            <RxEyeOpen className="w-4 h-4" />
                          </button>

                          {isAdmin ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setIsFormOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                title="Edit Member"
                              >
                                <RxPencil1 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setIsDeleteOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                title="Delete Member"
                              >
                                <RxTrash className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                disabled
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                title="Edit locked (Requires Admin)"
                              >
                                <RxLockClosed className="w-4 h-4" />
                              </button>
                              <button
                                disabled
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                title="Delete locked (Requires Admin)"
                              >
                                <RxLockClosed className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Grid Layout */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {members.map((member) => (
              <div
                key={member._id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121826]/40 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-bold text-sm">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      member.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/10'
                        : member.status === 'Inactive'
                        ? 'bg-slate-100 text-slate-500 dark:bg-slate-800/40 dark:text-slate-400 border border-slate-600/10'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-500/10'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs py-2 border-y border-slate-100 dark:border-slate-850/50">
                  <div>
                    <span className="text-slate-400">Location</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                      {member.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Age / Role</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                      {member.age} yrs • {member.role}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsDetailsOpen(true);
                    }}
                    className="flex-1 py-2 px-3 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RxEyeOpen className="w-3.5 h-3.5" />
                    Details
                  </button>

                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setIsFormOpen(true);
                        }}
                        className="py-2 px-3 border border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RxPencil1 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setIsDeleteOpen(true);
                        }}
                        className="py-2 px-3 border border-slate-205 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-955/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RxTrash className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 py-2 px-3 text-[10px] text-slate-400 italic">
                      <RxLockClosed className="w-3.5 h-3.5" />
                      Actions Locked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Controls: Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-200/40 dark:border-slate-800/30">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>
                Showing page <span className="text-slate-800 dark:text-slate-200">{page}</span> of{' '}
                <span className="text-slate-800 dark:text-slate-200">{totalPages || 1}</span>
              </span>
              <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
              <span>
                Total Records:{' '}
                <span className="text-slate-800 dark:text-slate-200">{totalRecords}</span>
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              {/* Limit selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>Show:</span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/25 dark:border-slate-700 focus:outline-none text-slate-700 dark:text-slate-200 font-semibold"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
              </div>

              {/* Prev/Next Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors shadow-sm"
                  title="Previous Page"
                >
                  <RxChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors shadow-sm"
                  title="Next Page"
                >
                  <RxChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Database State */
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/30 dark:bg-[#121826]/10 shadow-sm text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mb-4 border border-indigo-500/10">
            <RxPerson className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            No Workspace Members
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm">
            We couldn't find any team members matching your search/filters or the database is currently empty.
          </p>
          {isAdmin ? (
            <button
              onClick={() => {
                setSelectedMember(null);
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md"
            >
              <RxPlus className="w-4 h-4" />
              Add First Member
            </button>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Please contact your administrator to add records.
            </p>
          )}
        </div>
      )}

      {/* Details Slide-Over Drawer */}
      <MemberDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
      />

      {/* Add / Edit Form Modal */}
      <MemberFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={handleFormSubmit}
        member={selectedMember}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleDeleteConfirm}
        memberName={selectedMember?.name || ''}
        loading={actionLoading}
      />
    </motion.div>
  );
}
