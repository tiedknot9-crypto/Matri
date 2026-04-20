import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile, AdminSettings, Manager } from '../types';
import { ShieldCheck, Settings, Users, CheckCircle, XCircle, FileText, LayoutDashboard, PlusCircle, Upload, User, GraduationCap, MessageCircle, Heart, UserPlus, Send, LifeBuoy, Wallet, TrendingUp, TrendingDown, Image, Shield, Search, Filter, Eye, Calendar, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { RegistrationForm, Input, Select, DocUpload } from './RegistrationForm';

export const AdminPanel: React.FC = () => {
  const { profiles, settings, connections, messages, tickets, managers, transactions, wallets, updateProfileStatus, updateSettings, respondToTicket, addManager, rechargeWallet, suspendUser } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'approvals' | 'users' | 'settings' | 'registration' | 'crm' | 'tickets' | 'team' | 'finance' | 'policies'>('dashboard');

  const pendingApprovals = profiles.filter(p => p.approvalStatus === 'Pending');
  const approvedProfiles = profiles.filter(p => p.approvalStatus === 'Approved');
  const openTickets = tickets.filter(t => t.status === 'Open');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-vermilion text-white flex flex-col p-6 shadow-xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
          <ShieldCheck className="text-gold" size={32} />
          <div>
            <h2 className="font-serif font-bold text-lg leading-tight">Admin Portal</h2>
            <p className="text-[10px] text-ivory/60 uppercase tracking-widest">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <TabButton active={activeTab === 'registration'} onClick={() => setActiveTab('registration')} icon={<PlusCircle size={18} />} label="Add Profile" />
          <TabButton active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} icon={<FileText size={18} />} label="Pending Approvals" badge={pendingApprovals.length} />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="User Directory" badge={approvedProfiles.length} />
          <TabButton active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} icon={<Heart size={18} />} label="CRM & Chats" />
          <TabButton active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} icon={<LifeBuoy size={18} />} label="Support" badge={openTickets.length} />
          <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={<UserPlus size={18} />} label="Team" />
          <TabButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<Wallet size={18} />} label="Finance" />
          <TabButton active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} icon={<FileText size={18} />} label="Legal Policies" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard profiles={profiles} tickets={tickets} connections={connections} transactions={transactions} />}
        {activeTab === 'registration' && <RegistrationForm settings={settings} />}
        {activeTab === 'approvals' && <ApprovalsView profiles={pendingApprovals} onUpdate={updateProfileStatus} />}
        {activeTab === 'users' && <UsersView profiles={approvedProfiles} onUpdate={updateProfileStatus} onSuspend={suspendUser} />}
        {activeTab === 'crm' && <CRMView profiles={profiles} connections={connections} messages={messages} />}
        {activeTab === 'tickets' && <TicketsView tickets={tickets} profiles={profiles} onRespond={respondToTicket} />}
        {activeTab === 'team' && <TeamView managers={managers} onAdd={addManager} />}
        {activeTab === 'finance' && <FinanceView transactions={transactions} wallets={wallets} profiles={profiles} onRecharge={(uid, amt) => rechargeWallet(uid, amt)} />}
        {activeTab === 'policies' && <PoliciesView settings={settings} onUpdate={updateSettings} />}
        {activeTab === 'settings' && <SettingsView settings={settings} onUpdate={updateSettings} />}
      </main>
    </div>
  );
};

