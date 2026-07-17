import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { RxCross1 } from 'react-icons/rx';

export default function MemberFormModal({
  isOpen,
  onClose,
  onSubmit,
  member,
  loading,
}) {
  const isEdit = !!member;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form controls when modal mounts or values change
  useEffect(() => {
    if (isOpen) {
      if (member) {
        reset({
          name: member.name,
          email: member.email,
          phone: member.phone,
          age: member.age,
          city: member.city,
          role: member.role,
          status: member.status,
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          age: '',
          city: '',
          role: 'User',
          status: 'Active',
        });
      }
    }
  }, [isOpen, member, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#121826] border border-slate-200/80 dark:border-slate-800/80 shadow-xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors"
              disabled={loading}
            >
              <RxCross1 className="w-4 h-4" />
            </button>

            {/* Header section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {isEdit ? 'Update Member Record' : 'Add New Workspace Member'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {isEdit
                  ? 'Modify credentials and permissions for the selected workspace profile.'
                  : 'Invite a new team member with custom access roles and cities.'}
              </p>
            </div>

            {/* Form Fields */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 overflow-y-auto pr-1 flex-1"
            >
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                    errors.name
                      ? 'border-rose-500 dark:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  disabled={loading}
                  {...register('name', { required: 'Full name is required' })}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                      errors.email
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    disabled={loading}
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Invalid email address format',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                      errors.phone
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    disabled={loading}
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Age & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                      errors.age
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    disabled={loading}
                    {...register('age', {
                      required: 'Age is required',
                      min: { value: 18, message: 'Minimum age is 18' },
                      max: { value: 100, message: 'Maximum age is 100' },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.age && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800/85 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                      errors.city
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    disabled={loading}
                    {...register('city', { required: 'City is required' })}
                  />
                  {errors.city && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Workspace Role
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-sm bg-slate-50 dark:bg-[#182030] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all"
                    disabled={loading}
                    {...register('role')}
                  >
                    <option value="User">User (Standard Member)</option>
                    <option value="Admin">Admin (Workspace Manager)</option>
                    <option value="Guest">Guest (Temporary View)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Activity Status
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-sm bg-slate-50 dark:bg-[#182030] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all"
                    disabled={loading}
                    {...register('status')}
                  >
                    <option value="Active">Active (Joined)</option>
                    <option value="Pending">Pending (Invited)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-650/15 hover:shadow-indigo-600/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : isEdit ? (
                    'Save Changes'
                  ) : (
                    'Add Member'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
