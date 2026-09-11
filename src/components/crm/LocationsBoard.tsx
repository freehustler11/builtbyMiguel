import React, { useState, useEffect } from 'react'
import {
  Building2,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Power,
} from 'lucide-react'
import {
  getClientLocationsServerFn,
  createClientLocationServerFn,
  updateClientLocationServerFn,
  deleteClientLocationServerFn,
} from '../../server/clients'
import type { ClientLocation } from '../../db/schema'
import { ToastContainer, type ToastMessage } from '../Toast'
import { ConfirmModal } from '../ConfirmModal'

interface LocationsBoardProps {
  clientId: string
}

export function LocationsBoard({ clientId }: LocationsBoardProps) {
  const [locations, setLocations] = useState<ClientLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLoc, setEditingLoc] = useState<ClientLocation | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    gbpPlaceId: '',
    accessStatus: 'connected' as 'connected' | 'no_access' | 'not_applicable',
    accessNotes: '',
    isActive: true,
  })

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type, title, message },
    ])
  }

  const loadLocations = async () => {
    try {
      setLoading(true)
      const res = await getClientLocationsServerFn({ data: { clientId } })
      setLocations(res.locations || [])
    } catch (err: any) {
      addToast('error', 'Failed to load locations', err.message || 'Error fetching locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
  }, [clientId])

  const handleOpenAdd = () => {
    setEditingLoc(null)
    setFormData({
      name: '',
      address: '',
      gbpPlaceId: '',
      accessStatus: 'connected',
      accessNotes: '',
      isActive: true,
    })
    setModalOpen(true)
  }

  const handleOpenEdit = (loc: ClientLocation) => {
    setEditingLoc(loc)
    setFormData({
      name: loc.name,
      address: loc.address || '',
      gbpPlaceId: loc.gbpPlaceId || '',
      accessStatus: loc.accessStatus as any,
      accessNotes: loc.accessNotes || '',
      isActive: loc.isActive,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      addToast('error', 'Validation Error', 'Location name is required')
      return
    }

    try {
      setSubmitting(true)
      if (editingLoc) {
        await updateClientLocationServerFn({
          data: {
            id: editingLoc.id,
            name: formData.name,
            address: formData.address,
            gbpPlaceId: formData.gbpPlaceId,
            accessStatus: formData.accessStatus,
            accessNotes: formData.accessNotes,
            isActive: formData.isActive,
          },
        })
        addToast('success', 'Location Updated', `"${formData.name}" updated successfully.`)
      } else {
        await createClientLocationServerFn({
          data: {
            clientId,
            name: formData.name,
            address: formData.address,
            gbpPlaceId: formData.gbpPlaceId,
            accessStatus: formData.accessStatus,
            accessNotes: formData.accessNotes,
            isActive: formData.isActive,
          },
        })
        addToast('success', 'Location Created', `"${formData.name}" added to client profile.`)
      }
      setModalOpen(false)
      loadLocations()
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'Error saving location')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (loc: ClientLocation) => {
    try {
      await updateClientLocationServerFn({
        data: {
          id: loc.id,
          isActive: !loc.isActive,
        },
      })
      addToast(
        'success',
        loc.isActive ? 'Location Deactivated' : 'Location Activated',
        `"${loc.name}" is now ${loc.isActive ? 'inactive' : 'active'}.`
      )
      loadLocations()
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message || 'Error toggling location status')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteClientLocationServerFn({ data: { id: deleteId } })
      addToast('success', 'Location Removed', 'Location was successfully deleted or deactivated.')
      setDeleteId(null)
      loadLocations()
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message || 'Error removing location')
    }
  }

  const getStatusBorder = (status: 'connected' | 'no_access' | 'not_applicable') => {
    switch (status) {
      case 'connected':
        return 'border-l-[var(--success)]'
      case 'no_access':
        return 'border-l-[var(--danger)]'
      default:
        return 'border-l-[var(--muted)]'
    }
  }

  return (
    <div className="space-y-3.5">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Header card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-[8px] bg-[var(--panel)] border border-[var(--line)]">
        <div>
          <h3 className="text-[14px] font-medium text-[var(--ink)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--accent)]" />
            <span>Google Business Profile locations ({locations.length})</span>
          </h3>
          <p className="text-[12px] text-[var(--muted)] mt-0.5">
            Manage Google Business Profiles for multi-location clients. Each profile records its own metrics for reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadLocations}
            className="h-8 w-8 flex items-center justify-center rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] border border-[var(--line)] transition cursor-pointer"
            title="Refresh locations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[13px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add location</span>
          </button>
        </div>
      </div>

      {/* Locations Grid */}
      {loading && locations.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-[var(--muted)]">
          Loading locations...
        </div>
      ) : locations.length === 0 ? (
        <div className="p-4 rounded-[8px] border border-dashed border-[var(--line)] text-center sm:text-left bg-[var(--canvas)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-[13px] font-medium text-[var(--ink)]">No locations registered</p>
            <p className="text-[12px] text-[var(--muted)]">
              Add storefront or service area profiles to log Google Business Profile performance.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-[12px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add first location</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className={`p-4 rounded-[8px] border border-[var(--line)] border-l-2 ${getStatusBorder(loc.accessStatus as any)} transition-all flex flex-col justify-between space-y-3 ${
                loc.isActive
                  ? 'bg-[var(--panel)]'
                  : 'bg-[var(--canvas)] opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-[15px] font-medium text-[var(--ink)] truncate" title={loc.name}>
                      {loc.name}
                    </h4>
                    {loc.address ? (
                      <p className="text-[13px] text-[var(--muted)] flex items-center gap-1 truncate" title={loc.address}>
                        <MapPin className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                        <span className="truncate">{loc.address}</span>
                      </p>
                    ) : (
                      <p className="text-[13px] text-[var(--muted)] italic">No address specified</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-[6px] text-[11px] font-medium shrink-0 border border-[var(--line)] bg-[var(--canvas)] ${
                      loc.accessStatus === 'connected'
                        ? 'text-[var(--success)]'
                        : loc.accessStatus === 'no_access'
                        ? 'text-[var(--danger)]'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {loc.accessStatus === 'connected' ? 'Connected' : loc.accessStatus === 'no_access' ? 'No access' : 'N/A'}
                  </span>
                </div>

                {loc.gbpPlaceId && (
                  <div className="text-[11px] text-[var(--muted)] truncate" title={loc.gbpPlaceId}>
                    Place ID: {loc.gbpPlaceId}
                  </div>
                )}

                {loc.accessNotes && (
                  <p className="text-[11px] text-[var(--muted)] bg-[var(--canvas)] p-2 rounded-[6px] border border-[var(--line)] line-clamp-2" title={loc.accessNotes}>
                    {loc.accessNotes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(loc)}
                  className={`inline-flex items-center gap-1.5 px-2.5 h-7 rounded-[6px] text-[11px] font-medium transition cursor-pointer border border-[var(--line)] ${
                    loc.isActive
                      ? 'text-[var(--success)] bg-[var(--canvas)]'
                      : 'text-[var(--muted)] bg-[var(--panel)]'
                  }`}
                  title={loc.isActive ? 'Deactivate Location' : 'Activate Location'}
                >
                  <Power className="w-3 h-3" />
                  <span>{loc.isActive ? 'Active' : 'Inactive'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(loc)}
                    className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition"
                    title="Edit Location"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(loc.id)}
                    className="p-1 rounded-[6px] text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--canvas)] transition"
                    title="Delete Location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h3 className="text-[15px] font-medium text-[var(--ink)] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--accent)]" />
                <span>{editingLoc ? 'Edit location' : 'Add Google Business Profile location'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--ink)] text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Location name <span className="text-[var(--danger)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downtown Flagship, Westside Branch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Street address / area
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main St, Suite 400, Denver, CO"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  GBP place ID (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                  value={formData.gbpPlaceId}
                  onChange={(e) => setFormData({ ...formData, gbpPlaceId: e.target.value })}
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Google Business Profile access status
                </label>
                <select
                  value={formData.accessStatus}
                  onChange={(e) => setFormData({ ...formData, accessStatus: e.target.value as any })}
                  className="w-full h-8 px-3 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="connected">Connected (Access Active)</option>
                  <option value="no_access">No Access (Permission Pending)</option>
                  <option value="not_applicable">Not Applicable (Excluded)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-[var(--ink)]">
                  Access notes / delegation follow-up
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Waiting on manager invite to info@agency.com"
                  value={formData.accessNotes}
                  onChange={(e) => setFormData({ ...formData, accessNotes: e.target.value })}
                  className="w-full p-2.5 rounded-[6px] border border-[var(--line)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="locIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <label htmlFor="locIsActive" className="text-[var(--ink)] font-normal">
                  Active location (included in monthly KPI tracking)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-8 px-3 rounded-[6px] border border-[var(--line)] text-[var(--ink)] bg-[var(--panel)] hover:bg-[var(--canvas)] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-8 px-3 rounded-[6px] font-medium text-white bg-[var(--accent)] hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingLoc ? 'Save changes' : 'Add location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Client Location"
        description="Are you sure you want to remove this location? If this location has historical monthly metrics recorded, it will be safely deactivated instead to protect historical report records."
        confirmText="Remove Location"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
