import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import RoleBadge from '../../components/ui/RoleBadge'
import { updateProfile } from '../../services/profileService'

export default function Profile() {
  const { user, profile, role, refreshProfile } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (profile) {
      reset({ full_name: profile.full_name, phone: profile.phone || '' })
    }
  }, [profile, reset])

  const onSubmit = async (values) => {
    try {
      await updateProfile(user.id, {
        full_name: values.full_name,
        phone: values.phone || null,
      })
      await refreshProfile()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-indigo mb-1">Profile</h1>
      <p className="text-muted text-sm mb-7">Manage your account details.</p>

      <div className="max-w-md bg-white border border-line rounded-brand p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[13.5px] text-muted">Current role</span>
          {role && <RoleBadge role={role} />}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Full name
            </label>
            <input
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              {...register('full_name', { required: 'Full name is required' })}
            />
            {errors.full_name && (
              <p className="text-rust text-xs mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Phone number
            </label>
            <input
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              placeholder="0244000000"
              {...register('phone')}
            />
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Email
            </label>
            <input
              disabled
              value={user?.email || ''}
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm bg-black/5 text-muted"
            />
            <p className="text-[12px] text-muted mt-1">
              Email changes aren't supported yet — contact support if you need this updated.
            </p>
          </div>

          <Button type="submit" variant="solid" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>

      <p className="text-[13px] text-muted mt-4 max-w-md">
        Roles (Agent, Vendor, Business, Staff) are assigned by an administrator, not
        self-service — reach out if you believe yours should change.
      </p>
    </DashboardLayout>
  )
}
