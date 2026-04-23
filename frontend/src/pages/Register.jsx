import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { register as registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { ROLES } from '../constants';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const { register, handleSubmit } = useForm();

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated]);
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const onSubmit = (data) => dispatch(registerUser(data));

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    borderRadius: '12px', fontSize: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#f1f5f9', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: "'DM Sans', sans-serif"
  };

  const labelStyle = {
    fontSize: '13px', color: '#94a3b8', fontWeight: '500'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080c14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background orbs */}
      <div style={{
        position: 'fixed', top: '-160px', right: '-160px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-160px', left: '-160px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '12px', marginBottom: '32px'
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'rgba(34,211,238,0.15)',
            border: '1px solid rgba(34,211,238,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <TrendingUp size={20} color="#22d3ee" />
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '24px', fontWeight: '700',
            color: '#f1f5f9', margin: 0
          }}>FinanceOS</h1>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '22px', fontWeight: '700',
              color: '#f1f5f9', margin: '0 0 6px 0'
            }}>Create account</h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Join the finance dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                placeholder="Aamir Khan"
                {...register('name')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Role</label>
              <select
                {...register('role')}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="" style={{ backgroundColor: '#0d1424' }}>Select role</option>
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role} style={{ backgroundColor: '#0d1424' }}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                borderRadius: '12px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
                border: 'none', marginTop: '4px',
                background: loading ? 'rgba(34,211,238,0.5)' : 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                color: '#020617',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 24px rgba(34,211,238,0.25)',
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '24px', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: '500' }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}