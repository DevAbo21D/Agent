
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search, History, Shield, Trash2, Camera, User, Clipboard, Check,
  ImageIcon, AlertTriangle, FileWarning, Star, Ban, Clock,
  Loader2, Info, ExternalLink, Download, Fingerprint, Activity,
  FileText, Pin, PinOff, ListFilter, Network, Upload, Tag, Save, X, Eye, ArrowRight,
  AlertCircle, ShieldAlert, Send, Gavel, Users, Volume2, VolumeX,
  FileArchive, Box, Database, Monitor, MessageSquare, Sparkles,
  UserCheck, ShieldCheck, Bug, Flag, Share2, Calendar, HardDrive,
  LogOut, ShieldQuestion, Zap, Terminal, Globe, Lock, Cpu, Radar, SearchCode,
  FileSignature, UserPlus, UserMinus, Copy, CheckCircle, FileBox, Briefcase, UserCog,
  Gamepad2, ThumbsUp, ThumbsDown, UserCircle, Play, Server, Radio, ChevronDown, ChevronUp, MoreHorizontal,
  RefreshCw, Link, BookOpen, UserX, Coins, TrendingUp, CreditCard, ShoppingBag, Key, Bell, Diamond, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { PdfService } from './services/pdfService';
import {
  InputType, ApiResponse, SearchHistoryItem, RobloxPlayerData, RobloxGroupFullData, RobloxGameData, RobloxLivePlayerData,
  AuditLogEntry, CyberReport, ReportType, SeverityLevel, ReportStatus, ReconToolId, ManagedAccount, ManagedAccountStatus,
  // New Recon Types
  RobloxVerificationData, RobloxAssetData, RobloxPermissionData, RobloxNotificationData, GroupRole
} from './types';
import { getRobloxPlayerData, getRobloxGroupData, getRobloxGameData, getRobloxLivePlayer, fetchReconData, createRobloxAccount, fetchGroupRoleMembers, getDeepIntelData, getRecentBadges, getUserCreatedAssets, traceConnection, getBatchPresence, getBatchSurveillanceData, findTargetInGame } from './services/robloxService';
import { analyzeRobloxImage, askAiAssistant, generateSimplifiedReport } from './services/geminiService';
import { dbService } from './services/dbService';
import { LoginScreen } from './components/auth/LoginScreen';
import { Header } from './components/layout/Header';
// Lazy Load Components
const ReconSidebar = React.lazy(() => import('./components/layout/ReconSidebar').then(module => ({ default: module.ReconSidebar })));
const AnalystDashboard = React.lazy(() => import('./components/dashboard/AnalystDashboard').then(module => ({ default: module.AnalystDashboard })));
const ResultsView = React.lazy(() => import('./components/dashboard/ResultsView').then(module => ({ default: module.ResultsView })));
const BatchResultsView = React.lazy(() => import('./components/dashboard/BatchResultsView').then(module => ({ default: module.BatchResultsView })));
const AssetScanner = React.lazy(() => import('./components/dashboard/AssetScanner').then(module => ({ default: module.AssetScanner })));
const ManualExportModal = React.lazy(() => import('./components/modals/ManualExportModal').then(module => ({ default: module.ManualExportModal })));
const AccountManagerModal = React.lazy(() => import('./components/modals/AccountManagerModal').then(module => ({ default: module.AccountManagerModal })));
const SocialGraph = React.lazy(() => import('./components/dashboard/SocialGraph').then(module => ({ default: module.SocialGraph })));
import { VerdictGauge } from './components/dashboard/VerdictGauge';
import { DeepIntelView } from './components/dashboard/DeepIntelView';
import { formatText } from './utils/textUtils';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useRobloxSearch } from './hooks/useRobloxSearch';
import { useSurveillance } from './hooks/useSurveillance';
import { useSearchHistory } from './hooks/useSearchHistory';

const SFX = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  scan: 'https://assets.mixkit.co/active_storage/sfx/2544/2544-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2541/2541-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2542/2542-preview.mp3',
  login: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  export: 'https://assets.mixkit.co/active_storage/sfx/2144/2144-preview.mp3',
};









// ... (existing constants)

