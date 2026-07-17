import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RxCross1,
  RxPerson,
  RxEnvelopeClosed,
  RxMobile,
  RxHome,
  RxCalendar,
  RxIdCard,
} from 'react-icons/rx';

export default function MemberDetailsModal({ isOpen, onClose, member }) {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md h-full bg-white dark:bg-[#121826] border-l border-slate-205 dark:border-slate-800 shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60 dark:border-slate-800/60 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-805 dark:text-slate-100">
                Member Profile Details
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RxCross1 className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card Banner */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-3xl font-extrabold mb-4 shadow-sm border border-indigo-200/10">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-150 mb-1">
                  {member.name}
                </h4>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      member.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : member.status === 'Inactive'
                        ? 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    {member.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Contact details
                </h5>

                <div className="flex items-center gap-3 text-sm">
                  <RxEnvelopeClosed className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Email Address</p>
                    <p className="text-slate-700 dark:text-slate-200 font-medium truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <RxMobile className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Phone Number</p>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">
                      {member.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <RxHome className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">City</p>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">
                      {member.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <RxIdCard className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Age</p>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">
                      {member.age} years
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit trail */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Audit logs
                </h5>

                <div className="flex items-center gap-3 text-sm">
                  <RxCalendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Created On</p>
                    <p className="text-slate-700 dark:text-slate-200 font-medium text-xs">
                      {new Date(member.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <RxCalendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Last Updated</p>
                    <p className="text-slate-700 dark:text-slate-200 font-medium text-xs">
                      {new Date(member.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <RxPerson className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">Created By</p>
                    <p className="text-slate-705 dark:text-slate-200 font-medium text-xs">
                      {member.createdBy?.name || 'Administrator'} ({member.createdBy?.email || 'N/A'})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
