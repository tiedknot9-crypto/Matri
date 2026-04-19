import React, { useState } from 'react';
import { Wallet as WalletIcon, Plus, History, Shield, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export const WalletPanel = () => {
  const { currentUser, wallets, transactions, rechargeWallet } = useApp();
  const [amount, setAmount] = useState<string>('500');
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const balance = wallets[currentUser.id] || 0;
  const myTransactions = transactions.filter(t => t.userId === currentUser.id).reverse();

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const txnid = 'TXN' + Date.now();
      
      // Request initiation from our server
      const response = await fetch('/api/payu/payment-initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          productinfo: 'Wallet Recharge',
          firstname: currentUser.name,
          email: currentUser.email || 'user@example.com',
          phone: currentUser.phone || '9999999999',
          // surl and furl are handled by server defaults to ensure POST callbacks work
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate payment');
      }

      const { html } = await response.json();
      
      // The HTML returned by the SDK is a full page with a form that auto-submits.
      // Replacing current document with this HTML is the most reliable way to redirect.
      document.open();
      document.write(html);
      document.close();

    } catch (error: any) {
      console.error('Payment Error:', error);
      alert('Error initiating payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-vermilion to-saffron rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-white/70 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <WalletIcon size={16} /> Current Balance
            </span>
            <div className="text-5xl font-serif font-bold">₹{balance.toLocaleString()}</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex-grow max-w-md">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="text-[10px] font-bold text-white/60 uppercase block mb-1">Add Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white font-bold">₹</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-8 pr-4 text-white font-bold outline-none focus:ring-1 focus:ring-gold"
                    placeholder="500"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddFunds}
                disabled={loading}
                className="bg-gold text-vermilion px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-white active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Plus size={18} /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-[2rem] p-8 border border-gold/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-ivory pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-peacock/5 rounded-full">
              <History size={20} className="text-peacock" />
            </div>
            <h3 className="text-xl font-serif font-bold text-vermilion">Transaction History</h3>
          </div>
          <Shield size={20} className="text-gold opacity-30" />
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {myTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No transactions found. Add funds to get started.</p>
            </div>
          ) : (
            myTransactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-ivory/20 rounded-2xl border border-transparent hover:border-gold/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${t.type === 'Recharge' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {t.type === 'Recharge' ? (
                      <ArrowUpRight size={20} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={20} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{t.description}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {t.timestamp ? format(new Date(t.timestamp), 'dd MMM yyyy, hh:mm a') : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${t.type === 'Recharge' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'Recharge' ? '+' : '-'} ₹{t.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Secure Messaging */}
      <div className="space-y-4">
        <div className="p-4 bg-gold/5 rounded-2xl border border-gold/20 flex items-center gap-4">
          <CreditCard className="text-gold" size={24} />
          <div className="text-xs text-gray-600 font-sans leading-relaxed">
            Your payments are secured by <span className="font-bold text-vermilion">PayU</span> with high-grade encryption. 
            Refunds are subject to our 24-hour verification policy.
          </div>
        </div>

        {/* Test Credentials Helper */}
        <div className="p-6 bg-peacock/5 rounded-2xl border border-peacock/20 space-y-4">
          <h4 className="text-sm font-bold text-peacock flex items-center gap-2 uppercase tracking-widest">
            <Shield size={16} /> Sandbox Test Credentials
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 p-3 rounded-xl border border-peacock/10">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">UPI (VPA)</span>
              <p className="text-xs font-mono font-bold text-peacock">9999999999@payu.in</p>
            </div>
            <div className="bg-white/50 p-3 rounded-xl border border-peacock/10">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Net Banking</span>
              <p className="text-xs font-bold text-peacock">User: payu | Pass: payu | OTP: 123456</p>
            </div>
            <div className="bg-white/50 p-3 rounded-xl border border-peacock/10 md:col-span-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Test Card</span>
              <p className="text-xs font-mono font-bold text-peacock">5123 4567 8901 2346 | CVV: 123 | OTP: 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
