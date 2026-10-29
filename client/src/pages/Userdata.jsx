import React, { useState, useEffect, useMemo } from 'react';
import API from '../api/api';
import CustomerModal from '../components/CustomerModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Building2, 
  Mail, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  TrendingUp,
  Award,
  Sparkles,
  MessageSquare
} from 'lucide-react';

const STATUS_COLORS = {
  Lead: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Qualified: 'bg-purple-50 text-purple-700 border-purple-200',
  'Proposal Sent': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Closed Won': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closed Lost': 'bg-rose-50 text-rose-700 border-rose-200',
};

const Userdata = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal state
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await API.get('/customers', { params });
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.message || 'Failed to load customer records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search query
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus]);

  // Show transient alert message
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Handle Add or Edit Customer submission
  const handleModalSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingCustomer) {
        // Update existing customer (PUT)
        const res = await API.put(`/customers/${editingCustomer._id}`, formData);
        if (res.data.success) {
          showAlert('success', 'Customer record updated successfully!');
          setIsModalOpen(false);
          setEditingCustomer(null);
          fetchCustomers();
        }
      } else {
        // Create new customer (POST)
        const res = await API.post('/customers', formData);
        if (res.data.success) {
          showAlert('success', 'New customer added successfully!');
          setIsModalOpen(false);
          fetchCustomers();
        }
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      showAlert('error', err.response?.data?.message || 'Failed to save customer record.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      const res = await API.delete(`/customers/${customerToDelete._id}`);
      if (res.data.success) {
        showAlert('success', 'Customer deleted successfully!');
        setCustomerToDelete(null);
        fetchCustomers();
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      showAlert('error', err.response?.data?.message || 'Failed to delete customer.');
    } finally {
      setDeleting(false);
    }
  };

  // Calculated Statistics
  const stats = useMemo(() => {
    const total = customers.length;
    const leads = customers.filter((c) => c.status === 'Lead').length;
    const qualified = customers.filter((c) => c.status === 'Qualified').length;
    const closedWon = customers.filter((c) => c.status === 'Closed Won').length;
    return { total, leads, qualified, closedWon };
  }, [customers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            CRM Pipeline Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Customer Relationship Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your accounts, track lead progression, and maintain sales contacts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            title="Refresh Customer List"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Floating Alert Messages */}
      {alert && (
        <div
          className={`mt-4 p-4 rounded-xl border flex items-center justify-between transition-all animate-in fade-in duration-200 ${
            alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5 font-medium text-sm">
            {alert.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            {alert.message}
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-xs font-semibold uppercase tracking-wider hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</div>
          <span className="text-xs text-slate-400 mt-1 block">Active across all stages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              New Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.leads}</div>
          <span className="text-xs text-slate-400 mt-1 block">Awaiting qualification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Qualified
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.qualified}</div>
          <span className="text-xs text-slate-400 mt-1 block">High potential prospects</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Closed Won
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{stats.closedWon}</div>
          <span className="text-xs text-slate-400 mt-1 block">Successfully converted</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email, phone..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          >
            <option value="All">All Pipeline Stages</option>
            <option value="Lead">Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table on desktop, Cards on mobile */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-slate-500">Loading customer records...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">Error Loading Data</h3>
          <p className="text-sm text-slate-500 mt-1">{error}</p>
          <button
            onClick={fetchCustomers}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Customers Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedStatus !== 'All'
              ? 'No customer records match your filter criteria. Try adjusting your search query.'
              : 'Your CRM database has no customers yet. Click below to add your first customer!'}
          </p>
          <button
            onClick={() => {
              setEditingCustomer(null);
              setIsModalOpen(true);
            }}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Add First Customer
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Responsive Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Customer / Contact</th>
                  <th className="py-3.5 px-6">Company</th>
                  <th className="py-3.5 px-6">Phone</th>
                  <th className="py-3.5 px-6">Pipeline Status</th>
                  <th className="py-3.5 px-6">Source</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & Email */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{cust.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {cust.email}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-6 text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {cust.company}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {cust.phone}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          STATUS_COLORS[cust.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="py-4 px-6 text-xs text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                        {cust.source || 'Website'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingCustomer(cust);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        title="Edit Customer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setCustomerToDelete(cust)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {customers.map((cust) => (
              <div
                key={cust._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{cust.name}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {cust.company}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        STATUS_COLORS[cust.status] || 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      {cust.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {cust.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {cust.phone}
                    </div>
                    {cust.notes && (
                      <div className="flex items-start gap-2 pt-1 text-slate-500">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cust.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    Source: {cust.source || 'Website'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCustomer(cust);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setCustomerToDelete(cust)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingCustomer}
        isSubmitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center">
              Delete Customer?
            </h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              Are you sure you want to delete{' '}
              <strong className="text-slate-700">{customerToDelete.name}</strong> ({customerToDelete.company})?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                disabled={deleting}
                className="w-1/2 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="w-1/2 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm shadow-rose-200 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdata;
