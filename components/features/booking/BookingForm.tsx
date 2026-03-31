'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/components/features/theme/ThemeProvider'
import { BookingSchema, type BookingInput } from '@/lib/validations'
import { toast } from 'sonner'
import { CheckCircle, Loader2 } from 'lucide-react'

interface BookingFormProps {
  activities: { id: string; name: string }[]
}

function ErrorMsg({ msg }: { msg: string | undefined }) {
  if (!msg) return null
  return <p className="text-red-500 text-xs mt-1">{msg}</p>
}

export default function BookingForm({ activities }: BookingFormProps) {
  const t = useTranslations('booking')
  const theme = useTheme()
  const isWinter = theme === 'WINTER'
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(BookingSchema) as any,
  })

  const onSubmit = async (data: BookingInput) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      toast.error(t('error_message'))
    }
  }

  const primaryColor = isWinter ? '#1a5276' : '#1a4731'
  const accentColor = isWinter ? '#2e86c1' : '#f0a500'

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: isWinter ? '#2e86c1' : '#2e7d5a' }} />
        <h2 className="text-2xl font-bold mb-3" style={{ color: primaryColor, fontFamily: 'var(--font-nunito)' }}>
          {t('success_title')}
        </h2>
        <p style={{ color: 'var(--theme-text-muted)' }}>{t('success_message')}</p>
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2'

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-5">
      {/* Parent name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
            {t('form_parent_name')} *
          </label>
          <input
            {...register('parentName')}
            className={inputClass}
            style={{ borderColor: errors.parentName ? '#ef4444' : 'var(--theme-card-border)' }}
            placeholder="Ion Popescu"
          />
          <ErrorMsg msg={errors.parentName?.message as string} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
            {t('form_email')} *
          </label>
          <input
            {...register('email')}
            type="email"
            className={inputClass}
            style={{ borderColor: errors.email ? '#ef4444' : 'var(--theme-card-border)' }}
            placeholder="ion@example.com"
          />
          <ErrorMsg msg={errors.email?.message as string} />
        </div>
      </div>

      {/* Phone + Nr. children */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
            {t('form_phone')} *
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={inputClass}
            style={{ borderColor: errors.phone ? '#ef4444' : 'var(--theme-card-border)' }}
            placeholder="07xx xxx xxx"
          />
          <ErrorMsg msg={errors.phone?.message as string} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
            {t('form_children_count')} *
          </label>
          <input
            {...register('numberOfChildren')}
            type="number"
            min={1}
            max={10}
            className={inputClass}
            style={{ borderColor: errors.numberOfChildren ? '#ef4444' : 'var(--theme-card-border)' }}
            placeholder="1"
          />
          <ErrorMsg msg={errors.numberOfChildren?.message as string} />
        </div>
      </div>

      {/* Children ages */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
          {t('form_children_ages')} *
        </label>
        <input
          {...register('childrenAges')}
          className={inputClass}
          style={{ borderColor: errors.childrenAges ? '#ef4444' : 'var(--theme-card-border)' }}
          placeholder={t('form_children_ages_placeholder')}
        />
        <ErrorMsg msg={errors.childrenAges?.message as string} />
      </div>

      {/* Activity */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
          {t('form_activity')}
        </label>
        <select
          {...register('activityId')}
          className={inputClass}
          style={{ borderColor: 'var(--theme-card-border)' }}
        >
          <option value="">{t('form_activity_placeholder')}</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Preferred dates */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
          {t('form_dates')} *
        </label>
        <input
          {...register('preferredDates')}
          className={inputClass}
          style={{ borderColor: errors.preferredDates ? '#ef4444' : 'var(--theme-card-border)' }}
          placeholder={t('form_dates_placeholder')}
        />
        <ErrorMsg msg={errors.preferredDates?.message as string} />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
          {t('form_notes')}
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className={inputClass}
          style={{ borderColor: 'var(--theme-card-border)', resize: 'vertical' }}
          placeholder={t('form_notes_placeholder')}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ backgroundColor: accentColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('form_submitting')}
          </>
        ) : (
          t('form_submit')
        )}
      </button>
    </form>
  )
}
