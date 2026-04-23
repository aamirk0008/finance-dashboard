import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, ArrowUpRight,
  ArrowDownRight, Edit2, Trash2, X, Check
} from 'lucide-react';
import {
  fetchTransactions, createTransaction,
  updateTransaction, deleteTransaction
} from '../store/slices/transactionSlice';
import { setFilters, setPage, clearFilters } from '../store/slices/transactionSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { isAdmin } from '../utils/roleGuard';
import { CATEGORIES, TRANSACTION_TYPES } from '../constants';
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
  transition: 'border-color 0.2s'
};

const selectStyle = {
  ...inputStyle, cursor: 'pointer',
  appearance: 'none', paddingRight: '12px'
};

// Modal component inline
function TransactionModal({ isOpen, onClose, onSubmit, loading, editData }) {
  const [form, setForm] = useState({
    amount: '', type: 'income', category: 'salary',
    date: new Date().toISOString().split('T')[0], notes: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        amount: editData.amount || '',
        type: editData.type || 'income',
        category: editData.category || 'salary',
        date: editData.date ? new Date(editData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: editData.notes || ''
      });
    } else {
      setForm({ amount: '', type: 'income', category: 'salary', date: new Date().toISOString().split('T')[0], notes: '' });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 40, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.4 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '440px',
            background: 'rgba(13,20,36,0.98)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '20px', padding: '28px',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>
              {editData ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: '8px', padding: '6px', cursor: 'pointer',
              color: '#64748b', display: 'flex', alignItems: 'center'
            }}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Amount */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Amount (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Type + Category row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }}
                >
                  {TRANSACTION_TYPES.map(t => (
                    <option key={t.value} value={t.value} style={{ backgroundColor: '#0d1424' }}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} style={{ backgroundColor: '#0d1424' }}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Notes (optional)</label>
              <textarea
                placeholder="Add a note..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                rows={2}
                style={{
                  ...inputStyle, width: '100%', boxSizing: 'border-box',
                  resize: 'none', lineHeight: '1.5'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: '11px',
                  borderRadius: '10px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', fontFamily: "'DM Sans', sans-serif"
                }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, padding: '11px',
                  borderRadius: '10px', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                  color: '#020617', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                {loading ? <Spinner size="sm" /> : <Check size={15} />}
                {editData ? 'Update' : 'Create'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Delete confirm modal
function DeleteModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 40, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '360px',
          background: 'rgba(13,20,36,0.98)',
          border: '1px solid rgba(244,63,94,0.20)',
          borderRadius: '20px', padding: '28px',
          textAlign: 'center',
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: 'rgba(244,63,94,0.10)',
          border: '1px solid rgba(244,63,94,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Trash2 size={20} color="#f43f5e" />
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px' }}>
          Delete Transaction
        </h3>
        <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 24px' }}>
          This action cannot be undone. The transaction will be soft deleted.
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: '10px',
            fontSize: '13px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b', fontFamily: "'DM Sans', sans-serif"
          }}>Cancel</button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              border: 'none', background: '#f43f5e',
              color: '#fff', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            {loading ? <Spinner size="sm" /> : <Trash2 size={14} />}
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Transactions() {
  const dispatch = useDispatch();
  const { list, pagination, filters, loading } = useSelector((s) => s.transactions);
  const { user } = useSelector((s) => s.auth);
  const admin = isAdmin(user?.role);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    params.page = filters.page;
    params.limit = filters.limit;
    dispatch(fetchTransactions(params));
  }, [filters]);

  const handleCreate = async (data) => {
    setActionLoading(true);
    const res = await dispatch(createTransaction(data));
    setActionLoading(false);
    if (!res.error) {
      toast.success('Transaction created');
      setModalOpen(false);
    } else {
      toast.error(res.payload || 'Failed to create');
    }
  };

  const handleUpdate = async (data) => {
    setActionLoading(true);
    const res = await dispatch(updateTransaction({ id: editData._id, data }));
    setActionLoading(false);
    if (!res.error) {
      toast.success('Transaction updated');
      setModalOpen(false);
      setEditData(null);
    } else {
      toast.error(res.payload || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    const res = await dispatch(deleteTransaction(deleteId));
    setActionLoading(false);
    if (!res.error) {
      toast.success('Transaction deleted');
      setDeleteModalOpen(false);
      setDeleteId(null);
    } else {
      toast.error(res.payload || 'Failed to delete');
    }
  };

  const openEdit = (t) => { setEditData(t); setModalOpen(true); };
  const openDelete = (id) => { setDeleteId(id); setDeleteModalOpen(true); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 4px' }}>
            Transactions
          </h1>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            {pagination?.total || 0} total records
          </p>
        </div>

        {admin && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setEditData(null); setModalOpen(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '12px',
              fontSize: '13px', fontWeight: '600',
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              color: '#020617', border: 'none', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(34,211,238,0.25)',
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            <Plus size={16} />
            New Transaction
          </motion.button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          ...cardStyle, padding: '16px 20px',
          display: 'flex', alignItems: 'center',
          gap: '12px', flexWrap: 'wrap'
        }}
      >
        <Filter size={15} color="#475569" />

        <select
          value={filters.type}
          onChange={e => dispatch(setFilters({ type: e.target.value }))}
          style={{ ...selectStyle }}
        >
          <option value="" style={{ backgroundColor: '#0d1424' }}>All Types</option>
          {TRANSACTION_TYPES.map(t => (
            <option key={t.value} value={t.value} style={{ backgroundColor: '#0d1424' }}>{t.label}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={e => dispatch(setFilters({ category: e.target.value }))}
          style={{ ...selectStyle }}
        >
          <option value="" style={{ backgroundColor: '#0d1424' }}>All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c} style={{ backgroundColor: '#0d1424' }}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={e => dispatch(setFilters({ startDate: e.target.value }))}
          style={{ ...inputStyle, colorScheme: 'dark' }}
          onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={e => dispatch(setFilters({ endDate: e.target.value }))}
          style={{ ...inputStyle, colorScheme: 'dark' }}
          onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />

        {(filters.type || filters.category || filters.startDate || filters.endDate) && (
          <button
            onClick={() => dispatch(clearFilters())}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 14px', borderRadius: '10px',
              fontSize: '12px', cursor: 'pointer',
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.15)',
              color: '#f43f5e', fontFamily: "'DM Sans', sans-serif"
            }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </motion.div>

      {/* Table */}
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
            No transactions found
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: admin ? '1fr 1fr 1fr 1fr 1fr 100px' : '1fr 1fr 1fr 1fr 1fr',
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: '11px', fontWeight: '600',
              color: '#334155', textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              <span>Type</span>
              <span>Category</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Notes</span>
              {admin && <span style={{ textAlign: 'right' }}>Actions</span>}
            </div>

            {/* Table rows */}
            {list.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: admin ? '1fr 1fr 1fr 1fr 1fr 100px' : '1fr 1fr 1fr 1fr 1fr',
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: t.type === 'income' ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {t.type === 'income'
                      ? <ArrowUpRight size={14} color="#10b981" />
                      : <ArrowDownRight size={14} color="#f43f5e" />
                    }
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: '600',
                    color: t.type === 'income' ? '#10b981' : '#f43f5e',
                    textTransform: 'capitalize'
                  }}>{t.type}</span>
                </div>

                {/* Category */}
                <span style={{
                  fontSize: '13px', color: '#94a3b8',
                  textTransform: 'capitalize',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '3px 10px', borderRadius: '6px',
                  display: 'inline-block', width: 'fit-content'
                }}>{t.category}</span>

                {/* Amount */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px', fontWeight: '600',
                  color: t.type === 'income' ? '#10b981' : '#f43f5e'
                }}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>

                {/* Date */}
                <span style={{ fontSize: '12px', color: '#475569' }}>
                  {formatDate(t.date)}
                </span>

                {/* Notes */}
                <span style={{
                  fontSize: '12px', color: '#334155',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{t.notes || '—'}</span>

                {/* Actions */}
                {admin && (
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(t)}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        background: 'rgba(34,211,238,0.08)',
                        border: '1px solid rgba(34,211,238,0.15)',
                        cursor: 'pointer', color: '#22d3ee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Edit2 size={13} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openDelete(t._id)}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        background: 'rgba(244,63,94,0.08)',
                        border: '1px solid rgba(244,63,94,0.15)',
                        cursor: 'pointer', color: '#f43f5e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={13} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Pagination */}
            <div style={{ padding: '12px 20px' }}>
              <Pagination
                pagination={pagination}
                onPageChange={(page) => dispatch(setPage(page))}
              />
            </div>
          </>
        )}
      </motion.div>

      {/* Modals */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSubmit={editData ? handleUpdate : handleCreate}
        loading={actionLoading}
        editData={editData}
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