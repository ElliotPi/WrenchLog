import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { SectionCard } from '../components/common/SectionCard'
import { useAppState } from '../hooks/useAppState'
import { createId } from '../utils/ids'
import { ui } from '../utils/ui'
import { serviceRecordFormSchema, type ServiceRecordFormData, type ServiceRecordFormValues } from '../utils/validators'
import { getVehicleById, getVehicleDisplayName } from '../utils/vehicle'

interface ServiceRecordFormPageProps {
  mode: 'create' | 'edit'
}

const defaultValues: ServiceRecordFormValues = {
  serviceType: '',
  date: new Date().toISOString().slice(0, 10),
  mileage: '0',
  cost: '',
  notes: '',
}

const serviceOptions = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Battery Replacement',
  'Coolant Flush',
  'Air Filter Replacement',
  'Transmission Service',
  'Custom',
]

export function ServiceRecordFormPage({ mode }: ServiceRecordFormPageProps) {
  const { vehicleId, recordId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppState()
  const vehicle = vehicleId ? getVehicleById(state.vehicles, vehicleId) : undefined
  const record = recordId
    ? state.serviceRecords.find((item) => item.id === recordId && item.vehicleId === vehicleId)
    : undefined

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceRecordFormValues, undefined, ServiceRecordFormData>({
    resolver: zodResolver(serviceRecordFormSchema),
    defaultValues: record
      ? {
          serviceType: record.serviceType,
          date: record.date,
          mileage: String(record.mileage),
          cost: record.cost === undefined ? '' : String(record.cost),
          notes: record.notes ?? '',
        }
      : defaultValues,
  })

  useEffect(() => {
    if (record) {
      reset({
        serviceType: record.serviceType,
        date: record.date,
        mileage: String(record.mileage),
        cost: record.cost === undefined ? '' : String(record.cost),
        notes: record.notes ?? '',
      })
      return
    }

    reset(defaultValues)
  }, [record, reset])

  if (!vehicle) {
    return (
      <EmptyState
        eyebrow="Service record"
        title="Vehicle not found"
        description="Select a valid vehicle before logging maintenance."
        action={
          <Link className={ui.buttonPrimary} to="/vehicles">
            Back to vehicles
          </Link>
        }
      />
    )
  }

  if (mode === 'edit' && !record) {
    return (
      <EmptyState
        eyebrow="Edit service"
        title="Service record not found"
        description="The record you are trying to edit is missing or does not belong to this vehicle."
        action={
          <Link className={ui.buttonPrimary} to={`/vehicles/${vehicle.id}/history`}>
            Back to history
          </Link>
        }
      />
    )
  }

  const currentVehicle = vehicle

  function onSubmit(values: ServiceRecordFormData) {
    const timestamp = new Date().toISOString()
    const payload = {
      id: record?.id ?? createId(),
      vehicleId: currentVehicle.id,
      serviceType: values.serviceType.trim(),
      date: values.date,
      mileage: values.mileage,
      cost: values.cost,
      notes: values.notes?.trim() || undefined,
      createdAt: record?.createdAt ?? timestamp,
      updatedAt: timestamp,
    }

    dispatch({
      type: record ? 'service/update' : 'service/add',
      payload,
    })

    navigate(`/vehicles/${currentVehicle.id}/history`)
  }

  function handleDeleteRecord() {
    if (!record) {
      return
    }

    dispatch({ type: 'service/delete', payload: { id: record.id } })
    navigate(`/vehicles/${currentVehicle.id}/history`)
  }

  return (
    <div className={ui.pageNarrow}>
      <section className={`${ui.card} px-5 py-5 sm:px-6 sm:py-6`}>
        <p className={ui.eyebrow}>{mode === 'create' ? 'Add service record' : 'Edit service record'}</p>
        <h1 className={ui.title}>{getVehicleDisplayName(currentVehicle)}</h1>
        <p className={`mt-3 ${ui.muted}`}>Log maintenance entries with mileage, cost, and notes for later analysis.</p>
      </section>

      <SectionCard title="Service details" description="All records save directly into your persistent local app state.">
        <form className="grid gap-4 sm:gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={ui.label}>
              <span className={ui.labelText}>Service type</span>
              <select className={ui.input} {...register('serviceType')}>
                <option value="">Select a service type</option>
                {serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.serviceType ? <small className={ui.error}>{errors.serviceType.message}</small> : null}
            </label>
            <label className={ui.label}>
              <span className={ui.labelText}>Date</span>
              <input className={ui.input} {...register('date')} type="date" />
              {errors.date ? <small className={ui.error}>{errors.date.message}</small> : null}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className={ui.label}>
              <span className={ui.labelText}>Mileage</span>
              <input className={ui.input} {...register('mileage')} type="number" min="0" step="1" />
              {errors.mileage ? <small className={ui.error}>{errors.mileage.message}</small> : null}
            </label>
            <label className={ui.label}>
              <span className={ui.labelText}>Cost</span>
              <input className={ui.input} {...register('cost')} type="number" min="0" step="0.01" placeholder="Optional" />
              {errors.cost ? <small className={ui.error}>{errors.cost.message as string}</small> : null}
            </label>
          </div>

          <label className={ui.label}>
            <span className={ui.labelText}>Notes</span>
            <textarea
              className={`${ui.input} min-h-32 resize-y`}
              {...register('notes')}
              rows={5}
              placeholder="Parts used, torque notes, or anything else worth remembering."
            />
            {errors.notes ? <small className={ui.error}>{errors.notes.message}</small> : null}
          </label>

          <div className="flex flex-wrap gap-3">
            <button className={ui.buttonPrimary} type="submit" disabled={isSubmitting}>
              {mode === 'create' ? 'Save record' : 'Update record'}
            </button>
            <Link className={ui.buttonSecondary} to={`/vehicles/${currentVehicle.id}/history`}>
              Cancel
            </Link>
            {record ? (
              <button className={ui.buttonDanger} type="button" onClick={handleDeleteRecord}>
                Delete record
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
