import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'
import Button from '../../components/ui/Button'
import Logomark from '../../components/common/Logomark'

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ fullName, email, password }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Account created — check your email to confirm.')
    navigate('/login')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <Logomark size={32} />
          <span className="font-display font-bold text-lg text-indigo">
            Focus<span className="text-gold">Nexus</span>
          </span>
        </Link>

        <h1 className="font-display text-2xl font-bold text-indigo text-center mb-1.5">
          Create your wallet
        </h1>
        <p className="text-muted text-sm text-center mb-8">
          Takes less than a minute.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Full name
            </label>
            <input
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && (
              <p className="text-rust text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-rust text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
            />
            {errors.password && (
              <p className="text-rust text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              {...register('confirmPassword', {
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-rust text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have a wallet?{' '}
          <Link to="/login" className="text-indigo font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
