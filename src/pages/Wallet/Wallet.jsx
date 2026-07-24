import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowDownCircle, ArrowUpCircle, RefreshCcw } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import StatCard from '../../components/cards/StatCard'
import { getWallet, getRecentTransactions } from '../../services/walletService'

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

const PRESET_AMOUNTS = [10, 20, 50, 100]

export default function Wallet() {
  const { user, session } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [funding, setFunding] = useState(false)

  const loadWalletData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const w = await getWallet(user.id)
      setWallet(w)
      const tx = await getRecentTransactions(w.id, 10)
      setTransactions(tx)
    } catch (err) {
      toast.error('Could not load wallet data')
      console.warn(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadWalletData()
  }, [loadWalletData])

  const handleFund = () => {
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount < 5) {
      toast.error('Enter at least GHS 5')
      return
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      toast.error("Paystack isn't configured yet — add VITE_PAYSTACK_PUBLIC_KEY to .env")
      return
    }
    if (!window.PaystackPop) {
      toast.error('Payment system still loading — try again in a moment')
      return
    }

    setFunding(true)

    const reference = `fn_${user.id.slice(0, 8)}_${Date.now()}`

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: Math.round(numericAmount * 100), // Paystack expects the lowest currency unit
      currency: 'GHS',
      ref: reference,
      callback: (response) => {
        verifyPayment(response.reference)
      },
      onClose: () => {
        setFunding(false)
      },
    })

    handler.openIframe()
  }

  const verifyPayment = async (reference) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { reference },
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (error || data?.error) {
        toast.error(data?.error || error.message || 'Could not verify payment')
      } else {
        toast.success('Wallet funded successfully!')
        setAmount('')
        await loadWalletData()
      }
    } catch (err) {
      toast.error('Something went wrong verifying your payment')
    } finally {
      setFunding(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold text-indigo mb-1">Wallet</h1>
      <p className="text-muted text-sm mb-7">Fund, track, and manage your balance.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Current balance"
          value={
            loading ? '…' : wallet ? `${wallet.currency} ${Number(wallet.balance).toFixed(2)}` : '—'
          }
          accent="#1E9E6C"
        />
        <div className="bg-white border border-line rounded-brand p-5 flex items-center justify-between">
          <div>
            <p className="text-[13px] text-muted mb-1.5">Need to top up?</p>
            <p className="text-[13.5px] text-indigo font-medium">Fund with Mobile Money or card</p>
          </div>
          <Button variant="gold" onClick={() => document.getElementById('fund-amount')?.focus()}>
            Fund wallet
          </Button>
        </div>
      </div>

      {/* Fund form */}
      <div className="bg-white border border-line rounded-brand p-6 mb-8 max-w-md">
        <h2 className="font-display text-base font-semibold text-indigo mb-4">Fund wallet</h2>

        <div className="flex gap-2 mb-4 flex-wrap">
          {PRESET_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(String(a))}
              className={`px-3.5 py-2 rounded-xl text-[13.5px] font-medium border transition-colors ${
                amount === String(a)
                  ? 'bg-indigo text-white border-indigo'
                  : 'border-line text-indigo hover:bg-black/5'
              }`}
            >
              GHS {a}
            </button>
          ))}
        </div>

        <label className="block text-[13.5px] font-medium text-indigo mb-1.5">
          Amount (GHS)
        </label>
        <input
          id="fund-amount"
          type="number"
          min="5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 25"
          className="w-full border border-line rounded-xl px-3.5 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <Button variant="solid" className="w-full" onClick={handleFund} disabled={funding}>
          {funding ? 'Processing…' : 'Continue to payment'}
        </Button>
        <p className="text-[12px] text-muted mt-3">
          Opens Paystack's secure checkout — card or Mobile Money.
        </p>
      </div>

      {/* Transaction history */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-indigo">Recent activity</h2>
        <button
          onClick={loadWalletData}
          className="flex items-center gap-1.5 text-[13px] text-muted hover:text-indigo"
        >
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-white border border-line rounded-brand overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-muted">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="p-5 text-sm text-muted">
            No transactions yet — fund your wallet to get started.
          </p>
        ) : (
          <ul>
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-0"
              >
                <div className="flex items-center gap-3">
                  {tx.amount > 0 ? (
                    <ArrowDownCircle size={18} className="text-green" />
                  ) : (
                    <ArrowUpCircle size={18} className="text-rust" />
                  )}
                  <div>
                    <p className="text-[14px] font-medium text-indigo capitalize">
                      {tx.type.replace('_', ' ')}
                    </p>
                    <p className="text-[12px] text-muted">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-mono text-[14px] font-semibold ${
                    tx.amount > 0 ? 'text-green' : 'text-rust'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}
                  {wallet?.currency} {Number(tx.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}
