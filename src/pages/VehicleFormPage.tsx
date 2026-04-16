import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { SectionCard } from '../components/common/SectionCard'
import { useAppState } from '../hooks/useAppState'
import { useVinDecode } from '../hooks/useVinDecode'
import type { VehiclePhoto } from '../types/app'
import { createId } from '../utils/ids'
import { fileListToVehiclePhotos } from '../utils/photo'
import { ui } from '../utils/ui'
import { vehicleFormSchema, type VehicleFormValues } from '../utils/validators'
import { getVehicleById, getVehicleDisplayName } from '../utils/vehicle'

interface VehicleFormPageProps {
  mode: 'create' | 'edit'
}

const emptyValues: VehicleFormValues = {
  vin: '',
  year: '',
  make: '',
  model: '',
  trim: '',
  nickname: '',
  description: '',
}

export function VehicleFormPage({ mode }: VehicleFormPageProps) {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useAppState()
  const vehicle = vehicleId ? getVehicleById(state.vehicles, vehicleId) : undefined
  const [photos, setPhotos] = useState<VehiclePhoto[]>(vehicle?.photos ?? [])
  const [photoError, setPhotoError] = useState<string | null>(null)
  const { error: decodeError, isLoading, runDecode } = useVinDecode()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle
      ? {
          vin: vehicle.vin,
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          trim: vehicle.trim ?? '',
          nickname: vehicle.nickname ?? '',
          description: vehicle.description ?? '',
        }
      : emptyValues,
  })

  useEffect(() => {
    if (vehicle) {
      reset({
        vin: vehicle.vin,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        trim: vehicle.trim ?? '',
        nickname: vehicle.nickname ?? '',
        description: vehicle.description ?? '',
      })
      setPhotos(vehicle.photos)
      return
    }

    reset(emptyValues)
    setPhotos([])
  }, [vehicle, reset])

  if (mode === 'edit' && !vehicle) {
    return (
      <EmptyState
        eyebrow="Edit vehicle"
        title="Vehicle not found"
        description="Choose a valid vehicle before editing its saved profile."
        action={
          <Link className={ui.buttonPrimary} to="/vehicles">
            Back to vehicles
          </Link>
        }
      />
    )
  }

  async function handleDecode() {
    const result = await runDecode(getValues('vin'))

    if (!result) {
      return
    }

    setValue('vin', result.vin, { shouldDirty: true, shouldValidate: true })
    setValue('year', result.year, { shouldDirty: true, shouldValidate: true })
    setValue('make', result.make, { shouldDirty: true, shouldValidate: true })
    setValue('model', result.model, { shouldDirty: true, shouldValidate: true })
    setValue('trim', result.trim ?? '', { shouldDirty: true, shouldValidate: true })
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    try {
      setPhotoError(null)
      const nextPhotos = await fileListToVehiclePhotos(event.target.files)

      if (nextPhotos.length === 0) {
        return
      }

      setPhotos((current) => {
        if (current.some((photo) => photo.isPrimary)) {
          return [...current, ...nextPhotos.map((photo) => ({ ...photo, isPrimary: false }))]
        }

        return [
          ...current,
          ...nextPhotos.map((photo, index) => ({
            ...photo,
            isPrimary: current.length === 0 && index === 0,
          })),
        ]
      })
      event.target.value = ''
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Could not load the selected photo.')
    }
  }

  function handlePrimaryPhoto(photoId: string) {
    setPhotos((current) => current.map((photo) => ({ ...photo, isPrimary: photo.id === photoId })))
  }

  function handleRemovePhoto(photoId: string) {
    setPhotos((current) => {
      const remaining = current.filter((photo) => photo.id !== photoId)

      if (remaining.length > 0 && !remaining.some((photo) => photo.isPrimary)) {
        remaining[0] = { ...remaining[0], isPrimary: true }
      }

      return remaining
    })
  }

  function onSubmit(values: VehicleFormValues) {
    const timestamp = new Date().toISOString()
    const payload = {
      id: vehicle?.id ?? createId(),
      vin: values.vin.trim().toUpperCase(),
      year: values.year.trim(),
      make: values.make.trim(),
      model: values.model.trim(),
      trim: values.trim?.trim() || undefined,
      nickname: values.nickname.trim(),
      description: values.description?.trim() || undefined,
      photos,
      createdAt: vehicle?.createdAt ?? timestamp,
      updatedAt: timestamp,
    }

    dispatch({
      type: vehicle ? 'vehicle/update' : 'vehicle/add',
      payload,
    })

    navigate(`/vehicles/${payload.id}`)
  }

  function handleDeleteVehicle() {
    if (!vehicle) {
      return
    }

    dispatch({ type: 'vehicle/delete', payload: { id: vehicle.id } })
    navigate('/vehicles')
  }

  return (
    <div className={ui.pageNarrow}>
      <section className={`${ui.card} px-5 py-5 sm:px-6 sm:py-6`}>
        <p className={ui.eyebrow}>{mode === 'create' ? 'Add vehicle' : 'Edit vehicle'}</p>
        <h1 className={ui.title}>
          {vehicle ? getVehicleDisplayName(vehicle) : 'Build a garage profile from VIN or manual entry.'}
        </h1>
        <p className={`mt-3 ${ui.muted}`}>
          Save decoded vehicle details, add a nickname, and attach photos for a complete vehicle profile.
        </p>
      </section>

      <SectionCard title="Vehicle details" description="Decode by VIN or enter the values manually.">
        <form className="grid gap-4 sm:gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className={ui.label}>
              <span className={ui.labelText}>VIN</span>
              <input className={ui.input} {...register('vin')} placeholder="Enter 17-character VIN" maxLength={17} />
              {errors.vin ? <small className={ui.error}>{errors.vin.message}</small> : null}
            </label>
            <div className="grid content-start gap-2">
              <span className={ui.labelText}>Decode</span>
              <button className={ui.buttonSecondary} type="button" onClick={handleDecode} disabled={isLoading}>
                {isLoading ? 'Decoding...' : 'Decode VIN'}
              </button>
              {decodeError ? <small className={ui.error}>{decodeError}</small> : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className={ui.label}>
              <span className={ui.labelText}>Year</span>
              <input className={ui.input} {...register('year')} placeholder="2016" />
              {errors.year ? <small className={ui.error}>{errors.year.message}</small> : null}
            </label>
            <label className={ui.label}>
              <span className={ui.labelText}>Make</span>
              <input className={ui.input} {...register('make')} placeholder="Lexus" />
              {errors.make ? <small className={ui.error}>{errors.make.message}</small> : null}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className={ui.label}>
              <span className={ui.labelText}>Model</span>
              <input className={ui.input} {...register('model')} placeholder="ES 350" />
              {errors.model ? <small className={ui.error}>{errors.model.message}</small> : null}
            </label>
            <label className={ui.label}>
              <span className={ui.labelText}>Trim</span>
              <input className={ui.input} {...register('trim')} placeholder="Base" />
            </label>
          </div>

          <label className={ui.label}>
            <span className={ui.labelText}>Nickname</span>
            <input className={ui.input} {...register('nickname')} placeholder="Daily Driver" />
            {errors.nickname ? <small className={ui.error}>{errors.nickname.message}</small> : null}
          </label>

          <label className={ui.label}>
            <span className={ui.labelText}>Description</span>
            <textarea
              className={`${ui.input} min-h-28 resize-y`}
              {...register('description')}
              rows={4}
              placeholder="Notes about how you use this vehicle, upgrades, or maintenance goals."
            />
            {errors.description ? <small className={ui.error}>{errors.description.message}</small> : null}
          </label>

          <div className={ui.label}>
            <span className={ui.labelText}>Vehicle photos</span>
            <input
              className="block w-full text-sm text-stone-700 file:mr-4 file:rounded-full file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:font-semibold file:text-orange-900 hover:file:bg-orange-200"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />
            {photoError ? <small className={ui.error}>{photoError}</small> : null}
            {photos.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {photos.map((photo) => (
                  <article key={photo.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50">
                    <img className="aspect-[4/3] w-full object-cover" src={photo.dataUrl} alt={photo.name} />
                    <div className="grid gap-3 p-4">
                      <p className="font-semibold text-stone-900">{photo.name}</p>
                      <div className="flex flex-wrap gap-2">
                        <button className={ui.buttonGhost} type="button" onClick={() => handlePrimaryPhoto(photo.id)}>
                          {photo.isPrimary ? 'Primary' : 'Set primary'}
                        </button>
                        <button className={ui.buttonDanger} type="button" onClick={() => handleRemovePhoto(photo.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className={ui.muted}>Photos are optional, but they help the garage dashboard feel real.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button className={ui.buttonPrimary} type="submit" disabled={isSubmitting}>
              {mode === 'create' ? 'Save vehicle' : 'Update vehicle'}
            </button>
            <Link className={ui.buttonSecondary} to={vehicle ? `/vehicles/${vehicle.id}` : '/vehicles'}>
              Cancel
            </Link>
            {vehicle ? (
              <button className={ui.buttonDanger} type="button" onClick={handleDeleteVehicle}>
                Delete vehicle
              </button>
            ) : null}
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
