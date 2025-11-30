'use client'

import { useState, useEffect } from 'react'

interface Subscription {
  id: string
  email: string
  name: string | null
  school: string | null
  createdAt: string
  confirmed: boolean
  confirmedAt: string | null
  notified: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function SubscriberList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all')
  const [loading, setLoading] = useState(true)
  const [notifyLoading, setNotifyLoading] = useState(false)
  const [showNotifyForm, setShowNotifyForm] = useState(false)
  const [notifySubject, setNotifySubject] = useState('')
  const [notifyMessage, setNotifyMessage] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [page, filter])

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const confirmedParam = filter === 'all' ? '' : filter === 'confirmed' ? 'true' : 'false'
      const url = `/api/admin/subscriptions?page=${page}&limit=50${confirmedParam ? `&confirmed=${confirmedParam}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok) {
        setSubscriptions(data.subscriptions)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotifyLoading(true)

    try {
      const response = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: notifySubject,
          message: notifyMessage,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`Successfully sent ${data.sent} notifications!`)
        setShowNotifyForm(false)
        setNotifySubject('')
        setNotifyMessage('')
        fetchSubscriptions()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert('Failed to send notifications')
    } finally {
      setNotifyLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading subscribers...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Subscribers</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'confirmed' | 'unconfirmed')
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed Only</option>
            <option value="unconfirmed">Unconfirmed Only</option>
          </select>
          <button
            onClick={() => setShowNotifyForm(!showNotifyForm)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            {showNotifyForm ? 'Cancel' : 'Notify All Subscribers'}
          </button>
        </div>
      </div>

      {showNotifyForm && (
        <form onSubmit={handleNotify} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={notifySubject}
                onChange={(e) => setNotifySubject(e.target.value)}
                required
                placeholder="Lingoletics is now live!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                required
                rows={6}
                placeholder="We're excited to announce that Lingoletics is now live!..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={notifyLoading}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50"
            >
              {notifyLoading ? 'Sending...' : 'Send Notifications'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                School/Organisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confirmed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sub.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sub.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sub.school || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sub.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sub.confirmed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {sub.confirmed ? 'Confirmed' : 'Unconfirmed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sub.confirmed ? (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        sub.notified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sub.notified ? 'Notified' : 'Pending'}
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-500">
                      N/A
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

