import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AdminSettings, DEFAULT_SETTINGS, Connection, Message, SupportTicket, Manager, Transaction, Wallet, MatchingPreferences, DEFAULT_PREFERENCES } from '../types';

interface AppContextType {
  profiles: UserProfile[];
  settings: AdminSettings;
  connections: Connection[];
  messages: Message[];
  tickets: SupportTicket[];
  managers: Manager[];
  transactions: Transaction[];
  wallets: Record<string, number>;
  currentUser: UserProfile | null;
  login: (id: string, password?: string) => 'admin' | 'user' | boolean;
  logout: () => void;
  addProfile: (profile: UserProfile) => void;
  updateProfileStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  updateSettings: (settings: AdminSettings) => void;
  updatePreferences: (userId: string, preferences: MatchingPreferences) => void;
  addConnection: (senderId: string, receiverId: string) => void;
  addMessage: (connectionId: string, senderId: string, text: string) => void;
  addTicket: (userId: string, subject: string, message: string) => void;
  respondToTicket: (id: string, response: string) => void;
  addManager: (manager: Manager) => void;
  rechargeWallet: (userId: string, amount: number) => void;
  debitWallet: (userId: string, amount: number, description: string) => void;
  acceptConnection: (connectionId: string) => void;
  reportProfile: (userId: string, reason: string) => void;
  suspendUser: (userId: string, reason: string, status: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('mp_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('mp_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('mp_connections');
    if (saved) return JSON.parse(saved);
    // Sample data for demo
    return [
      { id: 'conn1', senderId: '1', receiverId: '2', status: 'Accepted', timestamp: new Date().toISOString() }
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('mp_messages');
    if (saved) return JSON.parse(saved);
    // Sample messages for demo
    return [
      { id: 'm1', connectionId: 'conn1', senderId: '1', text: 'Namaste, I really liked your profile!', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'm2', connectionId: 'conn1', senderId: '2', text: 'Thank you! I liked yours too. Can we talk?', timestamp: new Date(Date.now() - 1800000).toISOString() }
    ];
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('mp_tickets');
    if (saved) return JSON.parse(saved);
    // Sample tickets for demo
    return [
      { id: 't1', userId: '1', subject: 'Profile Update', message: 'I want to change my photo but it is stuck.', status: 'Open', timestamp: new Date().toISOString() }
    ];
  });

  const [managers, setManagers] = useState<Manager[]>(() => {
    const saved = localStorage.getItem('mp_managers');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('mp_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [wallets, setWallets] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('mp_wallets');
    return saved ? JSON.parse(saved) : { '1': 500, '2': 1000 };
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mp_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('mp_profiles', JSON.stringify(profiles));
    localStorage.setItem('mp_connections', JSON.stringify(connections));
    localStorage.setItem('mp_messages', JSON.stringify(messages));
    localStorage.setItem('mp_tickets', JSON.stringify(tickets));
    localStorage.setItem('mp_managers', JSON.stringify(managers));
    localStorage.setItem('mp_transactions', JSON.stringify(transactions));
    localStorage.setItem('mp_wallets', JSON.stringify(wallets));
    localStorage.setItem('mp_currentUser', JSON.stringify(currentUser));
  }, [profiles, connections, messages, tickets, managers, transactions, wallets, currentUser]);

  useEffect(() => {
    localStorage.setItem('mp_settings', JSON.stringify(settings));
  }, [settings]);

  const addProfile = useCallback((profile: UserProfile) => {
    setProfiles(prev => [...prev, profile]);
  }, []);

  const updateProfileStatus = useCallback((id: string, status: 'Approved' | 'Rejected') => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, approvalStatus: status, loginReady: status === 'Approved' } : p
    ));
  }, []);

  const updateSettings = useCallback((newSettings: AdminSettings) => {
    setSettings(newSettings);
  }, []);

  const updatePreferences = useCallback((userId: string, preferences: MatchingPreferences) => {
    setProfiles(prev => prev.map(p => 
      p.id === userId ? { ...p, preferences } : p
    ));
    setCurrentUser(prev => {
      if (prev?.id === userId) {
        return { ...prev, preferences };
      }
      return prev;
    });
  }, []);

  const addConnection = useCallback((senderId: string, receiverId: string) => {
    const newConn: Connection = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setConnections(prev => [...prev, newConn]);
  }, []);

  const addMessage = useCallback((connectionId: string, senderId: string, text: string) => {
    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      connectionId,
      senderId,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  }, []);

  const addTicket = useCallback((userId: string, subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      subject,
      message,
      status: 'Open',
      timestamp: new Date().toISOString()
    };
    setTickets(prev => [...prev, newTicket]);
  }, []);

  const respondToTicket = useCallback((id: string, response: string) => {
    setTickets(prev => prev.map(t => 
      t.id === id ? { ...t, adminResponse: response, status: 'Resolved' } : t
    ));
  }, []);

  const addManager = useCallback((manager: Manager) => {
    setManagers(prev => [...prev, manager]);
    const managerProfile: UserProfile = {
      id: manager.id,
      name: manager.name,
      surname: '(Manager)',
      isManager: true,
      age: 30,
      gender: 'Other',
      tier: 'Elite',
      photoUrl: 'https://picsum.photos/seed/manager/400/500',
      education: ['System Administration'],
      job: 'Matrimonial Manager',
      location: 'HQ',
      religion: 'Global',
      caste: 'Managed',
      gotra: 'Matri',
      height: '5\'10"',
      income: 'Salary',
      netWorth: 'N/A',
      dob: '1990-01-01',
      birthTime: '00:00',
      birthPlace: 'System',
      familyBackground: 'Official Staff',
      fatherJob: 'N/A',
      motherJob: 'N/A',
      siblings: 'N/A',
      familyDetails: 'Support Team',
      hasDisability: 'None',
      createdBy: 'Admin',
      phone: 'N/A',
      email: 'manager@matrimonialplus.com',
      documents: { photo: '', aadhaar: '', pan: '', dl: '', passport: '' },
      approvalStatus: 'Approved',
      loginReady: true,
      registeredAt: new Date().toISOString(),
    };
    setProfiles(prev => [...prev, managerProfile]);
  }, []);

  const rechargeWallet = useCallback((userId: string, amount: number) => {
    setWallets(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + amount
    }));
    setTransactions(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type: 'Recharge',
      amount,
      description: 'Wallet Recharge',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const debitWallet = useCallback((userId: string, amount: number, description: string) => {
    setWallets(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) - amount
    }));
    setTransactions(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type: 'Debit',
      amount,
      description,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const acceptConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.map(c => 
      c.id === connectionId ? { ...c, status: 'Accepted' } : c
    ));
  }, []);

  const reportProfile = useCallback((userId: string, reason: string) => {
    setProfiles(prev => prev.map(p => 
      p.id === userId ? { ...p, isSuspended: true, suspensionReason: reason } : p
    ));
    alert(`Account reported for ${reason}. It has been suspended immediately for review by Digital Communique Private limited.`);
  }, []);

  const suspendUser = useCallback((userId: string, reason: string, status: boolean) => {
    setProfiles(prev => prev.map(p => 
      p.id === userId ? { ...p, isSuspended: status, suspensionReason: reason } : p
    ));
  }, []);

  const login = (id: string, password?: string) => {
    // 1. Check for Admin hardcoded credentials
    if (id === 'admin' && password === '12345') {
      return 'admin';
    }

    // 2. Check for User hardcoded credentials
    if (id === 'user' && password === '12345') {
      // Find or create 'user' profile if it doesn't exist for demo
      let userProfile = profiles.find(p => p.id === 'user_profile_id');
      if (!userProfile) {
        userProfile = {
          id: 'user_profile_id',
          name: 'Demo',
          surname: 'User',
          age: 28,
          gender: 'Male',
          tier: 'Normal',
          photoUrl: 'https://picsum.photos/seed/user123/400/500',
          education: ['Bachelor of Technology'],
          educationDetails: [{ degree: 'B.Tech', institution: 'IIT Delhi', year: '2018' }],
          job: 'Software Engineer',
          jobDetails: [{ title: 'Software Engineer', company: 'Google', duration: '3 years' }],
          location: 'Bangalore',
          religion: 'Hindu',
          caste: 'Brahmin',
          gotra: 'Kashyap',
          height: '5\'11"',
          income: '25 - 50 LPA',
          netWorth: '1 - 5 Cr',
          dob: '1996-05-15',
          birthTime: '10:30',
          birthPlace: 'Delhi',
          familyBackground: 'Middle Class',
          fatherJob: 'Government Employee',
          motherJob: 'Homemaker',
          siblings: '1 Sister',
          familyDetails: 'Educated and progressive family.',
          hasDisability: 'None',
          createdBy: 'Self',
          phone: '9876543210',
          email: 'user@example.com',
          documents: { photo: '', aadhaar: '', pan: '', dl: '', passport: '' },
          approvalStatus: 'Approved',
          loginReady: true,
          registeredAt: new Date().toISOString(),
          preferences: DEFAULT_PREFERENCES
        };
        setProfiles(prev => [...prev, userProfile as UserProfile]);
      }
      setCurrentUser(userProfile as UserProfile);
      return 'user';
    }

    // 3. Normal login by email
    const user = profiles.find(p => (p.email === id || p.id === id) && p.loginReady);
    if (user) {
      setCurrentUser(user);
      return 'user';
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{ 
      profiles, settings, connections, messages, tickets, managers, transactions, wallets,
      currentUser, login, logout,
      addProfile, updateProfileStatus, updateSettings, updatePreferences, addConnection, 
      addMessage, addTicket, respondToTicket, addManager, rechargeWallet, debitWallet, acceptConnection,
      reportProfile, suspendUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
