import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Wifi, Phone, Zap, Tv, FileCheck, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { getServices, purchaseService, getMyOrders } from '../../services/servicesService'
import { getWallet } from '../../services/walletService'

const CATEGORIES = [
  { key: 'data', label: 'Data', icon: Wifi },
  { key: 'airtime', label: 'Airtime', icon: Phone },
  { key: 'electricity', label: 'Electricity', icon: Zap },
  { key: 'tv', label: 'TV', icon: Tv },
  { key: 'results_checker', label: 'Results Checker', icon: FileCheck },
]

export default function Services() {
  const { user } = useAuth()
  const [category, setCategory] = useState('data')
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [recipient, setRecipient] = useState('')
  const [buying, setBuying] = useState(false)

  const loadServices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getServices(category)
      setServices(data)
    } catch (err) {
      toast.error('Could not load services')
    } finally {
      setLoading(false)
    }
  }, [category])

  const loadWalletAndOrders = useCallback(async () => {
    if (!user?.id) return
    try {
      const [w, o] = await Promise.all([getWallet(user.id), getMyOrders(user.id, 8)])
      setWallet(w)
      setOrders(o)
    } catch (err) {
      console.warn(err.message)
    }
  }, [user?.id])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  useEffect(() => {
    loadWalletAndOrders()
  }, [loadWalletAndOrders])

  const handleBuy = async (e) => {
    e.preventDefault()
    if (!recipient.trim()) {
      toast.error('Enter a recipient number')
      return
    }
    setBuying(true)
    try {
      await purchaseService(selected.id, recipient.trim())
      toast.success(`${selected.name} purchased!`)
      setSelected(null)
      setRecipient('')
      await loadWalletAndOrders()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBuying(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h1 className="font-display text-2xl font-bold text-indigo">Digital Services</h1>
        {wallet && (
          <span className="text-[13.5px] font-medium text-muted">
            Balance:{' '}
            <span className="text-green font-semibold">
              {wallet.currency} {Number(wallet.balance).toFixed(2)}
            </span>
          </span>
        )}
      </div>
      <p className="text-muted text-sm mb-6">
        Data, airtime, electricity, TV and results checker PINs — instant delivery.
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13.5px] font-medium border transition-colors ${
              category === c.key
                ? 'bg-indigo text-white border-indigo'
                : 'border-line text-indigo hover:bg-black/5'
            }`}
          >
            <c.icon size={15} />
            {c.label}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : services.length === 0 ? (
          <p className="text-sm text-muted">No services in this category yet.</p>
        ) : (
          services.map((s) => (
            <div key={s.id} className="bg-white border border-line rounded-brand p-5">
              <p className="text-[12px] font-mono text-muted mb-1">{s.provider}</p>
              <h3 className="font-display text-[15px] font-semibold text-indigo mb-1">
                {s.name}
              </h3>
              <p className="text-[13px] text-muted mb-4">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo">
                  GHS {Number(s.price).toFixed(2)}
                </span>
                <Button variant="gold" onClick={() => setSelected(s)}>
                  Buy
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Buy modal (inline, simple) */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-brand p-6 w-full max-w-sm">
            <h3 className="font-display text-lg font-semibold text-indigo mb-1">
              Buy {selected.name}
            </h3>
            <p className="text-[13.5px] text-muted mb-4">
              GHS {Number(selected.price).toFixed(2)} — {selected.provider}
            </p>
            <form onSubmit={handleBuy}>
              <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
                {selected.category === 'electricity'
                  ? 'Meter number'
                  : selected.category === 'results_checker'
                  ? 'Delivery phone/email'
                  : 'Phone number'}
              </label>
              <input
                autoFocus
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. 0244000000"
                className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setSelected(null)
                    setRecipient('')
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="solid" className="flex-1" disabled={buying}>
                  {buying ? 'Processing…' : 'Confirm purchase'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order history */}
      <h2 className="font-display text-lg font-semibold text-indigo mb-3 flex items-center gap-2">
        <Clock size={18} /> Recent orders
      </h2>
      <div className="bg-white border border-line rounded-brand overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-5 text-sm text-muted">No orders yet — your purchases will show here.</p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-0"
              >
                <div>
                  <p className="text-[14px] font-medium text-indigo">
                    {o.order_items?.[0]?.services?.name || 'Order'}
                  </p>
                  <p className="text-[12px] text-muted">
                    {o.order_items?.[0]?.recipient_number} ·{' '}
                    {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[14px] font-semibold text-indigo">
                    GHS {Number(o.total_amount).toFixed(2)}
                  </p>
                  <span
                    className={`text-[11px] font-semibold uppercase ${
                      o.status === 'completed' ? 'text-green' : 'text-muted'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}