// ... (existing constants)
import { WelcomeScreen } from './components/layout/WelcomeScreen';
import { AiChatWidget } from './components/dashboard/AiChatWidget';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  console.log("App Rendering...");

  // --- Hooks ---
  const {
    history, addToHistory, togglePin: togglePinHistory, deleteItem: deleteHistoryItem, clearHistory
  } = useSearchHistory();

  const {
    loading, loadingStep, result, setResult, groupResult, gameResult, livePlayerResult,
    errorMessage: searchError, setErrorMessage: setHookError, batchResults, viewingRole, setViewingRole,
    roleMembers, roleMembersLoading, fullUserSearch, handleGroupSearch: doGroupSearch,
    handleGameSearch: doGameSearch, batchSearch, fetchRoleMembers, resetState, LOADING_STEPS
  } = useRobloxSearch((type) => playSfx(type));

  const {
    watchlist, surveillanceLogs, addToWatchlist, removeFromWatchlist, clearWatchlist, setSurveillanceLogs
  } = useSurveillance([], true, (type) => playSfx(type));

  useEffect(() => {
    if (searchError) setErrorMessage(searchError);
  }, [searchError]);

  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [isGuestAiMode, setIsGuestAiMode] = useState(false); // NEW: Guest AI Mode
  console.log("showWelcomeScreen state:", showWelcomeScreen);
  // ... (rest of state)

  // ... (inside component)


  const [searchMode, setSearchMode] = useState<'single' | 'batch'>('single');

  const [showManualExportModal, setShowManualExportModal] = useState(false);
  // ... (existing state)

  const [inputType, setInputType] = useState<InputType>('username');
  const [inputValue, setInputValue] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);


  // Friends Modal States
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showFootprintModal, setShowFootprintModal] = useState(false);
  const [showSnifferModal, setShowSnifferModal] = useState(false);
  const [footprintLoading, setFootprintLoading] = useState(false);
  const [snifferLoading, setSnifferLoading] = useState(false);
  const [footprintData, setFootprintData] = useState<any[]>([]);
  const [sniffedAssets, setSniffedAssets] = useState<any[]>([]);
  const [sniffType, setSniffType] = useState<'Decal' | 'Audio' | 'Model'>('Decal');
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [friendSort, setFriendSort] = useState<'online' | 'az' | 'za'>('online');
  const [showRiskOnly, setShowRiskOnly] = useState(false);
  const [friendsViewMode, setFriendsViewMode] = useState<'list' | 'graph'>('list');
  const [knownSubjectIds, setKnownSubjectIds] = useState<Set<number>>(new Set());
  const [showKnownOnly, setShowKnownOnly] = useState(false);

  const [showSurveillance, setShowSurveillance] = useState(true); // Min/Max Toggle
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);

  // Connection Tracer States
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [traceTargetId, setTraceTargetId] = useState('');
  const [traceResult, setTraceResult] = useState<any>(null);
  const [traceLoading, setTraceLoading] = useState(false);

  // Info Dossier Modal States
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTab, setInfoTab] = useState<'details' | 'groups'>('details');

  // Groups Modal State (User List Feature)
  const [showGroupsModal, setShowGroupsModal] = useState(false);

  // Group Detail Modal (New Feature for Specific Group Search)
  const [showGroupDetailModal, setShowGroupDetailModal] = useState(false);


  // Ghost Hunter State
  const [showGhostHunter, setShowGhostHunter] = useState(false);
  const [ghostTarget, setGhostTarget] = useState<any>(null); // { placeId, headshot, username }
  const [ghostStatus, setGhostStatus] = useState({ scanned: 0, total: 0, status: 'idle' as 'idle' | 'scanning' | 'found' | 'failed', jobId: '' });


  // Reports
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    type: 'Suspicious Activity' as ReportType,
    severity: 'Medium' as SeverityLevel,
    summary: '',
    reporterAlias: 'Anonymous',
    evidence: [] as any[]
  });
  const [targetReports, setTargetReports] = useState<CyberReport[]>([]);

  // Analyst Dashboard
  const [showAnalystDashboard, setShowAnalystDashboard] = useState(false);
  const [allReports, setAllReports] = useState<CyberReport[]>([]);
  const [deletedReports, setDeletedReports] = useState<CyberReport[]>([]); // NEW: Recycle Bin
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');

  // Account Manager System (New Feature)
  const [showAccountManager, setShowAccountManager] = useState(false);
  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>([]);
  const [accountManagerView, setAccountManagerView] = useState<'list' | 'form'>('list');

  // Deep Intel (New Feature)
  const [deepIntelData, setDeepIntelData] = useState<any>(null);
  const [loadingDeepIntel, setLoadingDeepIntel] = useState(false);
  const [showDeepIntel, setShowDeepIntel] = useState(false);
  const [accountForm, setAccountForm] = useState<Partial<ManagedAccount>>({
    status: 'Active',
    tags: [],
    linkedReportIds: [],
    notes: ''
  });
  const [tagInput, setTagInput] = useState('');

  // AI & Extras
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [simpleReport, setSimpleReport] = useState<string | null>(null);
  const [isGeneratingSimple, setIsGeneratingSimple] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear Data Modal State
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // AI Image Analysis Loading State
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);


  // Recon Vault (Sidebar)
  const [showReconSidebar, setShowReconSidebar] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<ReconToolId | null>(null);
  const [reconInputs, setReconInputs] = useState<Record<ReconToolId, string>>({
    old_usernames: '', deleted_assets: '', favorites_count: '', private_places: '',
    hidden_roles: '', delisted_games: '', unlisted_versions: '', product_revenue: '',
    ghost_players: '', hidden_languages: '', account_forge: '', group_treasury: '',
    verification_check: '', assets_serial: '', place_permissions: '', unread_notifications: ''
  });
  const [reconResults, setReconResults] = useState<Record<ReconToolId, { loading: boolean; data: any; error: string | null }>>({
    old_usernames: { loading: false, data: null, error: null },
    deleted_assets: { loading: false, data: null, error: null },
    favorites_count: { loading: false, data: null, error: null },
    private_places: { loading: false, data: null, error: null },
    hidden_roles: { loading: false, data: null, error: null },
    delisted_games: { loading: false, data: null, error: null },
    unlisted_versions: { loading: false, data: null, error: null },
    product_revenue: { loading: false, data: null, error: null },
    ghost_players: { loading: false, data: null, error: null },
    hidden_languages: { loading: false, data: null, error: null },
    account_forge: { loading: false, data: null, error: null },
    group_treasury: { loading: false, data: null, error: null },
    verification_check: { loading: false, data: null, error: null },
    assets_serial: { loading: false, data: null, error: null },
    place_permissions: { loading: false, data: null, error: null },
    unread_notifications: { loading: false, data: null, error: null }
  });

  // Account Forge State
  const [forgeForm, setForgeForm] = useState({
    username: '',
    password: '',
    birthday: '',
    gender: '2' // 2 Male, 3 Female
  });
  const [createdAccount, setCreatedAccount] = useState<{ userId: number, username: string } | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const playSfx = useCallback((type: keyof typeof SFX) => {
    if (!soundEnabled) return;
    const audio = new Audio(SFX[type]);
    audio.volume = 0.3;
    audio.play().catch(() => { });
  }, [soundEnabled]);





  const handleSystemExit = () => {
    console.log("System Exit Requested");
    window.close();
  };

  const handleWelcomeStart = () => {
    console.log("Welcome Start Requested -> Setting showWelcomeScreen to false");
    setShowWelcomeScreen(false);
  };

  const handleAiRedirect = () => {
    console.log("AI Redirect Requested -> Guest Mode Enabled");
    setIsGuestAiMode(true);
    setShowWelcomeScreen(false);
    setTimeout(() => setShowAiChat(true), 100);
  };

  // Removed early return to fix Hook order
  // if (showWelcomeScreen) { ... }

  // handleLogin removed, now handled by AuthProvider and LoginScreen

  const handleLogout = () => {
    logout();
    playSfx('click');
  };

  const openLink = (url: string) => {
    if (window.electronAPI?.openExternal) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    playSfx('click');
  };

  // --- Search Logic ---
  const handleSearch = async (typeOverride?: InputType, valueOverride?: string) => {
    const type = typeOverride || inputType;
    const value = valueOverride || inputValue;
    fullUserSearch(value, type, addToHistory);
  };

  // --- Real-time Status Update for Main Result ---


  // ... (Other search functions remain the same) ...
  const handleGroupSearch = (val?: string) => doGroupSearch(val || inputValue);

  useEffect(() => {
    if (groupResult) setShowGroupDetailModal(true);
  }, [groupResult]);

  const handleRoleClick = (role: GroupRole) => {
    if (groupResult) fetchRoleMembers(groupResult.id, role.id);
    setViewingRole(role);
  };

  const handleGameSearch = () => doGameSearch(inputValue);





  // --- Account Forge Logic ---
  const generateRandomForgeData = () => {
    const adjectives = ['Neon', 'Dark', 'Cyber', 'Ghost', 'Shadow', 'Azure', 'Crimson', 'Silent', 'Rapid', 'Swift'];
    const nouns = ['Drifter', 'Nomad', 'Ninja', 'Reaper', 'Viper', 'Hawk', 'Wolf', 'Echo', 'Pulse', 'Blade'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 9999);

    const username = `${randomAdj}${randomNoun}${randomNum}`;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const start = new Date(1995, 0, 1);
    const end = new Date(2010, 0, 1);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const birthday = randomDate.toISOString().split('T')[0];
    const gender = Math.random() > 0.5 ? '2' : '3';
    setForgeForm({ username, password, birthday, gender });
    playSfx('scan');
  };

  const handleAccountCreation = async () => {
    if (!forgeForm.username || !forgeForm.password || !forgeForm.birthday) {
      setReconResults(prev => ({ ...prev, account_forge: { loading: false, data: null, error: "يرجى ملء جميع الحقول" } }));
      playSfx('error');
      return;
    }
    setReconResults(prev => ({ ...prev, account_forge: { loading: true, data: null, error: null } }));
    setCreatedAccount(null);
    playSfx('click');
    const result = await createRobloxAccount({
      username: forgeForm.username,
      password: forgeForm.password,
      birthday: forgeForm.birthday,
      gender: parseInt(forgeForm.gender)
    });
    if (result.status === 'success') {
      setCreatedAccount({ userId: result.data.userId, username: forgeForm.username });
      setReconResults(prev => ({ ...prev, account_forge: { loading: false, data: result.data, error: null } }));
      playSfx('success');
    } else {
      setReconResults(prev => ({ ...prev, account_forge: { loading: false, data: null, error: result.message } }));
      playSfx('error');
    }
  };

  // ... (Account Manager functions remain the same) ...
  const openAccountManager = async () => {
    const accounts = await dbService.getAllManagedAccounts();
    const reports = await dbService.getAllReports();
    setManagedAccounts(accounts.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()));
    setAllReports(reports);
    setShowAccountManager(true);
    setAccountManagerView('list');
    playSfx('click');
  };

  const handleSaveAccount = async () => {
    if (!accountForm.username || !accountForm.userId) {
      alert("Username and UserID are required");
      return;
    }
    const newAccount: ManagedAccount = {
      userId: Number(accountForm.userId),
      username: accountForm.username,
      displayName: accountForm.displayName || accountForm.username,
      creationDate: accountForm.creationDate || new Date().toISOString(),
      status: (accountForm.status as ManagedAccountStatus) || 'Active',
      tags: accountForm.tags || [],
      notes: accountForm.notes || '',
      addedAt: accountForm.addedAt || new Date().toISOString(),
      linkedReportIds: accountForm.linkedReportIds || []
    };
    await dbService.saveManagedAccount(newAccount);
    await dbService.addAudit({
      action: accountForm.addedAt ? 'Account Updated' : 'Account Added',
      admin: 'Admin',
      timestamp: new Date().toISOString(),
      targetId: newAccount.userId,
      details: `Managed Account ${newAccount.username} was ${accountForm.addedAt ? 'updated' : 'added'}.`
    });
    setManagedAccounts(prev => {
      const filtered = prev.filter(a => a.userId !== newAccount.userId);
      return [newAccount, ...filtered].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    });
    setAccountManagerView('list');
    setAccountForm({ status: 'Active', tags: [], linkedReportIds: [], notes: '' });
    playSfx('success');
  };

  const handleDeleteAccount = async (userId: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الحساب من النظام؟")) return;
    await dbService.deleteManagedAccount(userId);
    await dbService.addAudit({
      action: 'Account Deleted',
      admin: 'Admin',
      timestamp: new Date().toISOString(),
      targetId: userId,
      details: `Managed Account ID ${userId} was removed.`
    });
    setManagedAccounts(prev => prev.filter(a => a.userId !== userId));
    playSfx('click');
  };

  const handleExportAccounts = async (format: 'json' | 'txt') => {
    const data = await dbService.getAllManagedAccounts();
    let content = '';
    let mimeType = '';
    let filename = `accounts_export_${Date.now()}`;
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename += '.json';
    } else {
      content = `[Roblox Managed Accounts Report]\nExport Date: ${new Date().toLocaleString()}\nTotal Accounts: ${data.length}\n\n`;
      data.forEach(acc => {
        content += `----------------------------------------\n`;
        content += `User: ${acc.displayName} (@${acc.username})\n`;
        content += `ID: ${acc.userId}\n`;
        content += `Status: ${acc.status}\n`;
        content += `Created: ${new Date(acc.creationDate).toLocaleDateString()}\n`;
        content += `Added To System: ${new Date(acc.addedAt).toLocaleString()}\n`;
        content += `Tags: ${acc.tags.join(', ') || 'None'}\n`;
        content += `Linked Reports: ${acc.linkedReportIds.length}\n`;
        content += `Notes: ${acc.notes}\n`;
      });
      mimeType = 'text/plain';
      filename += '.txt';
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    await dbService.addAudit({
      action: 'Accounts Exported',
      admin: 'Admin',
      timestamp: new Date().toISOString(),
      details: `Exported ${data.length} accounts in ${format.toUpperCase()} format.`
    });
    playSfx('export');
  };

  // --- Recon Vault Logic ---
  const handleReconFetch = async (toolId: ReconToolId) => {
    const id = reconInputs[toolId];
    if (!id) return;
    setReconResults(prev => ({ ...prev, [toolId]: { ...prev[toolId], loading: true, error: null, data: null } }));
    playSfx('click');
    const result = await fetchReconData(toolId, id);
    setReconResults(prev => ({
      ...prev,
      [toolId]: {
        loading: false,
        data: result.status === 'success' ? result.data : null,
        error: result.status === 'error' ? result.message || 'Unknown error' : null
      }
    }));
    if (result.status === 'success') playSfx('success');
    else playSfx('error');
  };

  // --- Data Management Logic ---
  const handleClearAllData = async () => {
    // Clear Local Storage & Session Storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear Database (IndexedDB)
    try {
      await dbService.clearAllData();
    } catch (e) {
      console.error("Failed to clear DB history", e);
    }

    // Reset all internal state via Hooks
    clearHistory();
    resetState();
    clearWatchlist();

    setTargetReports([]);
    setAllReports([]);
    setManagedAccounts([]);
    setReconInputs({
      old_usernames: '', deleted_assets: '', favorites_count: '', private_places: '',
      hidden_roles: '', delisted_games: '', unlisted_versions: '', product_revenue: '',
      ghost_players: '', hidden_languages: '', account_forge: '', group_treasury: '',
      verification_check: '', assets_serial: '', place_permissions: '', unread_notifications: ''
    });

    // UI Feedback
    setShowClearConfirm(false);
    playSfx('success');
    setErrorMessage("تم مسح جميع بيانات النظام بنجاح. (System Wipe Complete)");
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // --- Analyst Dashboard Logic ---
  const openAnalystDashboard = async () => {
    const reports = await dbService.getAllReports();
    reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAllReports(reports.filter(r => !r.isDeleted));
    setDeletedReports(reports.filter(r => r.isDeleted));
    setShowAnalystDashboard(true);
    playSfx('click');
  };

  const updateReportStatus = async (reportId: string, newStatus: ReportStatus) => {
    const reportIndex = allReports.findIndex(r => r.reportId === reportId);
    if (reportIndex === -1) return;
    const updatedReport = { ...allReports[reportIndex], status: newStatus };
    if (adminNote) {
      updatedReport.adminNotes = (updatedReport.adminNotes || '') + `\n[${new Date().toLocaleDateString()}] ${adminNote}`;
      setAdminNote('');
    }
    await dbService.saveReport(updatedReport);
    const newReports = [...allReports];
    newReports[reportIndex] = updatedReport;
    setAllReports(newReports);
    if ((result?.data as RobloxPlayerData)?.userId === updatedReport.targetData.userId) {
      setTargetReports(prev => prev.map(r => r.reportId === reportId ? updatedReport : r));
    }
    await dbService.addAudit({
      action: 'Status Updated',
      admin: 'Admin',
      timestamp: new Date().toISOString(),
      targetId: updatedReport.targetData.userId,
      details: `Report ${reportId} status changed to ${newStatus}.`
    });
    playSfx('success');
  };

  const deleteReport = useCallback(async (id: string) => {
    const reportToDelete = allReports.find(r => r.reportId === id);
    if (reportToDelete) {
      const updatedReport = { ...reportToDelete, isDeleted: true };
      await dbService.saveReport(updatedReport);
      setDeletedReports(prev => [...prev, updatedReport]);
      setAllReports(prev => prev.filter(r => r.reportId !== id));
      // Also update targetReports if this report is in it
      setTargetReports(prev => prev.filter(r => r.reportId !== id));
      if (selectedReportId === id) setSelectedReportId(null);
      await dbService.addAudit({
        action: 'Report Deleted',
        admin: 'Admin',
        timestamp: new Date().toISOString(),
        targetId: reportToDelete.targetData.userId,
        details: `Report ${id} moved to Recycle Bin.`
      });
      playSfx('error');
    }
  }, [allReports, selectedReportId, playSfx]);

  const restoreReport = useCallback(async (id: string) => {
    const reportToRestore = deletedReports.find(r => r.reportId === id);
    if (reportToRestore) {
      const updatedReport = { ...reportToRestore, isDeleted: false };
      await dbService.saveReport(updatedReport);
      setAllReports(prev => [...prev, updatedReport]);
      setDeletedReports(prev => prev.filter(r => r.reportId !== id));
      // Update targetReports if restoring for current user
      if (result?.data && (result.data as RobloxPlayerData).userId === updatedReport.targetData.userId) {
        setTargetReports(prev => [updatedReport, ...prev]);
      }
      await dbService.addAudit({
        action: 'Report Restored',
        admin: 'Admin',
        timestamp: new Date().toISOString(),
        targetId: updatedReport.targetData.userId,
        details: `Report ${id} restored from Recycle Bin.`
      });
      playSfx('success');
    }
  }, [deletedReports, playSfx, result]);

  const permanentlyDeleteReport = useCallback(async (id: string) => {
    await dbService.deleteReport(id);
    setDeletedReports(prev => prev.filter(r => r.reportId !== id));
    await dbService.addAudit({
      action: 'Permanent Deletion',
      admin: 'Admin',
      timestamp: new Date().toISOString(),
      details: `Report ${id} permanently removed from database.`
    });
    playSfx('error');
  }, [playSfx]);

  // --- Reports Logic ---
  const submitCyberReport = async () => {
    const userData = result?.data as RobloxPlayerData;
    if (!userData || !reportForm.summary) return;
    const newReport: CyberReport = {
      reportId: `REP-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reportType: reportForm.type,
      severity: reportForm.severity,
      status: 'Open',
      targetData: userData,
      incidentSummary: reportForm.summary,
      ageRange: 'Unknown',
      platformContext: 'Roblox Intelligence Search',
      reporterAlias: reportForm.reporterAlias || 'Anonymous Agent',
      evidence: reportForm.evidence || []
    };
    try {
      await dbService.saveReport(newReport);
      setTargetReports(prev => [newReport, ...prev]);
      setShowReportModal(false);
      setReportForm({ type: 'Suspicious Activity', severity: 'Medium', summary: '', reporterAlias: 'Anonymous', evidence: [] });
      playSfx('success');
    } catch (error) {
      console.error("Failed to save report:", error);
      playSfx('error');
    }
  };

  // --- Friends Logic ---
  const filteredFriends = useMemo(() => {
    const userData = result?.data as RobloxPlayerData;
    if (!userData) return [];

    // First filter by search query
    let filtered = userData.friendsList.filter(f =>
      f.name.toLowerCase().includes(friendSearchQuery.toLowerCase()) ||
      f.displayName.toLowerCase().includes(friendSearchQuery.toLowerCase())
    );

    // Filter by Risk (Reported Users)
    if (showRiskOnly) {
      filtered = filtered.filter(f => allReports.some(r => r.targetData.userId === f.id));
    }

    // Filter by Known Subjects (Cross-Reference)
    if (showKnownOnly) {
      filtered = filtered.filter(f => knownSubjectIds.has(f.id));
    }

    // Then sort based on selected mode
    return filtered.sort((a, b) => {
      // Priority helper: Playing (3) > Online (2) > Studio (1) > Offline (0)
      const getPriority = (presence?: string) => {
        if (presence === 'playing') return 3;
        if (presence === 'online') return 2;
        if (presence === 'studio') return 1;
        return 0;
      };

      if (friendSort === 'online') {
        const pA = getPriority(a.presence);
        const pB = getPriority(b.presence);
        if (pA !== pB) return pB - pA; // Higher priority first
        // If presence is same, sort alphabetically
        return a.displayName.localeCompare(b.displayName);
      } else if (friendSort === 'az') {
        return a.displayName.localeCompare(b.displayName);
      } else if (friendSort === 'za') {
        return b.displayName.localeCompare(a.displayName);
      }
      return 0;
    });
  }, [result?.data, friendSearchQuery, friendSort]);

  const openFriendsWithRadar = async () => {
    playSfx('scan');
    setShowFriendsModal(true);
    setFriendsLoading(true);

    // Fetch all reports to check against friends list
    const reports = await dbService.getAllReports();
    setAllReports(reports.filter(r => !r.isDeleted));
    setDeletedReports(reports.filter(r => r.isDeleted));

    // Cross-Reference: Fetch Known Subjects (Dossiers & History)
    const [dossiers, hist] = await Promise.all([
      dbService.getAllDossiers(),
      dbService.getHistory()
    ]);

    const knownIds = new Set<number>();
    Object.keys(dossiers).forEach(id => knownIds.add(Number(id)));
    hist.forEach(h => knownIds.add(h.userId));
    setKnownSubjectIds(knownIds);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate scan
    setFriendsLoading(false);
  };

  const openInfoDossier = () => {
    setInfoTab('details');
    setShowInfoModal(true);
    playSfx('click');
  };

  // --- AI & Tools ---
  const handleAiAsk = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    playSfx('click');
    try {
      const response = await askAiAssistant(aiInput, {
        target: result?.data,
        reports: targetReports
      });
      setAiResponse(response);
      setAiInput('');
      playSfx('success');
    } catch (error) {
      setAiResponse("خطأ: تعذر الوصول لخوادم الذكاء الاصطناعي.");
      playSfx('error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleExportFriends = () => {
    if (!result?.data || result.type !== 'user') return;
    const userData = result.data as RobloxPlayerData;

    playSfx('export');

    // Sort logic used for export same as view
    const sorted = [...userData.friendsList].sort((a, b) => {
      // Simple online first sort
      const getPriority = (presence?: string) => (presence === 'playing' ? 3 : presence === 'online' ? 2 : 0);
      return getPriority(b.presence) - getPriority(a.presence) || a.displayName.localeCompare(b.displayName);
    });

    const csvContent = [
      "User ID,Username,Display Name,Status,Profile URL",
      ...sorted.map(f => `${f.id},${f.name},${f.displayName},${f.presence || 'offline'},https://www.roblox.com/users/${f.id}/profile`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Friends_Network_${userData.username}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playSfx('success');
  };

  const generateSimpleAiReport = async () => {
    if (!result?.data) return;
    setIsGeneratingSimple(true);
    playSfx('click');
    const report = await generateSimplifiedReport(result.data, targetReports);
    setSimpleReport(report);
    setIsGeneratingSimple(false);
    playSfx('success');
  };

  const handleDeepScan = async () => {
    if (!result || result.type !== 'user' || !result.data) return;
    const userId = (result.data as RobloxPlayerData).userId;

    setLoadingDeepIntel(true);
    // Modal is NOT shown yet, only loading state is true (button spinner)
    try {
      const intel = await getDeepIntelData(userId);
      setDeepIntelData(intel);
      setShowDeepIntel(true); // Show modal ONLY after success
      playSfx('success');
    } catch (e) {
      console.error("Deep Scan Failed", e);
      playSfx('error');
    } finally {
      setLoadingDeepIntel(false);
    }
  };

  // Hacker Features Handlers
  const handleDigitalFootprint = async () => {
    if (!result?.data || result.type !== 'user') return;
    setFootprintLoading(true);
    setShowFootprintModal(true);
    playSfx('scan');

    const userId = (result.data as RobloxPlayerData).userId;
    const badges = await getRecentBadges(userId);

    setFootprintData(badges);
    setFootprintLoading(false);
    playSfx('success');
  };

  const handleAssetSniffer = async (type: 'Decal' | 'Audio' | 'Model' = 'Decal') => {
    if (!result?.data || result.type !== 'user') return;
    setSniffType(type);
    setSnifferLoading(true);
    setShowSnifferModal(true);
    playSfx('scan');

    const userId = (result.data as RobloxPlayerData).userId;
    const assets = await getUserCreatedAssets(userId, type);

    setSniffedAssets(assets);
    setSnifferLoading(false);
    playSfx('success');
  };

  const copyToClipboard = () => {
    const userData = result?.data as RobloxPlayerData;
    if (!userData) return;
    const text = `
    [تقرير استخباراتي - وحدة الرصد]
    --------------------------------
    الاسم: ${userData.displayName}
    المستخدم: @${userData.username}
    المعرف: ${userData.userId}
    الوصف: ${userData.description || 'لا يوجد'}
    تاريخ الإنشاء: ${userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('ar-EG') : 'غير معروف'}
    الحالة: ${userData.isBanned ? 'محظور' : 'نشط'}
    رابط الملف: https://www.roblox.com/users/${userData.userId}/profile
    --------------------------------
    تم النسخ بواسطة نظام مباحث 3.0
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    playSfx('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportOfficialPdf = () => {
    const userData = result?.data as RobloxPlayerData;
    if (!userData) return;
    playSfx('export');
    PdfService.printDossier(userData, targetReports);
  };


  const handleGhostHunt = async (target: any) => {
    if (!target.placeId && !target.rootPlaceId) {
      // Try to resolve place ID if missing (from presence logic it might be in 'placeId' or we need to fetch)
      // For now assume we have placeId from presence update
      alert("No Game ID found. Target must be in a game.");
      return;
    }
    const pid = target.placeId || target.rootPlaceId;

    setShowGhostHunter(true);
    setGhostTarget(target);
    setGhostStatus({ scanned: 0, total: 0, status: 'scanning', jobId: '' });
    playSfx('scan');

    const result = await findTargetInGame(pid, target.avatarHeadshot || target.avatarUrl, (scanned, total) => {
      setGhostStatus(prev => ({ ...prev, scanned, total }));
    });

    if (result.found && result.jobId) {
      setGhostStatus({ scanned: result.scannedServers, total: result.totalServers, status: 'found', jobId: result.jobId });
      playSfx('success');
    } else {
      setGhostStatus({ scanned: result.scannedServers, total: result.totalServers, status: 'failed', jobId: '' });
      playSfx('error');
    }
  };

  const handleConnectionTrace = async () => {
    if (!result?.data || result.type !== 'user') return;
    if (!traceTargetId) return;

    setTraceLoading(true);
    playSfx('scan');

    // Resolve target ID if it's a username (Simple check: is it a number?)
    let targetB = traceTargetId;
    // If not number, we should resolve. For now assume ID is input for simplicity OR add resolve logic.
    // Let's assume user inputs ID due to "Federal Agent" context usually dealing with IDs.

    const res = await traceConnection((result.data as RobloxPlayerData).userId, Number(targetB));
    setTraceResult(res);
    setTraceLoading(false);
    playSfx(res.type !== 'none' ? 'success' : 'error');
  };

  const handleExportZipReport = async () => {
    const userData = result?.data as RobloxPlayerData;
    if (!userData) return;

    playSfx('export');

    const zip = new JSZip();
    const dateStr = new Date().toLocaleString('ar-EG');
    const timestamp = Date.now();

    // 1. Generate Text Report (Top Secret Format)
    const groupsList = userData.groups.length > 0
      ? userData.groups.map(g => `- ${g.groupName} [Role: ${g.role}]`).join('\n')
      : '- لا توجد مجموعات.';

    const reportContent = `
==================================================
        وزارة الداخلية - وحدة الرصد والتحري
        سجل استخباراتي سري للغاية (Top Secret)
==================================================

[بيانات الهدف الأساسية]
الاسم المعروض: ${userData.displayName}
اسم المستخدم: @${userData.username}
المعرف الرقمي: ${userData.userId}
الحالة الجنائية: ${userData.isBanned ? 'محظور (BANNED)' : 'سليم (Clean)'}

[التواجد الرقمي]
تاريخ الانضمام: ${userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB') : 'N/A'}
العمر التقديري للحساب: ${userData.accountAge || 'غير متوفر'}
الرتبة: ${userData.isPremium ? 'Premium Member' : 'Standard'}
آخر ظهور مرصود: ${userData.presence === 'offline' ? 'غير متوفر' : userData.presence}

[الارتباطات والقروبات]
العدد الكلي للقروبات: ${userData.groups.length}
${groupsList}

[تحليل الأصدقاء]
إجمالي الأصدقاء: ${userData.friendsCount || '0'}

[ملاحظات المحقق الذكي]
${simpleReport || 'لا توجد تحليلات إضافية مرفقة.'}

==================================================
تم استخراج هذا التقرير آلياً بواسطة نظام "مباحث 3.0"
التاريخ: ${dateStr}
==================================================
`.trim();

    zip.file(`Intel_Report_${userData.username}.txt`, reportContent);

    // 2. Generate JSON Data
    const fullData = {
      meta: {
        extracted_at: new Date().toISOString(),
        system: "Mabahith 3.0",
        version: "v3.0.1-alpha"
      },
      target: userData,
      reports: targetReports,
      intelligence: {
        ai_analysis: simpleReport
      }
    };
    zip.file(`Target_Data_${userData.username}.json`, JSON.stringify(fullData, null, 2));

    // 3. Fetch and Add Avatar Image
    try {
      const response = await fetch(userData.avatarUrl, { mode: 'cors' });
      if (response.ok) {
        const blob = await response.blob();
        zip.file(`Subject_Avatar.png`, blob);
      } else {
        console.warn("Avatar fetch failed", response.status);
        zip.file("Avatar_Error.txt", "Could not retrieve avatar image due to network restrictions.");
      }
    } catch (err) {
      console.error("Error fetching avatar for zip:", err);
      zip.file("Avatar_Error.txt", `Could not retrieve avatar image: ${err}`);
    }

    // 4. Generate and Save ZIP
    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      // Simple download trigger
      const a = document.createElement('a');
      a.href = url;
      a.download = `Case_File_${userData.username}_${timestamp}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      playSfx('success');
    } catch (err) {
      console.error("ZIP Generation Error:", err);
      playSfx('error');
      alert("حدث خطأ أثناء ضغط الملفات.");
    }
  };


  if (showWelcomeScreen) {
    return (
      <WelcomeScreen
        onStart={handleWelcomeStart}
        onExit={handleSystemExit}
        onAiAgent={handleAiRedirect}
      />
    );
  }

  // GUEST AI MODE RENDER
  if (isGuestAiMode) {
    return (
      <div className="min-h-screen bg-[#000c1a] relative overflow-hidden flex items-center justify-center bg-[url('https://upload.wikimedia.org/wikipedia/ar/0/0a/Dakhelia.png')] bg-center bg-no-repeat bg-[length:35%] bg-blend-soft-light">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"></div>
        <AnimatePresence>
          {showAiChat && (
            <AiChatWidget
              isOpen={showAiChat}
              onClose={() => {
                setShowAiChat(false);
                setIsGuestAiMode(false);
                setShowWelcomeScreen(true); // Return to Welcome Screen on close
              }}
              result={result}
              aiResponse={aiResponse}
              aiLoading={aiLoading}
              aiInput={aiInput}
              setAiInput={setAiInput}
              handleAiAsk={handleAiAsk}
              isGuestMode={true}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onBack={() => setShowWelcomeScreen(true)} />;
  }

  const userData = result?.data && 'username' in result.data ? (result.data as RobloxPlayerData) : null;

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="relative mb-12">
              <Radar size={140} className="gold-text animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute -inset-6 border-2 border-dashed border-[#c5a059]/20 rounded-full"
              />
            </div>
            <h2 className="text-4xl font-black gold-text mb-6 uppercase tracking-tighter">جارٍ رصد الهدف...</h2>
            <div className="w-full max-w-lg bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
              <motion.div
                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6 }}
                className="h-full gold-bg shadow-[0_0_15px_#c5a059]"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="text-gray-400 font-mono text-sm uppercase"
              >
                {LOADING_STEPS[loadingStep]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#0f0505] w-full max-w-md border-2 border-red-600 rounded-[30px] p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.4)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600 blur-[60px] opacity-20"></div>
              <AlertTriangle size={64} className="text-red-500 mx-auto mb-6 animate-bounce" />
              <h2 className="text-2xl font-black text-white mb-2">تدمير البيانات بالكامل؟</h2>
              <p className="text-red-400 font-bold text-sm mb-8 leading-relaxed">
                أنت على وشك تنفيذ بروتوكول <span className="text-white bg-red-900 px-1 rounded">Format Zero</span>.
                <br />
                سيتم حذف جميع السجلات، البلاغات، الحسابات، والأرشيف نهائياً.
                <br />
                <span className="underline mt-2 block">هذا الإجراء لا يمكن التراجع عنه!</span>
              </p>
              <div className="flex gap-4">
                <button onClick={handleClearAllData} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-lg shadow-red-900/40 text-sm flex items-center justify-center gap-2">
                  تأكيد الحذف <Trash2 size={18} />
                </button>
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-2xl text-sm">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAnalyzingImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <Sparkles size={80} className="text-[#c5a059] animate-pulse" />
              <div className="absolute inset-0 border-4 border-[#c5a059] rounded-xl animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30"></div>
            </div>
            <h2 className="text-4xl font-black gold-text mb-4">جاري تحليل الصورة بالذكاء الاصطناعي</h2>
            <p className="text-gray-400 font-mono text-sm animate-pulse">Analyzing Visual Data Patterns...</p>
            <div className="flex gap-2 mt-8">
              <span className="w-3 h-3 bg-[#c5a059] rounded-full animate-bounce delay-0"></span>
              <span className="w-3 h-3 bg-[#c5a059] rounded-full animate-bounce delay-150"></span>
              <span className="w-3 h-3 bg-[#c5a059] rounded-full animate-bounce delay-300"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        openAnalystDashboard={openAnalystDashboard}
        openAccountManager={openAccountManager}
        setShowReconSidebar={setShowReconSidebar}
        handleLogout={handleLogout}
        setShowClearConfirm={setShowClearConfirm}
      />

      <React.Suspense fallback={
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000c1a]/80 backdrop-blur-sm">
          <Loader2 className="animate-spin text-[#c5a059] mb-4" size={64} />
          <p className="text-[#c5a059] font-black tracking-widest animate-pulse">LOADING MODULES...</p>
        </div>
      }>
        {/* Recon Vault Sidebar */}
        <AnimatePresence>
          {showReconSidebar && (
            <ReconSidebar
              showReconSidebar={showReconSidebar}
              setShowReconSidebar={setShowReconSidebar}
              reconInputs={reconInputs}
              setReconInputs={setReconInputs}
              reconResults={reconResults}
              handleReconFetch={handleReconFetch}
              playSfx={playSfx}
              forgeForm={forgeForm}
              setForgeForm={setForgeForm}
              onForgeAccount={handleAccountCreation}
              onGenerateForge={generateRandomForgeData}
              createdAccount={createdAccount}
              openLink={openLink}
            />
          )}
        </AnimatePresence>

        {/* Account Manager Modal (New Feature) */}
        {/* Account Manager Modal (New Feature) */}
        <React.Suspense fallback={null}>
          <AccountManagerModal
            showAccountManager={showAccountManager}
            setShowAccountManager={setShowAccountManager}
            accountManagerView={accountManagerView}
            setAccountManagerView={setAccountManagerView}
            accountForm={accountForm}
            setAccountForm={setAccountForm}
            managedAccounts={managedAccounts}
            handleSaveAccount={handleSaveAccount}
            handleDeleteAccount={handleDeleteAccount}
            handleExportAccounts={handleExportAccounts}
            tagInput={tagInput}
            setTagInput={setTagInput}
            allReports={allReports}
            playSfx={playSfx}
          />
        </React.Suspense>

        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <section className="intel-card p-6 rounded-[30px] border-r-4 border-[#c5a059]">
              <h2 className="text-xl font-black gold-text mb-6 flex items-center gap-3"><Activity size={20} /> بوابة الرصد</h2>
              <div className="space-y-4">
                <div className="space-y-1 text-right">
                  <label className="text-[10px] font-black text-gray-500 mr-2 uppercase">نوع المعرف</label>
                  <select value={inputType} onChange={e => setInputType(e.target.value as any)} className="w-full p-4 bg-white text-black font-bold rounded-2xl text-sm outline-none">
                    <option value="username">اسم المستخدم</option>
                    <option value="userId">المعرف الرقمي (ID)</option>
                    <option value="profileUrl">رابط الملف</option>
                  </select>
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-[10px] font-black text-gray-500 mr-2 uppercase">بيانات الهدف</label>
                  <div className="relative">
                    <input type="text" placeholder="ادخل البيانات هنا..." className="w-full p-4 bg-white text-black font-bold rounded-2xl text-sm outline-none" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleSearch()} disabled={loading} className="flex-1 gold-bg text-[#001a35] font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={18} />}
                    تنفيذ الرصد
                  </button>
                  <button onClick={() => handleGroupSearch()} disabled={loading} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Users size={18} />}
                    بيانات مجموعة
                  </button>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
                    <p className="text-red-400 text-xs font-bold text-center">{errorMessage}</p>
                  </div>
                )}

                <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 border-2 border-dashed border-[#c5a059]/50 rounded-2xl text-[#c5a059] font-black text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                  <Camera size={18} /> تحليل صورة (AI)
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = async (ev) => {
                      setIsAnalyzingImage(true);
                      try {
                        const res = await analyzeRobloxImage(ev.target?.result as string);
                        if (res.type && res.value) handleSearch(res.type, res.value);
                      } catch (e) {
                        console.error("AI Analysis Failed", e);
                        setErrorMessage("فشل تحليل الصورة بالذكاء الاصطناعي");
                      } finally {
                        setIsAnalyzingImage(false);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            </section>

            <section className="intel-card p-6 rounded-[30px] max-h-[500px] overflow-hidden flex flex-col">
              <h2 className="text-sm font-black gold-text mb-4 uppercase flex items-center gap-2"><History size={16} /> الأرشيف الرقمي</h2>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scroll flex-1 text-right">
                {history.length === 0 ? (
                  <p className="text-center text-gray-600 text-xs py-10 font-bold">الأرشيف فارغ</p>
                ) : history.map(item => (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.userId} onClick={() => handleSearch('userId', item.userId.toString())} className={`relative flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all group ${item.isPinned ? 'bg-[#c5a059]/10 border-[#c5a059]' : 'bg-white/5 border-white/5 hover:bg-[#c5a059]/15'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      {item.isPinned && <Pin size={12} className="text-[#c5a059] fill-[#c5a059] flex-shrink-0" />}
                      <img src={item.avatarUrl} className="w-10 h-10 rounded-xl border border-[#c5a059]/30 flex-shrink-0" />
                      <div className="text-right overflow-hidden">
                        <p className="text-xs font-black text-white whitespace-nowrap">@{item.username}</p>
                        <p className="text-[8px] text-gray-500 font-bold uppercase">{new Date(item.timestamp).toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); togglePinHistory(item.userId); }} className="p-1.5 hover:bg-[#c5a059]/20 rounded text-[#c5a059]">
                        {item.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.userId); }} className="p-1.5 hover:bg-red-500/20 rounded text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Federal Operations (Always Visible) */}
            <section className="intel-card p-6 rounded-[30px] border-r-4 border-indigo-500 animate-in slide-in-from-left duration-500 delay-100">
              <h2 className="text-xl font-black text-indigo-400 mb-4 flex items-center gap-2"><ShieldAlert size={20} /> عمليات فيدرالية</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowLinkModal(true)} className="bg-indigo-900/20 border border-indigo-500/30 hover:bg-indigo-900/40 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all">
                  <Network size={24} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">The Link</span>
                </button>
                <button onClick={clearWatchlist} className="bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all relative">
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${watchlist.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                    <span className="text-[9px] font-mono text-gray-400">{watchlist.length}</span>
                  </div>
                  <Radio size={24} className="text-red-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black text-red-300 uppercase tracking-wider">M.R.S Overlay</span>
                </button>
              </div>
              {/* Contextual Tools (Show if User Selected) */}
              {userData && (
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                  <button onClick={handleDigitalFootprint} className="bg-white/5 hover:bg-[#c5a059]/10 border border-white/5 hover:border-[#c5a059] p-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <History size={16} className="text-[#c5a059]" />
                    <span className="text-[10px] font-bold text-gray-300">Footprint</span>
                  </button>
                  <button onClick={() => handleAssetSniffer('Decal')} className="bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500 p-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Eye size={16} className="text-red-400" />
                    <span className="text-[10px] font-bold text-gray-300">Sniffer</span>
                  </button>
                </div>
              )}
            </section>
          </div>

          {searchMode === 'batch' && batchResults.length > 0 ? (
            <BatchResultsView results={batchResults} onViewDetails={(id) => handleSearch('userId', id.toString())} />
          ) : (
            <div className="lg:col-span-3 space-y-6">
              {/* Only show Deep Scan button if we have a valid User result */}
              {result && result.type === 'user' && (
                <div className="flex justify-center">
                  <button onClick={handleDeepScan} disabled={loadingDeepIntel} className="px-8 py-3 bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-500/30 rounded-2xl text-cyan-400 font-black shadow-lg shadow-cyan-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    {loadingDeepIntel ? <Loader2 className="animate-spin" /> : <Diamond size={20} />}
                    تشغيل الفحص العميق (Deep Asset Scan)
                  </button>
                </div>
              )}


              <ResultsView
                userData={userData}
                gameResult={gameResult}
                livePlayerResult={livePlayerResult}
                openLink={openLink}
                openInfoDossier={openInfoDossier}
                copyToClipboard={copyToClipboard}
                copied={copied}
                setCopied={setCopied}
                generateSimpleAiReport={generateSimpleAiReport}
                isGeneratingSimple={isGeneratingSimple}
                openFriendsWithRadar={openFriendsWithRadar}
                setShowGroupsModal={setShowGroupsModal}

                exportOfficialPdf={exportOfficialPdf}
                handleExportZipReport={handleExportZipReport}
                onOpenManualExport={() => setShowManualExportModal(true)}
                setShowReportModal={setShowReportModal}
                simpleReport={simpleReport}
                targetReports={targetReports}
                playSfx={playSfx}
                handleSearch={handleSearch}
                addToWatchlist={addToWatchlist}
                watchlist={watchlist}
              />
            </div>
          )}
        </main>

        {/* Friends Modal - Re-implemented */}
        <AnimatePresence>
          {showFriendsModal && userData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="intel-card w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[40px] border-4 border-[#c5a059] shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-[#c5a059]/30 flex justify-between items-center bg-[#001a35]">
                  <button onClick={() => setShowFriendsModal(false)} className="p-2 hover:bg-red-500/20 rounded-full text-red-500 transition-colors"><X size={24} /></button>
                  <div className="text-right">
                    <h3 className="text-2xl font-black gold-text">شبكة العلاقات والأصدقاء</h3>
                    <div className="flex justify-end gap-3 text-xs font-bold mt-1">
                      <span className="text-gray-400">TOTAL: {userData.friendsCount}</span>
                      <span className="text-[#c5a059]">|</span>
                      <span className="text-green-400">ONLINE: {userData.friendsList.filter(f => f.presence && f.presence !== 'offline').length}</span>
                      <span className="text-[#c5a059]">|</span>
                      <span className="text-red-500">REPORTED: {userData.friendsList.filter(f => allReports.some(r => r.targetData.userId === f.id)).length}</span>
                    </div>
                    {/* Visual Stats Bar */}
                    <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden flex">
                      <div
                        className="h-full bg-green-500 shadow-[0_0_10px_lime]"
                        style={{ width: `${(userData.friendsList.filter(f => f.presence && f.presence !== 'offline').length / (userData.friendsCount || 1)) * 100}%` }}
                      />
                      <div
                        className="h-full bg-red-600 shadow-[0_0_10px_red]"
                        style={{ width: `${(userData.friendsList.filter(f => allReports.some(r => r.targetData.userId === f.id)).length / (userData.friendsCount || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#000c1a] border-b border-white/10 space-y-3">
                  <div className="flex gap-2 justify-end items-center flex-wrap">
                    <button
                      onClick={() => setFriendsViewMode(friendsViewMode === 'list' ? 'graph' : 'list')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${friendsViewMode === 'graph' ? 'bg-[#c5a059] text-[#001a35] border-[#c5a059]' : 'bg-transparent text-[#c5a059] border-[#c5a059]/30 hover:bg-[#c5a059]/10'}`}
                    >
                      {friendsViewMode === 'list' ? <Network size={14} /> : <ListFilter size={14} />} {friendsViewMode === 'list' ? 'Graph View' : 'List View'}
                    </button>
                    <button
                      onClick={handleExportFriends}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-[#c5a059] text-[#001a35] border-[#c5a059] hover:brightness-110 flex items-center gap-1"
                    >
                      <Download size={14} /> Export
                    </button>
                    <button
                      onClick={() => setShowRiskOnly(!showRiskOnly)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${showRiskOnly ? 'bg-red-600 text-white border-red-500 animate-pulse' : 'bg-transparent text-red-500 border-red-500/30 hover:bg-red-900/20'}`}
                    >
                      <ShieldAlert size={14} /> {showRiskOnly ? 'Show All' : 'High Risk Only'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRiskOnly(false);
                        setShowKnownOnly(false);
                        setFriendSearchQuery('');
                        setFriendSort('online');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center gap-1"
                    >
                      <Users size={14} /> Show All
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-2"></div>

                    <button
                      onClick={() => setShowKnownOnly(!showKnownOnly)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${showKnownOnly ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-transparent text-indigo-400 border-indigo-500/30 hover:bg-indigo-900/20'}`}
                    >
                      <Database size={14} /> {showKnownOnly ? 'All Users' : 'Known Only'}
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-2"></div>

                    <button
                      onClick={() => setFriendSort('online')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${friendSort === 'online' ? 'bg-[#c5a059] text-[#001a35] border-[#c5a059]' : 'bg-transparent text-gray-400 border-white/10 hover:border-[#c5a059]/50'}`}
                    >
                      المتصلين أولاً
                    </button>
                    <button
                      onClick={() => setFriendSort('az')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${friendSort === 'az' ? 'bg-[#c5a059] text-[#001a35] border-[#c5a059]' : 'bg-transparent text-gray-400 border-white/10 hover:border-[#c5a059]/50'}`}
                    >
                      A-Z
                    </button>
                    <button
                      onClick={() => setFriendSort('za')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${friendSort === 'za' ? 'bg-[#c5a059] text-[#001a35] border-[#c5a059]' : 'bg-transparent text-gray-400 border-white/10 hover:border-[#c5a059]/50'}`}
                    >
                      Z-A
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text" placeholder="بحث في قائمة الأصدقاء..."
                      className="w-full p-4 pl-12 bg-white/5 text-white font-bold rounded-2xl outline-none focus:ring-2 ring-[#c5a059]/50 transition-all text-right"
                      value={friendSearchQuery} onChange={e => setFriendSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scroll bg-[#001424]">
                  {friendsLoading ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-4">
                      <Loader2 className="animate-spin gold-text" size={40} />
                      <p className="text-[#c5a059] font-black">جاري تحليل العلاقات...</p>
                    </div>
                  ) : filteredFriends.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-bold">لا توجد نتائج مطابقة</div>
                  ) : friendsViewMode === 'graph' ? (
                    <React.Suspense fallback={<div className="h-96 flex items-center justify-center text-[#c5a059]">Loading Graph...</div>}>
                      <div className="h-[600px] w-full border border-[#c5a059]/20 rounded-2xl overflow-hidden relative">
                        <SocialGraph
                          userData={{ ...userData, friendsList: filteredFriends }}
                          knownSubjectIds={knownSubjectIds}
                          onNodeClick={(id) => { setShowFriendsModal(false); handleSearch('userId', id.toString()); }}
                        />
                      </div>
                    </React.Suspense>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredFriends.map(friend => {
                        const hasReport = allReports.some(r => r.targetData.userId === friend.id);
                        return (
                          <div key={friend.id} onClick={() => { setShowFriendsModal(false); handleSearch('userId', friend.id.toString()); }} className={`bg-white/5 p-4 rounded-2xl border ${hasReport ? 'border-red-500 bg-red-900/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/5 hover:border-[#c5a059] hover:bg-[#c5a059]/10'} cursor-pointer transition-all group text-center relative overflow-hidden`}>
                            <img src={friend.avatarUrl} className={`w-20 h-20 rounded-full mx-auto mb-3 border-2 ${hasReport ? 'border-red-500' : 'border-[#c5a059]/30'} group-hover:border-[#c5a059] transition-all`} loading="lazy" />
                            <h4 className="font-bold text-white truncate text-sm flex items-center justify-center gap-1">
                              {friend.displayName}
                              {hasReport && <ShieldAlert size={12} className="text-red-500" />}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">@{friend.name}</p>
                            <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${friend.presence === 'playing' ? 'bg-green-500 shadow-[0_0_10px_lime] animate-ping' :
                                friend.presence === 'online' ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-pulse' :
                                  friend.presence === 'studio' ? 'bg-purple-400 shadow-[0_0_10px_#a78bfa] animate-pulse' :
                                    'bg-gray-600'
                              }`}></div>
                            {friend.presence === 'playing' && <p className="text-[9px] text-green-400 mt-1 font-black uppercase">In Game</p>}
                            {friend.presence === 'online' && <p className="text-[9px] text-blue-400 mt-1 font-black uppercase">On Website</p>}
                            {friend.presence === 'studio' && <p className="text-[9px] text-purple-400 mt-1 font-black uppercase">In Studio</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Info Dossier Modal - Re-implemented */}
        <AnimatePresence>
          {showInfoModal && userData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="intel-card w-full max-w-5xl h-[85vh] flex flex-col rounded-[30px] border border-[#c5a059]/50 shadow-2xl relative overflow-hidden bg-[#001a35]">
                <div className="p-6 border-b border-[#c5a059]/20 flex justify-between items-center bg-black/20">
                  <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={24} className="text-gray-400" /></button>
                  <div className="flex gap-4 items-center">
                    <button onClick={() => addToWatchlist(userData)} className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${watchlist.some(u => u.userId === userData.userId) ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'}`}>
                      <Radio size={14} className={watchlist.some(u => u.userId === userData.userId) ? 'animate-pulse' : ''} />
                      {watchlist.some(u => u.userId === userData.userId) ? 'MONITORING' : 'ADD TO WATCHLIST'}
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <button onClick={() => setInfoTab('groups')} className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${infoTab === 'groups' ? 'gold-bg text-[#001a35]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>المجموعات ({userData.groups.length})</button>
                    <button onClick={() => setInfoTab('details')} className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${infoTab === 'details' ? 'gold-bg text-[#001a35]' : 'bg-white/5 text-gray-400 hover:text-white'}`}>البيانات الأساسية</button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scroll bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                  {infoTab === 'details' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <StatItem label="User ID" value={userData.userId} icon={<Fingerprint size={16} className="text-[#c5a059]" />} />
                      <StatItem label="Account Age" value={userData.accountAge || 'N/A'} icon={<Clock size={16} className="text-blue-400" />} />
                      <StatItem label="Join Date" value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('ar-EG') : 'N/A'} icon={<Calendar size={16} className="text-green-400" />} />
                      <StatItem label="Premium" value={userData.isPremium ? 'Active' : 'None'} color={userData.isPremium ? 'text-yellow-400' : 'text-gray-500'} icon={<Star size={16} />} />
                      <StatItem label="Ban Status" value={userData.isBanned ? 'BANNED' : 'Clean'} color={userData.isBanned ? 'text-red-500' : 'text-green-500'} icon={<Ban size={16} />} />
                      <StatItem label="Friends" value={userData.friendsCount || 0} icon={<Users size={16} className="text-indigo-400" />} />
                      <StatItem label="Last Online" value={userData.lastOnline ? new Date(userData.lastOnline).toLocaleString('ar-EG') : 'Hidden'} icon={<Radio size={16} className="text-red-400 animate-pulse" />} />
                      <StatItem label="Net Worth (Est)" value={`$${(userData.estimatedValue || 0).toLocaleString()}`} icon={<Wallet size={16} className="text-[#c5a059]" />} />
                      <div className="col-span-full mt-4">
                        <label className="text-xs text-gray-500 font-black uppercase mb-2 block">Bio / Description</label>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto custom-scroll">
                          {userData.description || "No description provided."}
                        </div>
                      </div>
                      <div className="col-span-full">
                        <label className="text-xs text-gray-500 font-black uppercase mb-2 block">Username History (Aliases)</label>
                        <div className="flex flex-wrap gap-2">
                          {userData.previousUsernames && userData.previousUsernames.length > 0 ? (
                            userData.previousUsernames.map((alias, i) => (
                              <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-gray-400 flex items-center gap-2">
                                <History size={10} /> {alias}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-600 italic">No previous aliases found.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.groups.map(group => (
                        <div key={group.groupId} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:border-[#c5a059] transition-all group hover:bg-[#c5a059]/5 cursor-pointer" onClick={() => { setShowInfoModal(false); handleGroupSearch(group.groupId.toString()); }}>
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-gray-500 font-mono">RANK: {group.rank}</span>
                            <ExternalLink size={16} className="text-gray-600 group-hover:text-[#c5a059]" />
                          </div>
                          <div className="text-right">
                            <h4 className="font-bold text-white group-hover:text-[#c5a059] transition-colors">{group.groupName}</h4>
                            <p className="text-xs text-gray-400">{group.role}</p>
                          </div>
                        </div>
                      ))}
                      {userData.groups.length === 0 && <p className="col-span-full text-center py-20 text-gray-500 font-bold">لا ينتمي لأي مجموعات</p>}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Groups List Modal (User's Groups) */}
        <AnimatePresence>
          {showGroupsModal && userData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="intel-card w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[40px] border-4 border-[#c5a059] shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-[#c5a059]/30 flex justify-between items-center bg-[#001a35]">
                  <button onClick={() => setShowGroupsModal(false)} className="p-2 hover:bg-red-500/20 rounded-full text-red-500 transition-colors"><X size={24} /></button>
                  <div className="text-right">
                    <h3 className="text-2xl font-black gold-text">قروبات اللاعب</h3>
                    <p className="text-xs text-gray-400 font-bold">TOTAL GROUPS: {userData.groups.length}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scroll bg-[#001424]">
                  {userData.groups.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-bold">لا ينتمي لأي مجموعات</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userData.groups.map(group => (
                        <div key={group.groupId} onClick={() => { setShowGroupsModal(false); handleGroupSearch(group.groupId.toString()); }} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-[#c5a059] hover:bg-[#c5a059]/10 cursor-pointer transition-all group flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start mb-2">
                            <ExternalLink size={16} className="text-gray-600 group-hover:text-[#c5a059]" />
                            <h4 className="font-bold text-white text-right group-hover:text-[#c5a059] transition-colors line-clamp-2">{group.groupName}</h4>
                          </div>
                          <div className="text-right border-t border-white/10 pt-3 mt-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-black px-2 py-1 rounded ${group.rank === 255 ? 'bg-red-900 text-red-200' : group.rank >= 200 ? 'bg-orange-900 text-orange-200' : group.rank >= 100 ? 'bg-indigo-900 text-indigo-200' : 'bg-gray-800 text-gray-400'}`}>
                                {group.rank === 255 ? 'OWNER' : group.rank >= 200 ? 'ADMIN' : group.rank >= 100 ? 'DEV/HIGH' : 'MEMBER'}
                              </span>
                              <span className="text-[10px] font-mono text-gray-500">RANK: {group.rank}</span>
                            </div>
                            <p className="text-xs text-gray-300 mt-2 font-bold">{group.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Deep Intel Modal (New Feature pop-up) */}
        <AnimatePresence>
          {showDeepIntel && deepIntelData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="intel-card w-full max-w-6xl max-h-[90vh] flex flex-col rounded-[40px] border-4 border-cyan-500/30 shadow-2xl relative overflow-hidden bg-[#001020]">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-50"></div>
                <div className="p-6 border-b border-cyan-500/20 flex justify-between items-center bg-[#001a35]">
                  <button onClick={() => setShowDeepIntel(false)} className="p-2 hover:bg-cyan-500/20 rounded-full text-cyan-500 transition-colors"><X size={24} /></button>
                  <div className="text-right">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 justify-end">
                      <span className="text-cyan-400">Deep Asset Scan</span> تقرير الثروة والتحليل السلوكي
                      <Sparkles className="text-cyan-400" />
                    </h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">ADVANCED INTELLIGENCE REPORT</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scroll">
                  {loadingDeepIntel ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <Loader2 className="animate-spin text-cyan-400" size={48} />
                      <p className="text-cyan-400 font-bold animate-pulse">Scanning Digital Assets...</p>
                    </div>
                  ) : (
                    <DeepIntelView
                      collectibles={deepIntelData.collectibles}
                      badges={deepIntelData.badges}
                      playerData={result?.data as RobloxPlayerData}
                      loading={loadingDeepIntel}
                    />
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* NEW: Group Detail Modal (The fix you requested) */}
        <AnimatePresence>
          {showGroupDetailModal && groupResult && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="intel-card w-full max-w-5xl max-h-[90vh] flex flex-col rounded-[40px] border-4 border-[#c5a059] relative overflow-hidden bg-[#001020]">
                <div className="p-6 border-b border-[#c5a059]/30 flex justify-between items-center bg-[#001a35]">
                  <button onClick={() => setShowGroupDetailModal(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"><X size={24} /></button>
                  <div className="text-right">
                    <h3 className="text-2xl font-black gold-text">بيانات المجموعة السرية</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">SECURE GROUP ANALYSIS</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                  <div className="flex flex-col md:flex-row gap-8 items-start text-right">
                    <img src={groupResult.iconUrl} className="w-40 h-40 rounded-[25px] border-4 border-[#c5a059] bg-[#001a35] shadow-xl" />
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex flex-col items-end">
                        <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">GROUP ID: {groupResult.id}</span>
                        <h2 className="text-4xl font-black gold-text leading-tight">{groupResult.name}</h2>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-right">
                          <p className="text-[9px] text-gray-500 font-black uppercase">المالك</p>
                          <div className="flex items-center justify-end gap-1 text-white font-bold cursor-pointer hover:text-[#c5a059]" onClick={() => {
                            if (groupResult.owner) {
                              setShowGroupDetailModal(false);
                              handleSearch('userId', groupResult.owner.id.toString());
                            }
                          }}>
                            {groupResult.owner ? (
                              <>
                                <span>{groupResult.owner.displayName}</span>
                                <UserCog size={14} />
                              </>
                            ) : 'لا يوجد'}
                          </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-right">
                          <p className="text-[9px] text-gray-500 font-black uppercase">الأعضاء</p>
                          <div className="flex items-center justify-end gap-1 text-white font-bold">
                            <span>{groupResult.memberCount.toLocaleString()}</span>
                            <Users size={14} />
                          </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-right">
                          <p className="text-[9px] text-gray-500 font-black uppercase">التأسيس</p>
                          <div className="flex items-center justify-end gap-1 text-white font-bold">
                            <span>{new Date(groupResult.created).toLocaleDateString('ar-EG')}</span>
                            <Calendar size={14} />
                          </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-right">
                          <p className="text-[9px] text-gray-500 font-black uppercase">الحالة</p>
                          <div className="flex items-center justify-end gap-1 font-bold">
                            <span className={groupResult.isLocked ? "text-red-500" : "text-green-500"}>{groupResult.isLocked ? "مغلقة" : "مفتوحة"}</span>
                            {groupResult.isLocked ? <Lock size={14} /> : <Globe size={14} />}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl relative mt-4">
                        <p className="text-[10px] text-[#c5a059] font-black absolute -top-3 right-4 bg-[#001424] px-2">الوصف / Description</p>
                        <p className="text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto custom-scroll whitespace-pre-line">{groupResult.description || "لا يوجد وصف."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-black gold-text mb-4 flex items-center justify-end gap-2"><Briefcase size={20} /> هيكل الرتب ({groupResult.roles.length})</h3>
                    {viewingRole ? (
                      <div className="animate-in fade-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <button onClick={() => setViewingRole(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2">
                            <ArrowRight size={16} /> عودة للرتب
                          </button>
                          <div className="text-right">
                            <h4 className="text-xl font-black gold-text flex items-center justify-end gap-2">
                              {viewingRole.name} <span className="bg-[#c5a059] text-[#001a35] text-[10px] px-2 py-0.5 rounded ml-2">Rank: {viewingRole.rank}</span>
                            </h4>
                            <p className="text-xs text-gray-500 font-bold">{viewingRole.memberCount.toLocaleString()} Members</p>
                          </div>
                        </div>

                        {roleMembersLoading ? (
                          <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-[#c5a059]" size={40} />
                            <p className="text-gray-400 font-bold text-sm">جاري جلب قائمة الأعضاء...</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto custom-scroll p-1">
                            {roleMembers.map((member) => (
                              <div key={member.userId} onClick={() => { setShowGroupDetailModal(false); handleSearch('userId', member.userId.toString()); }} className="p-4 bg-white/5 border border-white/5 hover:border-[#c5a059] hover:bg-[#c5a059]/10 rounded-2xl cursor-pointer text-center group transition-all relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src={member.avatarUrl || `https://tr.rbxcdn.com/30DAY-AvatarHeadshot-${member.userId}-150x150/png`}
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-1-150x150/png'; }}
                                  className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white/10 group-hover:border-[#c5a059] transition-colors shadow-lg" loading="lazy" />
                                <h4 className="font-bold text-white truncate text-sm group-hover:text-[#c5a059] transition-colors">{member.displayName || member.username}</h4>
                                <p className="text-[10px] text-gray-400 font-mono truncate">@{member.username}</p>
                                <div className="mt-2 text-[9px] text-gray-500 bg-black/20 rounded py-1 font-mono">{member.userId}</div>
                              </div>
                            ))}
                            {roleMembers.length === 0 && !roleMembersLoading && (
                              <div className="col-span-full text-center py-10 text-gray-500 font-bold">لا يوجد أعضاء في هذه الرتبة.</div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                          <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase">
                              <th className="p-3 rounded-r-xl">Role Name</th>
                              <th className="p-3">Rank ID</th>
                              <th className="p-3 rounded-l-xl">Members</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-gray-200">
                            {groupResult.roles.map((role) => (
                              <tr key={role.id} onClick={() => handleRoleClick(role)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                <td className="p-3 font-bold group-hover:text-[#c5a059] transition-colors flex items-center justify-end gap-2">
                                  {role.name} <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
                                </td>
                                <td className="p-3 font-mono text-[#c5a059]">{role.rank}</td>
                                <td className="p-3">{role.memberCount.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Report Modal - Re-implemented */}
        <AnimatePresence>
          {showReportModal && userData && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-red-900/40 backdrop-blur-md">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0f0505] w-full max-w-lg max-h-[90vh] flex flex-col rounded-[30px] border-2 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden">
                <div className="p-6 bg-red-600/10 border-b border-red-500/20 flex items-center justify-between shrink-0">
                  <button onClick={() => setShowReportModal(false)}><X className="text-red-400 hover:text-white" /></button>
                  <h3 className="text-xl font-black text-red-500 flex items-center gap-2">إنشاء بلاغ سيبراني <ShieldAlert /></h3>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto custom-scroll">
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-bold text-gray-400">نوع الانتهاك</label>
                    <select className="w-full p-3 bg-white/5 border border-red-500/30 rounded-xl text-white outline-none" value={reportForm.type} onChange={e => setReportForm({ ...reportForm, type: e.target.value as ReportType })}>
                      <option value="Suspicious Activity">نشاط مشبوه (Suspicious Activity)</option>
                      <option value="Harassment">تحرش / تنمر (Harassment)</option>
                      <option value="Scam / Fraud">احتيال (Scam)</option>
                      <option value="Impersonation">انتحال شخصية (Impersonation)</option>
                      <option value="Other">أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-bold text-gray-400">مستوى الخطورة</label>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map((lvl) => (
                        <button key={lvl} onClick={() => setReportForm({ ...reportForm, severity: lvl as SeverityLevel })} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase border transition-all ${reportForm.severity === lvl ? (lvl === 'High' ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : lvl === 'Medium' ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]') : 'border-white/10 text-gray-500 hover:bg-white/5'}`}>
                          {lvl === 'High' ? 'خطورة عالية' : lvl === 'Medium' ? 'خطورة متوسطة' : 'منخفضة'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-bold text-gray-400">تفاصيل الواقعة</label>
                    <textarea className="w-full p-4 bg-white/5 border border-red-500/30 rounded-xl text-white min-h-[100px] outline-none text-right" placeholder="اشرح المشكلة بالتفصيل..." value={reportForm.summary} onChange={e => setReportForm({ ...reportForm, summary: e.target.value })}></textarea>
                  </div>

                  {/* Evidence Section */}
                  {/* Evidence Section (Updated with File Upload) */}
                  <div className="space-y-4 text-right border-t border-red-500/20 pt-4">
                    <label className="text-sm font-bold text-gray-400">الأدلة والمرفقات (Evidence)</label>

                    {/* File Upload Button */}
                    <div className="flex justify-end">
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors group">
                        <div className="text-left">
                          <p className="text-white font-bold text-xs group-hover:text-[#c5a059]">رفع صورة من الجهاز</p>
                          <p className="text-[10px] text-gray-500">JPG, PNG (Max 5MB)</p>
                        </div>
                        <div className="p-2 bg-black/50 rounded-lg text-[#c5a059]">
                          <ImageIcon size={18} />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setReportForm({
                                    ...reportForm,
                                    evidence: [...(reportForm.evidence || []), {
                                      label: file.name,
                                      url: ev.target.result as string,
                                      type: 'image'
                                    }]
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="relative flex items-center gap-4 my-2">
                      <div className="h-px bg-white/5 flex-1"></div>
                      <span className="text-[10px] text-gray-500 font-mono">OR ADD LINK</span>
                      <div className="h-px bg-white/5 flex-1"></div>
                    </div>

                    {/* Link Input */}
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const labelInput = document.getElementById('evidence-label') as HTMLInputElement;
                        const urlInput = document.getElementById('evidence-url') as HTMLInputElement;
                        if (labelInput.value && urlInput.value) {
                          setReportForm({
                            ...reportForm,
                            evidence: [...(reportForm.evidence || []), { label: labelInput.value, url: urlInput.value, type: 'link' }]
                          });
                          labelInput.value = '';
                          urlInput.value = '';
                        }
                      }} className="px-4 bg-[#c5a059] text-[#001a35] font-black rounded-lg text-lg hover:brightness-110 shadow-lg shadow-[#c5a059]/20">+</button>
                      <input type="text" placeholder="عنوان الرابط (مثال: صورة المحادثة)" className="flex-1 p-3 bg-white/5 text-xs text-white rounded-xl border border-white/10 text-right outline-none focus:border-[#c5a059]/50 transition-colors" id="evidence-label" />
                      <input type="text" placeholder="https://..." className="flex-1 p-3 bg-white/5 text-xs text-white rounded-xl border border-white/10 text-right outline-none focus:border-[#c5a059]/50 transition-colors dir-ltr" dir="ltr" id="evidence-url" />
                    </div>

                    {/* Evidence List */}
                    {reportForm.evidence && reportForm.evidence.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 p-2 bg-black/20 rounded-xl border border-white/5 max-h-[150px] overflow-y-auto custom-scroll">
                        {reportForm.evidence.map((ev, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5 group">
                            <button onClick={() => setReportForm({ ...reportForm, evidence: reportForm.evidence?.filter((_, i) => i !== idx) })} className="w-6 h-6 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
                              <X size={14} />
                            </button>
                            <div className="flex-1 text-right">
                              <p className="text-xs text-gray-200 font-bold truncate">{ev.label}</p>
                              <p className="text-[10px] text-[#c5a059] font-mono uppercase">{ev.type}</p>
                            </div>
                            <div className="w-8 h-8 rounded bg-black/40 flex items-center justify-center text-gray-500">
                              {ev.type === 'image' ? (
                                <img src={ev.url} alt="preview" className="w-full h-full object-cover rounded" />
                              ) : (
                                <Link size={14} />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={submitCyberReport} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-lg shadow-red-900/50 transition-all uppercase flex items-center justify-center gap-2 shrink-0">
                    <FileWarning size={20} /> تسجيل البلاغ في النظام
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Analyst Dashboard - Re-implemented */}
        <AnimatePresence>
          {showAnalystDashboard && (
            <AnalystDashboard
              showAnalystDashboard={showAnalystDashboard}
              setShowAnalystDashboard={setShowAnalystDashboard}
              allReports={allReports}
              deletedReports={deletedReports}
              selectedReportId={selectedReportId}
              setSelectedReportId={setSelectedReportId}
              updateReportStatus={updateReportStatus}
              deleteReport={deleteReport}
              restoreReport={restoreReport}
              permanentlyDeleteReport={permanentlyDeleteReport}
              adminNote={adminNote}
              setAdminNote={setAdminNote}
              onViewProfile={(id) => { setShowAnalystDashboard(false); handleSearch('userId', id); }}
            />
          )}
        </AnimatePresence>

        {/* Digital Footprint Modal */}
        <AnimatePresence>
          {showFootprintModal && userData && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="intel-card w-full max-w-4xl max-h-[85vh] flex flex-col rounded-[30px] border border-[#c5a059] shadow-2xl relative overflow-hidden bg-[#001020]">
                <div className="p-6 border-b border-[#c5a059]/20 flex justify-between items-center bg-[#001a35]">
                  <button onClick={() => setShowFootprintModal(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
                  <div className="text-right">
                    <h3 className="text-2xl font-black gold-text flex items-center justify-end gap-2">
                      Digital Footprint <History size={24} />
                    </h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">GAMEPLAY TIMELINE RECONSTRUCTION</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scroll bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                  {footprintLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <Loader2 className="animate-spin text-[#c5a059]" size={48} />
                      <p className="text-[#c5a059] animate-pulse font-mono tracking-widest">TRACING BADGE TIMESTAMPS...</p>
                    </div>
                  ) : footprintData.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-bold">
                      NO FOOTPRINT DETECTED (Privacy Settings or No Data)
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-[#c5a059]/30 ml-4 md:ml-10 space-y-8 pl-8 py-4">
                      {footprintData.map((badge, i) => (
                        <div key={i} className="relative group">
                          <span className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-[#001020] border-2 border-[#c5a059] group-hover:bg-[#c5a059] transition-colors"></span>
                          <div className="bg-white/5 border border-white/5 p-4 rounded-xl hover:border-[#c5a059] hover:bg-white/10 transition-all flex gap-4 items-start">
                            <img src={badge.iconImageId ? `https://tr.rbxcdn.com/${badge.iconImageId}/150/150/Image/Png` : 'https://tr.rbxcdn.com/bad-badge-placeholder/150/150/Image/Png'}
                              className="w-16 h-16 rounded-lg object-contain bg-black/30"
                            />
                            <div className="flex-1 text-right">
                              <span className="text-[10px] text-[#c5a059] font-mono font-bold bg-[#c5a059]/10 px-2 py-0.5 rounded mb-1 inline-block">
                                {badge.awardedDate ? new Date(badge.awardedDate).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Unknown Date'}
                              </span>
                              <h4 className="text-lg font-black text-white leading-tight group-hover:text-[#c5a059] transition-colors">{badge.name}</h4>
                              <p className="text-xs text-gray-400 mt-1 font-mono">
                                Awarded in: <span className="text-gray-300 font-bold underline cursor-pointer hover:text-white">{badge.awarder?.id ? `Game ID ${badge.awarder.id}` : 'Unknown Place'}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Asset Sniffer Modal */}
        {/* Asset Sniffer Modal */}
        <AnimatePresence>
          {showSnifferModal && userData && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
              <AssetScanner
                userData={userData}
                onClose={() => setShowSnifferModal(false)}
              />
            </div>
          )}
        </AnimatePresence>
        {/* The Link Modal */}
        <AnimatePresence>
          {showLinkModal && userData && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" dir="rtl">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="intel-card w-full max-w-lg flex flex-col rounded-[30px] border border-indigo-500/50 shadow-2xl relative overflow-hidden bg-[#000510]">
                <div className="p-6 border-b border-indigo-500/20 flex justify-between items-center bg-[#05051a]">
                  <div className="text-right flex-1">
                    <h3 className="text-xl font-black text-indigo-400 flex items-center gap-2">
                      كشف الارتباط <Network size={20} />
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">بروتوكول تتبع العلاقات</p>
                  </div>
                  <button onClick={() => setShowLinkModal(false)} className="p-2 hover:bg-white/10 rounded-full text-indigo-400 transition-colors"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-bold text-gray-400 uppercase">الهدف الثاني (معرف المستخدم)</label>
                    <input
                      type="text"
                      value={traceTargetId}
                      onChange={(e) => setTraceTargetId(e.target.value)}
                      placeholder="أدخل معرف الهدف الثاني..."
                      className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white font-mono focus:border-indigo-500 outline-none text-right"
                    />
                  </div>

                  <button onClick={handleConnectionTrace} disabled={traceLoading || !traceTargetId} className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-xl uppercase tracking-widest transition-all">
                    {traceLoading ? <Loader2 className="animate-spin mx-auto" /> : 'بدء التتبع'}
                  </button>

                  {traceResult && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in zoom-in duration-300">
                      <div className={`text-center font-black text-lg mb-2 ${traceResult.type !== 'none' ? 'text-green-400' : 'text-red-400'}`}>
                        {traceResult.type === 'direct' && 'تم تأكيد اتصال مباشر'}
                        {traceResult.type === 'mutual' && 'تم العثور على اتصال غير مباشر'}
                        {traceResult.type === 'none' && 'لم يتم الكشف عن أي ارتباط'}
                      </div>
                      <p className="text-xs text-gray-400 text-center font-mono">{traceResult.details}</p>
                      {traceResult.path.length > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-2 flex-row-reverse">
                          {traceResult.path.map((id: any, i: number) => (
                            <React.Fragment key={i}>
                              <div className="px-2 py-1 bg-black rounded text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                                {id}
                              </div>
                              {i < traceResult.path.length - 1 && <ArrowRight size={12} className="text-gray-600 rotate-180" />}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )
          }
        </AnimatePresence >

        {/* AI Chat Interface - Re-implemented with Widget */}
        <AnimatePresence>
          {
            showAiChat && (
              <AiChatWidget
                isOpen={showAiChat}
                onClose={() => setShowAiChat(false)}
                result={result}
                aiResponse={aiResponse}
                aiLoading={aiLoading}
                aiInput={aiInput}
                setAiInput={setAiInput}
                handleAiAsk={handleAiAsk}
                isGuestMode={false}
              />
            )
          }
        </AnimatePresence >

        <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-4">
          <button onClick={() => setShowAiChat(!showAiChat)} className="p-4 gold-bg text-[#001a35] rounded-full shadow-[0_0_25px_rgba(197,160,89,0.5)] hover:scale-110 transition-all border-4 border-[#001a35]"><Sparkles size={24} /></button>
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-4 bg-black/60 border-2 border-[#c5a059]/30 rounded-full gold-text hover:bg-black transition-all">
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        {/* SURVEILLANCE CENTER OVERLAY (Real-time Widget) */}
        <div className={`fixed top-24 right-4 w-72 bg-black/95 backdrop-blur-md border rounded-xl overflow-hidden z-[100] shadow-2xl transition-all duration-300 ${watchlist.length === 0 ? 'opacity-0 translate-x-20 pointer-events-none' : 'opacity-100 translate-x-0'} ${showSurveillance ? 'border-red-500/50' : 'border-gray-600/30'}`} dir="rtl">

          {/* Header */}
          <div className={`p-3 border-b flex justify-between items-center cursor-pointer transition-colors ${showSurveillance ? 'bg-red-900/20 border-red-500/20' : 'bg-gray-900/50 border-gray-700/30'}`} onClick={() => setShowSurveillance(!showSurveillance)}>
            <h4 className={`text-xs font-black flex items-center gap-2 ${showSurveillance ? 'text-red-400' : 'text-gray-400'}`}>
              <Radio size={12} className={watchlist.length > 0 && showSurveillance ? "animate-pulse" : ""} />
              المراقبة الحية ({watchlist.length})
            </h4>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); setShowSurveillance(!showSurveillance); }} className="text-gray-500 hover:text-white">
                {showSurveillance ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              {showSurveillance && <button onClick={(e) => { e.stopPropagation(); clearWatchlist(); }} className="text-[10px] text-gray-500 hover:text-red-400 font-bold">مسح الكل</button>}
            </div>
          </div>

          {/* Body (Collapsible) */}
          <AnimatePresence>
            {showSurveillance && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <div className="max-h-60 overflow-y-auto custom-scroll p-2 space-y-2 bg-black/40">
                  {watchlist.length === 0 && <p className="text-[10px] text-gray-500 text-center py-2">لا توجد أهداف نشطة.</p>}
                  {watchlist.map(target => (
                    <div key={target.userId} className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${target.presence === 'playing' ? 'bg-green-900/10 border-green-500/30' : target.presence === 'online' ? 'bg-blue-900/10 border-blue-500/30' : 'bg-transparent border-white/5'}`}>
                      <div className="relative">
                        <img src={target.avatarUrl || `https://tr.rbxcdn.com/${target.userId}/150/150/AvatarHeadshot/Png`} className="w-8 h-8 rounded-full bg-black" />
                        <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${target.presence === 'playing' ? 'bg-green-500 shadow-[0_0_8px_lime]' : target.presence === 'online' ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
                      </div>
                      <div className="flex-1 overflow-hidden text-right">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-gray-200 truncate">{target.username}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${target.presence === 'playing' ? 'bg-green-500/20 text-green-400' : target.presence === 'online' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-600'}`}>
                            {target.presence === 'playing' ? 'يلعب' : target.presence === 'online' ? 'متصل' : 'غير متصل'}
                          </span>
                        </div>
                        {target.currentGame && target.presence === 'playing' && (
                          <div className="flex justify-between items-center mt-0.5">
                            <p className="text-[9px] text-green-400 truncate flex items-center gap-1">
                              <Gamepad2 size={8} /> {target.currentGame}
                            </p>
                            <button onClick={(e) => { e.stopPropagation(); handleGhostHunt(target); }} className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/40 text-[9px] text-red-400 border border-red-500/50 rounded flex items-center gap-1 transition-all">
                              <Radar size={8} /> تعقب السيرفر
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Logs */}
                <div className="border-t border-white/10 p-2 bg-black/80 font-mono text-[9px] max-h-32 overflow-y-auto custom-scroll text-right">
                  <p className="text-gray-600 font-bold mb-1 uppercase tracking-widest pl-1">سجل النشاط</p>
                  {surveillanceLogs.length === 0 && <p className="text-gray-700 italic pl-1">بانتظار النشاط...</p>}
                  {surveillanceLogs.slice().reverse().map((log, i) => (
                    <div key={i} className="text-gray-400 py-0.5 border-r-2 border-transparent hover:border-red-500 pr-2 transition-all">
                      <span className="text-red-500 font-bold">[{log.time}]</span> <span className={log.msg.includes('ONLINE') ? 'text-green-400' : log.msg.includes('JOINED') ? 'text-yellow-400' : 'text-gray-400'}>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Manual Export Modal */}
        <AnimatePresence>
          {showManualExportModal && result?.data && (
            <ManualExportModal
              userData={result.data as RobloxPlayerData}
              reports={targetReports}
              onClose={() => setShowManualExportModal(false)}
            />
          )}
        </AnimatePresence>
      </React.Suspense >
    </div >
  );
};

const StatItem: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; color?: string }> = ({ label, value, icon, color }) => (
  <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-right flex flex-col justify-center hover:bg-white/5 transition-all">
    <div className="flex items-center justify-end gap-2 mb-1">
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
      {icon}
    </div>
    <p className={`text-xl font-mono font-black truncate ${color || 'text-white'}`}>{value}</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;