const FinanceView = ({ transactions, wallets, profiles, onRecharge }: { transactions: any[], wallets: Record<string, number>, profiles: UserProfile[], onRecharge: (uid: string, amt: number) => void }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');

  const totalIncome = transactions.filter(t => t.type === 'Recharge').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'Debit').reduce((acc, t) => acc + t.amount, 0));
  const profitLoss = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-vermilion">Financial Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10">
          <TrendingUp className="text-peacock mb-4" size={32} />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total Revenue</p>
          <p className="text-3xl font-bold text-peacock mt-1">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10">
          <TrendingDown className="text-vermilion mb-4" size={32} />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Platform Debits</p>
          <p className="text-3xl font-bold text-vermilion mt-1">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10">
          <div className={`${profitLoss >= 0 ? 'text-peacock' : 'text-vermilion'} mb-4`}>
            {profitLoss >= 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
          </div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Net Profit / Loss</p>
          <p className={`text-3xl font-bold mt-1 ${profitLoss >= 0 ? 'text-peacock' : 'text-vermilion'}`}>
            ₹{profitLoss.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gold/10">
          <h3 className="text-lg font-bold text-vermilion border-b border-ivory pb-4 mb-6">Wallet Recharge</h3>
          <div className="space-y-4">
            <Select 
              label="Select User" 
              options={profiles.map(p => `${p.id} - ${p.name} ${p.surname}`)} 
              onChange={v => setSelectedUser(v.split(' - ')[0])} 
            />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recharge Amount (INR)</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-200 rounded-xl bg-ivory/20 text-sm focus:ring-1 focus:ring-gold outline-none"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500 italic">Current Balance: ₹{(wallets[selectedUser] || 0).toLocaleString()}</p>
            <button 
              onClick={() => {
                if(selectedUser && amount) {
                  onRecharge(selectedUser, Number(amount));
                  setAmount('');
                  alert('Wallet recharged successfully!');
                }
              }}
              className="w-full bg-vermilion text-white py-3 rounded-xl font-bold"
            >
              Confirm Recharge
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gold/10 overflow-hidden">
          <h3 className="text-lg font-bold text-vermilion border-b border-ivory pb-4 mb-6">Recent Transactions</h3>
          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {transactions.slice().reverse().map(t => (
              <div key={t.id} className="text-xs p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-traditional-text">{t.description}</p>
                  <p className="text-gray-500">{new Date(t.timestamp).toLocaleDateString()} • User: {t.userId}</p>
                </div>
                <p className={`font-bold ${t.type === 'Recharge' ? 'text-peacock' : 'text-vermilion'}`}>
                  {t.type === 'Recharge' ? '+' : '-'} ₹{t.amount}
                </p>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-center text-gray-400 py-10">No transactions recorded yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ profiles, tickets, connections, transactions }: { profiles: UserProfile[], tickets: any[], connections: any[], transactions: any[] }) => {
  const totalRevenue = transactions.filter(t => t.type === 'Recharge').reduce((acc, t) => acc + t.amount, 0);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vermilion">Dashboard Overview</h1>
          <p className="text-gray-500">Platform activity and metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-vermilion" size={32} />} label="Total Profiles" value={profiles.length} />
        <StatCard icon={<Heart className="text-gold" size={32} />} label="Connections" value={connections.length} />
        <StatCard icon={<LifeBuoy className="text-peacock" size={32} />} label="Open Tickets" value={tickets.filter(t => t.status === 'Open').length} />
        <StatCard icon={<TrendingUp className="text-vermilion" size={32} />} label="Total Revenue" value={`₹${totalRevenue}`} />
      </div>
    </div>
  );
};

const CRMView = ({ profiles, connections, messages }: { profiles: UserProfile[], connections: any[], messages: any[] }) => {
  const [selectedConn, setSelectedConn] = useState<any>(null);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-vermilion">CRM & Conversation Monitor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-gold/10 p-6 space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Connections</h3>
          {connections.length === 0 ? (
            <p className="text-sm text-gray-400">No connections recorded yet.</p>
          ) : (
            connections.map(conn => {
              const sender = profiles.find(p => p.id === conn.senderId);
              const receiver = profiles.find(p => p.id === conn.receiverId);
              return (
                <button 
                  key={conn.id}
                  onClick={() => setSelectedConn(conn)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selectedConn?.id === conn.id ? 'bg-ivory border-gold shadow-sm' : 'bg-gray-50 border-transparent hover:border-ivory'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(conn.timestamp).toLocaleDateString()}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${conn.status === 'Accepted' ? 'bg-peacock text-white' : 'bg-gold text-vermilion'}`}>
                      {conn.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-vermilion truncate">
                    {sender?.name} ↔ {receiver?.name}
                  </p>
                </button>
              );
            })
          )}
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl border border-gold/10 p-6 flex flex-col min-h-[500px]">
          {selectedConn ? (
            <>
              <div className="border-b border-ivory pb-4 mb-4">
                <h3 className="text-sm font-bold text-vermilion">Conversation Monitor</h3>
                <p className="text-xs text-gray-500">Audit trail for connection ID: {selectedConn.id}</p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-gray-50 rounded-2xl mb-4">
                {messages.filter(m => m.connectionId === selectedConn.id).length === 0 ? (
                  <div className="text-center py-20 text-gray-400 italic text-sm">No messages exchanged yet.</div>
                ) : (
                  messages.filter(m => m.connectionId === selectedConn.id).map(msg => {
                    const sender = profiles.find(p => p.id === msg.senderId);
                    return (
                      <div key={msg.id} className="space-y-1">
                        <p className="text-[10px] font-bold text-gold uppercase">{sender?.name} — {new Date(msg.timestamp).toLocaleTimeString()}</p>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm inline-block">
                          {msg.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageCircle size={48} className="mb-4 opacity-20" />
              <p className="font-serif italic font-medium">Select a connection to view full conversation audit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TicketsView = ({ tickets, profiles, onRespond }: { tickets: any[], profiles: UserProfile[], onRespond: any }) => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [response, setResponse] = useState('');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-vermilion">Support Helpdesk</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-gold/10 p-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Tickets</h3>
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-400">No support tickets found.</p>
          ) : (
            tickets.map(ticket => (
              <button 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicket?.id === ticket.id ? 'bg-ivory border-gold shadow-sm' : 'bg-gray-50 border-transparent hover:border-ivory'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${ticket.status === 'Open' ? 'bg-vermilion text-white' : 'bg-peacock text-white'}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-vermilion">{ticket.subject}</p>
                <p className="text-[10px] text-gray-500 truncate">{ticket.message}</p>
              </button>
            ))
          )}
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl border border-gold/10 p-8">
          {selectedTicket ? (
            <div className="space-y-6">
              <div className="border-b border-ivory pb-6">
                <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Ticket Detail</h4>
                <h2 className="text-xl font-bold text-vermilion">{selectedTicket.subject}</h2>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed bg-ivory/30 p-4 rounded-xl border border-ivory">
                  {selectedTicket.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold">
                  User: {profiles.find(p => p.id === selectedTicket.userId)?.name} | {new Date(selectedTicket.timestamp).toLocaleString()}
                </p>
              </div>

              {selectedTicket.status === 'Open' ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Response</h4>
                  <textarea 
                    className="w-full p-4 bg-ivory/20 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Type your official response..."
                    rows={4}
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                  />
                  <button 
                    onClick={() => {
                      onRespond(selectedTicket.id, response);
                      setSelectedTicket(null);
                      setResponse('');
                    }}
                    className="bg-vermilion text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-vermilion-light"
                  >
                    <Send size={16} /> Mark as Resolved & Send
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-peacock/5 border border-peacock/20 rounded-xl">
                  <h4 className="text-xs font-bold text-peacock uppercase tracking-widest mb-2">Resolution Sent</h4>
                  <p className="text-sm text-gray-700 italic">“{selectedTicket.adminResponse}”</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-32">
              <LifeBuoy size={48} className="mb-4 opacity-20" />
              <p className="font-serif italic font-medium">Select a ticket to act on support request</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamView = ({ managers, onAdd }: { managers: Manager[], onAdd: any }) => {
  const [formData, setFormData] = useState({ name: '', id: '', password: '' });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold text-vermilion">Team Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gold/10 space-y-6">
          <h3 className="text-lg font-bold text-vermilion border-b border-ivory pb-2">Add New Manager</h3>
          <div className="space-y-4">
            <Input label="Manager Name" onChange={v => setFormData({...formData, name: v})} />
            <Input label="Login ID" onChange={v => setFormData({...formData, id: v})} />
            <Input label="Password" type="password" onChange={v => setFormData({...formData, password: v})} />
            <button 
              onClick={() => onAdd({...formData, createdAt: new Date().toISOString()})}
              className="w-full bg-vermilion text-white py-3 rounded-xl font-bold hover:shadow-lg"
            >
              Onboard Manager
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gold/10 space-y-6">
          <h3 className="text-lg font-bold text-vermilion border-b border-ivory pb-2">Active Managers</h3>
          <div className="space-y-4">
            {managers.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No managers assigned yet.</p>
            ) : (
              managers.map(m => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-transparent hover:border-ivory transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-vermilion font-bold">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-vermilion">{m.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">ID: {m.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-peacock/10 text-peacock px-2 py-1 rounded font-bold uppercase tracking-widest">Active</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10">
    <div className="mb-4">{icon}</div>
    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{label}</p>
    <p className="text-3xl font-bold text-vermilion mt-1">{value}</p>
  </div>
);

const ApprovalsView = ({ profiles, onUpdate }: { profiles: UserProfile[], onUpdate: any }) => (
  <div className="space-y-8">
    <div className="border-b border-gold/20 pb-4">
      <h1 className="text-3xl font-serif font-bold text-vermilion">Pending Approvals</h1>
      <p className="text-gray-500">Review documents and verify applicants</p>
    </div>

    {profiles.length === 0 ? (
      <div className="bg-white p-20 rounded-3xl text-center border border-dashed border-gold/30">
        <CheckCircle className="mx-auto text-peacock mb-4" size={48} />
        <p className="text-gray-500 font-serif">All profiles are currently processed.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 flex flex-col md:row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center border border-gold/20">
                <User size={32} className="text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-vermilion">{profile.name} {profile.surname}</h3>
                <p className="text-xs text-gray-500">{profile.religion} • {profile.caste} • {profile.job}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-ivory border border-gold/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1">
                <FileText size={12} /> View Docs
              </button>
              <button 
                onClick={() => onUpdate(profile.id, 'Approved')}
                className="px-4 py-1.5 bg-peacock text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <CheckCircle size={14} /> Approve
              </button>
              <button 
                onClick={() => onUpdate(profile.id, 'Rejected')}
                className="px-4 py-1.5 bg-vermilion text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const UsersView = ({ profiles, onUpdate, onSuspend }: { profiles: UserProfile[], onUpdate: any, onSuspend: any }) => {
  const [filterPlan, setFilterPlan] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<UserProfile | null>(null);

  const filteredProfiles = profiles.filter(p => {
    const matchesPlan = filterPlan === 'All' || p.tier === filterPlan;
    const matchesDate = !filterDate || (p.registeredAt && p.registeredAt.includes(filterDate));
    return matchesPlan && matchesDate;
  });

  return (
    <div className="space-y-8">
      <div className="border-b border-gold/20 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vermilion">User Directory</h1>
          <p className="text-gray-500">Manage credentials, filters and security</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              className="pl-9 pr-4 py-2 bg-white border border-gold/20 rounded-xl text-xs font-bold outline-none"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="All">All Plans</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="date"
              className="pl-9 pr-4 py-2 bg-white border border-gold/20 rounded-xl text-xs font-bold outline-none"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-dashed border-gold/30">
          <Users className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-serif">No users match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProfiles.map(profile => (
            <div key={profile.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${profile.isSuspended ? 'border-red-500 bg-red-50/10' : 'border-gold/10'} flex flex-col gap-6`}>
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gold/20 flex-shrink-0">
                    {profile.photoUrl ? (
                      <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-ivory flex items-center justify-center text-gold">
                        <User size={32} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-vermilion">
                      {profile.name} {profile.surname} 
                      {profile.isSuspended && <span className="ml-2 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded uppercase">Suspended</span>}
                    </h3>
                    <p className="text-xs text-gray-500">{profile.religion} • {profile.caste} • {profile.location}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-peacock bg-peacock/5 px-2 py-0.5 rounded uppercase">Tier: {profile.tier}</span>
                      <span className="text-[10px] font-bold text-gray-400 capitalize">ID: {profile.id}</span>
                      <span className="text-[10px] text-gray-400">Reg: {profile.registeredAt?.split('T')[0] || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedDocs(profile)}
                    className="px-4 py-2 bg-ivory border border-gold/20 rounded-xl text-xs font-bold text-gray-600 hover:bg-gold/10 flex items-center gap-2"
                  >
                    <Image size={14} /> Documents
                  </button>
                  <button 
                    onClick={() => onSuspend(profile.id, 'Administrative Review', !profile.isSuspended)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      profile.isSuspended ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {profile.isSuspended ? 'Lift Suspension' : 'Suspend Account'}
                  </button>
                  <button 
                     onClick={() => onUpdate(profile.id, 'Pending')}
                     className="px-4 py-2 bg-ivory border border-gold/20 rounded-xl text-xs font-bold text-gray-600 hover:bg-gold/10"
                   >
                    Reset Approval
                  </button>
                </div>
              </div>

              {/* Admin Privileged Info */}
              <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Login Email / ID</span>
                  <div className="flex items-center gap-2 text-sm font-mono text-peacock">
                    <Send size={12} /> {profile.email}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Portal Password</span>
                  <div className="flex items-center gap-2 text-sm font-mono text-red-600">
                    <Lock size={12} /> {profile.password || '12345 (Demo)'}
                  </div>
                </div>
                {profile.phone && (
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Contact Number</span>
                    <div className="text-sm font-mono text-gray-700">{profile.phone}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocs && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl relative"
          >
            <button 
              onClick={() => setSelectedDocs(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-ivory rounded-full flex items-center justify-center text-gray-400 hover:text-vermilion"
            >
              <XCircle size={24} />
            </button>
            
            <div className="p-8 border-b border-ivory">
              <h2 className="text-2xl font-serif font-bold text-vermilion">Verification Documents</h2>
              <p className="text-sm text-gray-500">Applicant: {selectedDocs.name} {selectedDocs.surname}</p>
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <DocPreview label="Aadhaar" status={selectedDocs.documents.aadhaar} />
              <DocPreview label="PAN Card" status={selectedDocs.documents.pan} />
              <DocPreview label="Driving License" status={selectedDocs.documents.dl} />
              <DocPreview label="Passport" status={selectedDocs.documents.passport} />
            </div>

            <div className="p-8 bg-ivory/30 flex justify-end gap-4">
               <button onClick={() => setSelectedDocs(null)} className="px-6 py-2 text-gray-500 font-bold uppercase tracking-widest text-xs">Close Gallery</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const DocPreview = ({ label, status }: { label: string, status: string }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <div className="aspect-[3/4] bg-ivory rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center p-4 text-center gap-2 group hover:bg-gold/5 transition-all">
      <FileText size={32} className="text-gold/40 group-hover:text-gold transition-colors" />
      <span className="text-[9px] font-bold text-gray-500 uppercase">{status === 'uploaded' ? 'View Document' : 'Not Provided'}</span>
      <div className="w-full h-1 bg-gold/10 rounded-full overflow-hidden mt-2">
         {status === 'uploaded' && <div className="w-full h-full bg-green-500" />}
      </div>
    </div>
  </div>
);

const PoliciesView = ({ settings, onUpdate }: { settings: AdminSettings, onUpdate: any }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vermilion">Legal Policies</h1>
          <p className="text-gray-500">Update terms, privacy, and refund policies</p>
        </div>
        <button 
          onClick={() => onUpdate(localSettings)}
          className="bg-vermilion text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-vermilion-light transition-all"
        >
          Save Policies
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 space-y-4">
          <h3 className="font-serif font-bold text-vermilion uppercase text-xs tracking-widest">Terms & Conditions</h3>
          <textarea 
            className="w-full p-4 bg-ivory/20 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-gold"
            rows={8}
            value={localSettings.termsAndConditions}
            onChange={e => setLocalSettings({...localSettings, termsAndConditions: e.target.value})}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 space-y-4">
          <h3 className="font-serif font-bold text-vermilion uppercase text-xs tracking-widest">Privacy Policy</h3>
          <textarea 
            className="w-full p-4 bg-ivory/20 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-gold"
            rows={8}
            value={localSettings.privacyPolicy}
            onChange={e => setLocalSettings({...localSettings, privacyPolicy: e.target.value})}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 space-y-4">
          <h3 className="font-serif font-bold text-vermilion uppercase text-xs tracking-widest">Refund Policy</h3>
          <textarea 
            className="w-full p-4 bg-ivory/20 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-gold"
            rows={8}
            value={localSettings.refundPolicy}
            onChange={e => setLocalSettings({...localSettings, refundPolicy: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ settings, onUpdate }: { settings: AdminSettings, onUpdate: any }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const addTag = (key: keyof AdminSettings, value: string) => {
    if (!value) return;
    const currentList = Array.isArray(localSettings[key]) ? (localSettings[key] as string[]) : [];
    setLocalSettings({ ...localSettings, [key]: [...currentList, value] });
  };

  const removeTag = (key: keyof AdminSettings, index: number) => {
    const currentList = Array.isArray(localSettings[key]) ? (localSettings[key] as string[]) : [];
    const newList = currentList.filter((_, i) => i !== index);
    setLocalSettings({ ...localSettings, [key]: newList });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vermilion">System Configuration</h1>
          <p className="text-gray-500">Manage logo and dynamic dropdown options</p>
        </div>
        <button 
          onClick={() => onUpdate(localSettings)}
          className="bg-vermilion text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-vermilion-light transition-all"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingsCard 
          title="Religions" 
          tags={localSettings.religions} 
          onAdd={v => addTag('religions', v)} 
          onRemove={i => removeTag('religions', i)} 
        />
        <SettingsCard 
          title="Castes" 
          tags={localSettings.castes} 
          onAdd={v => addTag('castes', v)} 
          onRemove={i => removeTag('castes', i)} 
        />
        <SettingsCard 
          title="Qualifications" 
          tags={localSettings.qualifications} 
          onAdd={v => addTag('qualifications', v)} 
          onRemove={i => removeTag('qualifications', i)} 
        />
        <SettingsCard 
          title="Graduation Degrees" 
          tags={localSettings.graduations} 
          onAdd={v => addTag('graduations', v)} 
          onRemove={i => removeTag('graduations', i)} 
        />
        <SettingsCard 
          title="Post Graduation" 
          tags={localSettings.postGraduations} 
          onAdd={v => addTag('postGraduations', v)} 
          onRemove={i => removeTag('postGraduations', i)} 
        />
        <SettingsCard 
          title="Diplomas" 
          tags={localSettings.diplomas} 
          onAdd={v => addTag('diplomas', v)} 
          onRemove={i => removeTag('diplomas', i)} 
        />
        <SettingsCard 
          title="Certifications" 
          tags={localSettings.certifications} 
          onAdd={v => addTag('certifications', v)} 
          onRemove={i => removeTag('certifications', i)} 
        />
        <SettingsCard 
          title="Physically Challenged" 
          tags={['None', 'Visually Impaired', 'Hearing Impaired', 'Physically Challenged', 'Other']}
          onAdd={() => {}} 
          onRemove={() => {}} 
        />
        <SettingsCard 
          title="States / Locations" 
          tags={localSettings.states} 
          onAdd={v => addTag('states', v)} 
          onRemove={i => removeTag('states', i)} 
        />
        <SettingsCard 
          title="Hobbies" 
          tags={localSettings.hobbies} 
          onAdd={v => addTag('hobbies', v)} 
          onRemove={i => removeTag('hobbies', i)} 
        />
        <SettingsCard 
          title="Job / Profession" 
          tags={localSettings.jobs} 
          onAdd={v => addTag('jobs', v)} 
          onRemove={i => removeTag('jobs', i)} 
        />
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 space-y-4">
          <h3 className="font-serif font-bold text-vermilion uppercase text-xs tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-gold" /> Branding Logo
          </h3>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 bg-ivory rounded-xl border border-gold/20 p-2 flex items-center justify-center overflow-hidden">
               {localSettings.logoUrl ? (
                 <img src={localSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
               ) : (
                 <Shield size={32} className="text-gold opacity-20" />
               )}
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Logo URL</label>
              <input 
                type="text" 
                value={localSettings.logoUrl}
                onChange={e => setLocalSettings({...localSettings, logoUrl: e.target.value})}
                className="w-full p-2 bg-ivory border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-gold transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsCard = ({ title, tags, onAdd, onRemove }: { title: string, tags: string[], onAdd: (v: string) => void, onRemove: (i: number) => void }) => {
  const [input, setInput] = useState('');
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 space-y-4">
      <h3 className="font-serif font-bold text-vermilion uppercase text-xs tracking-widest">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags && Array.isArray(tags) && tags.map((tag, i) => (
          <span key={i} className="bg-ivory text-vermilion px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 group">
            {tag}
            <button onClick={() => onRemove(i)} className="opacity-0 group-hover:opacity-100 transition-opacity">
              <XCircle size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 bg-ivory border border-gray-200 rounded text-xs outline-none"
          placeholder={`Add ${title}...`}
        />
        <button 
          onClick={() => { onAdd(input); setInput(''); }}
          className="p-2 bg-vermilion text-white rounded hover:bg-vermilion-light transition-all"
        >
          <PlusCircle size={16} />
        </button>
      </div>
    </div>
  );
};

// UI Helpers
const TabButton = ({ active, onClick, icon, label, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white/10 text-gold' : 'hover:bg-white/5 opacity-70 hover:opacity-100'}`}
  >
    <div className="flex items-center gap-3">
      {icon} {label}
    </div>
    {badge > 0 && (
      <span className="w-5 h-5 bg-gold text-vermilion text-[10px] flex items-center justify-center rounded-full border border-vermilion font-bold">
        {badge}
      </span>
    )}
  </button>
);

