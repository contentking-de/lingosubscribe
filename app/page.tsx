'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import SubscriptionForm from '@/components/SubscriptionForm'

export default function Home() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showArrow, setShowArrow] = useState(true)

  useEffect(() => {
    const error = searchParams.get('error')
    const successMessage = searchParams.get('message')

    if (error) {
      switch (error) {
        case 'missing_token':
          setMessage({ type: 'error', text: 'Confirmation token is missing.' })
          break
        case 'invalid_token':
          setMessage({ type: 'error', text: 'Invalid or expired confirmation token.' })
          break
        case 'confirmation_failed':
          setMessage({ type: 'error', text: 'Confirmation failed. Please try again.' })
          break
        default:
          setMessage({ type: 'error', text: 'An error occurred.' })
      }
    } else if (successMessage) {
      switch (successMessage) {
        case 'subscription_confirmed':
          setMessage({ type: 'success', text: 'Your subscription has been confirmed! We\'ll notify you when Lingoletics launches.' })
          break
        case 'already_confirmed':
          setMessage({ type: 'success', text: 'Your subscription is already confirmed.' })
          break
      }
    }
  }, [searchParams])

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById('subscription-form')
      if (formElement) {
        const formTop = formElement.getBoundingClientRect().top
        // Hide arrow when form is visible in viewport
        setShowArrow(formTop > window.innerHeight * 0.5)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    const formElement = document.getElementById('subscription-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Header */}
          <div className="mb-12">
            <div className="mb-6 flex justify-center">
              <Image 
                src="/logo.png" 
                alt="Lingoletics Logo" 
                width={400}
                height={200}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-12">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Coming Soon!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                We're building something amazing to help students learn languages in a fun and engaging way.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">📚 Stories</h3>
                  <p className="text-gray-600">Learn through engaging stories</p>
                </div>
                <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🎯 Tests & Quizzes</h3>
                  <p className="text-gray-600">Test your knowledge and progress</p>
                </div>
                <div className="bg-primary-100 p-6 rounded-lg border border-primary-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">📖 Vocabulary Trainer</h3>
                  <p className="text-gray-600">Master new words efficiently</p>
                </div>
                <div className="bg-secondary-100 p-6 rounded-lg border border-secondary-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">🎮 Games</h3>
                  <p className="text-gray-600">Learn while having fun</p>
                </div>
              </div>
            </div>

            <div id="subscription-form">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Subscribe now!</h3>
              <SubscriptionForm />
            </div>
          </div>

          {/* Footer */}
          <div className="text-gray-600">
            <p>Be the first to know when we launch and secure yourself a 20% lifetime coupon!</p>
          </div>
        </div>
      </div>

      {/* Animated Scroll Arrow */}
      {showArrow && (
        <button
          onClick={scrollToForm}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-down hover:scale-110 transition-transform cursor-pointer"
          aria-label="Scroll to subscription form"
        >
          <div className="bg-white rounded-full p-3 shadow-lg">
            <svg
              className="w-6 h-6 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>
      )}
    </main>
  )
}

