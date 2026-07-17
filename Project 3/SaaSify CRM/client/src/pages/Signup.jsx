import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'User',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password, data.role);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0b0f19] overflow-hidden">
      {/* Decorative blurred backdrops */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl dark:bg-indigo-500/5 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl dark:bg-cyan-500/5 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-[#121826]/60 backdrop-blur-xl shadow-xl z-10"
      >
        {/* Brand/Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-2xl shadow-lg shadow-indigo-500/20 mb-3">
            S
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-400 dark:text-slate-450 text-sm mt-1">
            Get started with your free CRM directory
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Sarah Jenkins"
              className={`w-full px-4 py-3 rounded-2xl border text-sm bg-slate-50/50 dark:bg-slate-900/40 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                errors.name
                  ? 'border-rose-500 focus:ring-rose-500'
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

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className={`w-full px-4 py-3 rounded-2xl border text-sm bg-slate-50/50 dark:bg-slate-900/40 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              disabled={loading}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-2xl border text-sm bg-slate-50/50 dark:bg-slate-900/40 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-205 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              disabled={loading}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role selection for testing */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Workspace Role (For Testing)
            </label>
            <select
              className="w-full px-4 py-3 rounded-2xl border border-slate-205 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-sm bg-slate-50/50 dark:bg-[#182030] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition-all"
              disabled={loading}
              {...register('role')}
            >
              <option value="User">User (Standard Access)</option>
              <option value="Admin">Admin (Full Access)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-6 glow-indigo"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
