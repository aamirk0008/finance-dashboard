import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Eye, BarChart2, Trash2,
  X, Check, ToggleLeft, ToggleRight, Filter
} from 'lucide-react';
import {
  fetchUsers, updateRole,
  updateStatus, deleteUser
} from '../store/slices/userSlice';
import { formatDate } from '../utils/formatDate';
import { ROLES } from '../constants';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import toast from 'react-hot-toast';

const cardStyle = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  fontFamily: "'DM Sans', sans-serif"
};

const inputStyle = {
  padding: '9px 14px', borderRadius: '10px',
  fontSize: '13px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#f1f5f9', outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.2s', cursor: 'pointer',
  boxSizing: 'border-box'
};

const roleConfig = {
  admin: { color: '#22d3ee', bg: 'rgba(34,211,238,0.10)', border: 'rgba(34,211,238,0.20)', icon: Shield },
  analyst: { color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.20)', icon: BarChart2 },
  viewer: { color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.20)', icon: Eye },
};

// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

// Role Modal
function RoleModal({ isOpen, onClose, onSubmit, loading, user }) {
  const [role, setRole] = useState('');
  useEffect(() => { if (user) setRole(user.role); }, [user]);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)', zIndex: 40, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '380px',
            background: 'rgba(13,20,36,0.98)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '20px',
            padding: 'clamp(20px, 5vw, 28px)',
            fontFamily: "'DM Sans', sans-serif",
            maxHeight: '90vh', overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
              Update Role
            </h3>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: '8px', padding: '6px', cursor: 'pointer',
              color: '#64748b', display: 'flex', alignItems: 'center'
            }}><X size={16} /></button>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: '20px'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(34,211,238,0.15)',
              border: '1px solid rgba(34,211,238,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: '#22d3ee', flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '14px', color: '#e2e8f0', margin: '0 0 2px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {Object.values(ROLES).map((r) => {
              const rc = roleConfig[r];
              const RoleIcon = rc.icon;
              const selected = role === r;
              return (
                <motion.button key={r} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => setRole(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '12px',
                    cursor: 'pointer', textAlign: 'left',
                    background: selected ? rc.bg : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selected ? rc.border : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: rc.bg, border: `1px solid ${rc.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <RoleIcon size={15} color={rc.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: selected ? rc.color : '#94a3b8', margin: '0 0 2px', textTransform: 'capitalize' }}>
                      {r}
                    </p>
                    <p style={{ fontSize: '11px', color: '#334155', margin: 0 }}>
                      {r === 'admin' ? 'Full access' : r === 'analyst' ? 'Read + analytics' : 'View only'}
                    </p>
                  </div>
                  {selected && <Check size={15} color={rc.color} />}
                </motion.button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '11px', borderRadius: '10px', fontSize: '13px',
              cursor: 'pointer', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b', fontFamily: "'DM Sans', sans-serif"
            }}>Cancel</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => onSubmit(role)}
              disabled={loading || role === user?.role}
              style={{
                flex: 1, padding: '11px', borderRadius: '10px', fontSize: '13px',
                fontWeight: '600', cursor: 'pointer', border: 'none',
                background: role !== user?.role ? 'linear-gradient(135deg, #22d3ee, #06b6d4)' : 'rgba(255,255,255,0.05)',
                color: role !== user?.role ? '#020617' : '#334155',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                opacity: role === user?.role ? 0.5 : 1
              }}>
              {loading ? <Spinner size="sm" /> : <Check size={15} />}
              Update Role
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Delete Modal
function DeleteModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)', zIndex: 40, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '360px',
          background: 'rgba(13,20,36,0.98)',
          border: '1px solid rgba(244,63,94,0.20)',
          borderRadius: '20px', padding: '28px',
          textAlign: 'center', fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'rgba(244,63,94,0.10)', border: '1px solid rgba(244,63,94,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <Trash2 size={20} color="#f43f5e" />
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px' }}>
          Delete User
        </h3>
        <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 24px' }}>
          This will permanently delete the user account.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px',
            cursor: 'pointer', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b', fontFamily: "'DM Sans', sans-serif"
          }}>Cancel</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onConfirm} disabled={loading}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', border: 'none',
              background: '#f43f5e', color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}>
            {loading ? <Spinner size="sm" /> : <Trash2 size={14} />}
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mobile user card
function UserCard({ u, currentUserId, onRoleModal, onDeleteModal, onToggleStatus }) {
  const rc = roleConfig[u.role];
  const RoleIcon = rc.icon;
  const isSelf = u._id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        opacity: isSelf ? 0.75 : 1
      }}
    >
      {/* Top row — avatar + name + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: rc.bg, border: `1px solid ${rc.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '700', color: rc.color, flexShrink: 0
        }}>
          {u.name?.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '13px', fontWeight: '600', color: '#e2e8f0',
            margin: '0 0 2px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {u.name}
            {isSelf && <span style={{ fontSize: '10px', color: '#334155', marginLeft: '6px' }}>(you)</span>}
          </p>
          <p style={{
            fontSize: '11px', color: '#475569', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {u.email}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <motion.button
            whileTap={!isSelf ? { scale: 0.9 } : {}}
            onClick={() => !isSelf && onRoleModal(u)}
            disabled={isSelf}
            style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.15)',
              cursor: isSelf ? 'not-allowed' : 'pointer',
              color: '#22d3ee', opacity: isSelf ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            <Shield size={13} />
          </motion.button>
          <motion.button
            whileTap={!isSelf ? { scale: 0.9 } : {}}
            onClick={() => !isSelf && onDeleteModal(u._id)}
            disabled={isSelf}
            style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.15)',
              cursor: isSelf ? 'not-allowed' : 'pointer',
              color: '#f43f5e', opacity: isSelf ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>

      {/* Bottom row — role + status + joined */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Role badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '3px 8px', borderRadius: '6px',
          background: rc.bg, border: `1px solid ${rc.border}`
        }}>
          <RoleIcon size={11} color={rc.color} />
          <span style={{ fontSize: '11px', color: rc.color, textTransform: 'capitalize', fontWeight: '500' }}>
            {u.role}
          </span>
        </div>

        {/* Status toggle */}
        <motion.button
          whileHover={!isSelf ? { scale: 1.03 } : {}}
          onClick={() => !isSelf && onToggleStatus(u)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', borderRadius: '6px', border: 'none',
            background: u.isActive ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
            color: u.isActive ? '#10b981' : '#f43f5e',
            fontSize: '11px', fontWeight: '600',
            cursor: isSelf ? 'default' : 'pointer',
            fontFamily: "'DM Sans', sans-serif"
          }}>
          {u.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
          {u.isActive ? 'Active' : 'Inactive'}
        </motion.button>

        {/* Joined */}
        <span style={{ fontSize: '11px', color: '#334155', marginLeft: 'auto' }}>
          {formatDate(u.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}

export default function Users() {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((s) => s.users);
  const { user: currentUser } = useSelector((s) => s.auth);
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (roleFilter) params.role = roleFilter;
    dispatch(fetchUsers(params));
  }, [page, roleFilter]);

  const handleUpdateRole = async (role) => {
    setActionLoading(true);
    const res = await dispatch(updateRole({ id: selectedUser._id, role }));
    setActionLoading(false);
    if (!res.error) { toast.success('Role updated'); setRoleModalOpen(false); setSelectedUser(null); }
    else toast.error(res.payload || 'Failed to update role');
  };

  const handleToggleStatus = async (user) => {
    const res = await dispatch(updateStatus({ id: user._id, isActive: !user.isActive }));
    if (!res.error) toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
    else toast.error(res.payload || 'Failed to update status');
  };

  const handleDelete = async () => {
    setActionLoading(true);
    const res = await dispatch(deleteUser(deleteId));
    setActionLoading(false);
    if (!res.error) { toast.success('User deleted'); setDeleteModalOpen(false); setDeleteId(null); }
    else toast.error(res.payload || 'Failed to delete user');
  };

  const openRoleModal = (user) => { setSelectedUser(user); setRoleModalOpen(true); };
  const openDeleteModal = (id) => { setDeleteId(id); setDeleteModalOpen(true); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
      >
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: '700', color: '#f1f5f9', margin: '0 0 4px' }}>
            User Management
          </h1>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            {pagination?.total || 0} total users
          </p>
        </div>

        {/* Role stats */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.values(ROLES).map(r => {
            const rc = roleConfig[r];
            const count = list.filter(u => u.role === r).length;
            return (
              <div key={r} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '8px',
                background: rc.bg, border: `1px solid ${rc.border}`
              }}>
                <span style={{ fontSize: '11px', color: rc.color, textTransform: 'capitalize', fontWeight: '500' }}>{r}</span>
                <span style={{ fontSize: '11px', color: rc.color, fontFamily: "'JetBrains Mono', monospace" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          ...cardStyle, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'
        }}
      >
        <Filter size={15} color="#475569" />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          style={{ ...inputStyle, flex: isMobile ? 1 : 'none' }}>
          <option value="" style={{ backgroundColor: '#0d1424' }}>All Roles</option>
          {Object.values(ROLES).map(r => (
            <option key={r} value={r} style={{ backgroundColor: '#0d1424' }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
        {roleFilter && (
          <button onClick={() => setRoleFilter('')} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 14px', borderRadius: '10px', fontSize: '12px',
            cursor: 'pointer', background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.15)',
            color: '#f43f5e', fontFamily: "'DM Sans', sans-serif"
          }}>
            <X size={13} /> Clear
          </button>
        )}
      </motion.div>

      {/* Table / Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ ...cardStyle, overflow: 'hidden' }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <Spinner size="lg" />
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569', fontSize: '14px' }}>
            No users found
          </div>
        ) : isMobile ? (
          // Mobile card view
          <>
            {list.map((u) => (
              <UserCard
                key={u._id}
                u={u}
                currentUserId={currentUser?._id}
                onRoleModal={openRoleModal}
                onDeleteModal={openDeleteModal}
                onToggleStatus={handleToggleStatus}
              />
            ))}
            <div style={{ padding: '12px 16px' }}>
              <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
            </div>
          </>
        ) : (
          // Desktop table view
          <div style={{ overflowX: 'auto' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
              padding: '12px 20px', minWidth: '680px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: '11px', fontWeight: '600',
              color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em'
            }}>
              <span>User</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span style={{ textAlign: 'right' }}>Actions</span>
            </div>

            {list.map((u, i) => {
              const rc = roleConfig[u.role];
              const RoleIcon = rc.icon;
              const isSelf = u._id === currentUser?._id;

              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
                    padding: '14px 20px', minWidth: '680px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center', transition: 'background 0.15s',
                    opacity: isSelf ? 0.7 : 1
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: rc.bg, border: `1px solid ${rc.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '700', color: rc.color, flexShrink: 0
                    }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0, fontWeight: '500' }}>
                      {u.name}
                      {isSelf && <span style={{ fontSize: '10px', color: '#334155', marginLeft: '6px' }}>(you)</span>}
                    </p>
                  </div>

                  <span style={{ fontSize: '12px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      background: rc.bg, border: `1px solid ${rc.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <RoleIcon size={12} color={rc.color} />
                    </div>
                    <span style={{ fontSize: '12px', color: rc.color, textTransform: 'capitalize', fontWeight: '500' }}>
                      {u.role}
                    </span>
                  </div>

                  <motion.button
                    whileHover={!isSelf ? { scale: 1.05 } : {}}
                    onClick={() => !isSelf && handleToggleStatus(u)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: '600',
                      cursor: isSelf ? 'default' : 'pointer', border: 'none',
                      background: u.isActive ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
                      color: u.isActive ? '#10b981' : '#f43f5e',
                      fontFamily: "'DM Sans', sans-serif", width: 'fit-content'
                    }}>
                    {u.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    {u.isActive ? 'Active' : 'Inactive'}
                  </motion.button>

                  <span style={{ fontSize: '12px', color: '#334155' }}>{formatDate(u.createdAt)}</span>

                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <motion.button
                      whileHover={!isSelf ? { scale: 1.1 } : {}}
                      whileTap={!isSelf ? { scale: 0.9 } : {}}
                      onClick={() => !isSelf && openRoleModal(u)}
                      disabled={isSelf}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)',
                        cursor: isSelf ? 'not-allowed' : 'pointer',
                        color: '#22d3ee', opacity: isSelf ? 0.3 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      <Shield size={13} />
                    </motion.button>
                    <motion.button
                      whileHover={!isSelf ? { scale: 1.1 } : {}}
                      whileTap={!isSelf ? { scale: 0.9 } : {}}
                      onClick={() => !isSelf && openDeleteModal(u._id)}
                      disabled={isSelf}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)',
                        cursor: isSelf ? 'not-allowed' : 'pointer',
                        color: '#f43f5e', opacity: isSelf ? 0.3 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      <Trash2 size={13} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}

            <div style={{ padding: '12px 20px' }}>
              <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
            </div>
          </div>
        )}
      </motion.div>

      <RoleModal
        isOpen={roleModalOpen}
        onClose={() => { setRoleModalOpen(false); setSelectedUser(null); }}
        onSubmit={handleUpdateRole}
        loading={actionLoading}
        user={selectedUser}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}