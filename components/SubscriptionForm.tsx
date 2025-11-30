'use client'

import { useState } from 'react'
import { z } from 'zod'

const emailSchema = z.string().email('Please enter a valid email address')
const nameSchema = z.string().min(2, 'Name must be at least 2 characters')
const schoolSchema = z.string().min(2, 'School/Organisation must be at least 2 characters')

export default function SubscriptionForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // Validate all fields
      emailSchema.parse(email)
      nameSchema.parse(name)
      schoolSchema.parse(school)

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, school }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Please check your email to confirm your subscription. Click the confirmation link to complete your subscription.')
        setEmail('')
        setName('')
        setSchool('')
        setAgreedToTerms(false)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setStatus('error')
        setMessage(error.errors[0].message)
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="School/Organisation"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 mr-3 h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
            I understand and agree, that my data will be stored for communication purposes only
          </label>
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || !agreedToTerms}
          className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Notify Me When Launch'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

