/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Trophy,
  UserCheck,
  History,
  Layers,
  Users,
  FileSpreadsheet,
  PlusCircle,
  LogOut,
  Sparkles,
  CheckCircle2,
  Settings as SettingsIcon,
  Printer,
  Wallet,
  UserSquare2
} from 'lucide-react';
import { Session, JenisAktivitasMengaji } from './types';
import {
  getCurrentSession,
  getDashboardData,
  initializeDatabase,
  logoutUser,
  resetToDefaultData,
  getAppSettings,
  subscribeToCloudChanges
} from './services/storageService';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProgressSantriView } from './components/ProgressSantriView';
import { RiwayatSetoranView } from './components/RiwayatSetoranView';
import { ManajemenKelasView } from './components/ManajemenKelasView';
import { ManajemenUserView } from './components/ManajemenUserView';
import { LaporanView } from './components/LaporanView';
import { PengaturanView } from './components/PengaturanView';
import { InputSetoranModal } from './components/InputSetoranModal';
import { GantiPasswordModal } from './components/GantiPasswordModal';
import { PublicPortalView } from './components/PublicPortalView';
import { CetakFormManualView } from './components/CetakFormManualView';
import { DaftarSantriView } from './components/DaftarSantriView';
import { InfakView } from './components/InfakView';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [viewingPublicPortal, setViewingPublicPortal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modals
  const [isInputSetoranOpen, setIsInputSetoranOpen] = useState(false);
  const [preselectedNis, setPreselectedNis] = useState<string | undefined>(undefined);
  const [defaultAktivitas, setDefaultAktivitas] = useState<JenisAktivitasMengaji>('tahfizh');
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [selectedNisForDetail, setSelectedNisForDetail] = useState<string | null>(null);

  // Initialize storage and load session
  useEffect(() => {
    initializeDatabase(false);
    const existing = getCurrentSession();
    if (existing) {
      setSession(existing);
    }

    // Real-time synchronization across multiple browsers & devices
    const unsubscribe = subscribeToCloudChanges(() => {
      setDataVersion((v) => v + 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (newSession: Session) => {
    setSession(newSession);
    setShowLoginScreen(false);
    setViewingPublicPortal(false);
    setActiveTab('dashboard');
    showToast(`Selamat datang, ${newSession.nama}!`);
  };

  const handleLogout = () => {
    logoutUser();
    setSession(null);
    setShowLoginScreen(false);
    setViewingPublicPortal(false);
    setActiveTab('dashboard');
  };

  const handleResetData = () => {
    if (window.confirm('Reset seluruh data ke sampel bawaan awal? Semua data baru akan diganti ke data default.')) {
      resetToDefaultData();
      setDataVersion((v) => v + 1);
      showToast('Data berhasil di-reset ke kondisi awal.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleOpenInputSetoran = (nis?: string, aktivitas?: JenisAktivitasMengaji) => {
    setPreselectedNis(nis);
    setDefaultAktivitas(aktivitas || 'tahfizh');
    setIsInputSetoranOpen(true);
  };

  const handleSelectSantriDetail = (nis: string) => {
    setSelectedNisForDetail(nis);
    setActiveTab('progres');
  };

  // If user is not logged in:
  if (!session) {
    if (showLoginScreen) {
      return (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={() => setShowLoginScreen(false)}
        />
      );
    }
    return (
      <PublicPortalView
        key={`portal-public-${dataVersion}`}
        onOpenLogin={() => setShowLoginScreen(true)}
        session={null}
      />
    );
  }

  // If logged in user chooses to view the Public Portal:
  if (viewingPublicPortal) {
    return (
      <div className="relative">
        {/* Floating Bar to Return to Dashboard */}
        <div className="sticky top-0 z-50 bg-emerald-950 text-white px-4 py-2 text-xs flex items-center justify-between shadow-md border-b border-emerald-800">
          <span className="font-semibold text-emerald-200 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Mode Pratinjau Publik (Sebagai: {session.nama} [{session.role.toUpperCase()}])
          </span>
          <button
            onClick={() => setViewingPublicPortal(false)}
            id="btn-return-from-public-preview"
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
          >
            ← Kembali ke Dashboard Aplikasi
          </button>
        </div>
        <PublicPortalView
          key={`portal-preview-${dataVersion}`}
          session={session}
          onOpenLogin={() => setViewingPublicPortal(false)}
          onGoToDashboard={() => setViewingPublicPortal(false)}
        />
      </div>
    );
  }

  const dashboardData = getDashboardData(session);
  const currentSettings = getAppSettings();

    // Navigation Items
    const navItems = [
      { id: 'dashboard', label: 'Beranda', icon: BookOpen },
      ...(session.role !== 'santri'
        ? [
            { id: 'santri_list', label: 'Daftar Santri', icon: Users },
            { id: 'form_manual', label: 'Form Cetak', icon: Printer },
            { id: 'infak', label: 'Infak & SPP', icon: Wallet },
            { id: 'progres', label: 'Progres Santri', icon: UserCheck },
            { id: 'riwayat', label: 'Jurnal Setoran', icon: History },
            { id: 'laporan', label: 'Laporan & Ekspor', icon: FileSpreadsheet },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ]
        : [
            { id: 'progres', label: 'Progres Saya', icon: UserCheck },
            { id: 'riwayat', label: 'Riwayat Setoran', icon: History },
            { id: 'infak', label: 'Riwayat Infak', icon: Wallet }
          ]),
      ...(session.role === 'admin'
        ? [
            { id: 'kelas', label: 'Manajemen Kelas', icon: Layers },
            { id: 'users', label: 'Manajemen User', icon: UserSquare2 },
            { id: 'pengaturan', label: 'Pengaturan', icon: SettingsIcon }
          ]
        : [])
    ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        session={session}
        onLogout={handleLogout}
        onChangePasswordClick={() => setIsChangePassOpen(true)}
        onResetDataClick={handleResetData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInputSetoran={session.role !== 'santri' ? handleOpenInputSetoran : undefined}
        onOpenPublicPortal={() => setViewingPublicPortal(true)}
        navItems={navItems}
      />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Navigation Tabs Bar (Desktop / Tablet) */}
        <div className="hidden md:flex bg-white rounded-2xl p-1.5 shadow-xs border border-gray-200/80 mb-6 overflow-x-auto items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {session.role !== 'santri' && (
            <div className="ml-auto pl-2 hidden sm:flex items-center gap-1.5">
              <button
                id="btn-header-input-iqro"
                onClick={() => handleOpenInputSetoran(undefined, 'iqro')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="Simak Iqro' & Jilid Santri"
              >
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Simak Iqro'</span>
              </button>
              <button
                id="btn-header-input-setoran"
                onClick={() => handleOpenInputSetoran(undefined, 'tahfizh')}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="Catat Setoran Hafalan Qur'an"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>+ Catat Setoran</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="mb-4 p-3.5 bg-emerald-800 text-white text-xs rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage('')}
              className="text-white/80 hover:text-white text-xs px-2 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab View Content */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              key={`dash-${dataVersion}`}
              session={session}
              dashboard={dashboardData}
              onOpenInputSetoran={handleOpenInputSetoran}
              onNavigateTab={setActiveTab}
              onSelectSantriDetail={handleSelectSantriDetail}
            />
          )}

          {activeTab === 'santri_list' && session.role !== 'santri' && (
            <DaftarSantriView
              key={`snt-${dataVersion}`}
              session={session}
              onOpenSetoran={(nis) => handleOpenInputSetoran(nis, 'tahfizh')}
              onSelectSantriDetail={handleSelectSantriDetail}
            />
          )}

          {activeTab === 'form_manual' && session.role !== 'santri' && (
            <CetakFormManualView key={`frm-${dataVersion}`} session={session} />
          )}

          {activeTab === 'infak' && (
            <InfakView key={`inf-${dataVersion}`} session={session} />
          )}

          {activeTab === 'leaderboard' && session.role !== 'santri' && (
            <LeaderboardView
              key={`lead-${dataVersion}`}
              session={session}
              onOpenInputSetoran={handleOpenInputSetoran}
              onSelectSantriDetail={handleSelectSantriDetail}
            />
          )}

          {activeTab === 'progres' && (
            <ProgressSantriView
              key={`prog-${dataVersion}`}
              session={session}
              onOpenInputSetoran={handleOpenInputSetoran}
              selectedNisDetail={selectedNisForDetail}
              onClearSelectedNisDetail={() => setSelectedNisForDetail(null)}
            />
          )}

          {activeTab === 'riwayat' && (
            <RiwayatSetoranView
              key={`riw-${dataVersion}`}
              session={session}
              onOpenInputSetoran={() => handleOpenInputSetoran()}
              onDataChanged={() => setDataVersion((v) => v + 1)}
            />
          )}

          {activeTab === 'kelas' && session.role === 'admin' && (
            <ManajemenKelasView
              key={`kls-${dataVersion}`}
              session={session}
              onDataChanged={() => setDataVersion((v) => v + 1)}
            />
          )}

          {activeTab === 'users' && session.role === 'admin' && (
            <ManajemenUserView
              key={`usr-${dataVersion}`}
              session={session}
              onDataChanged={() => setDataVersion((v) => v + 1)}
            />
          )}

          {activeTab === 'pengaturan' && session.role === 'admin' && (
            <PengaturanView
              session={session}
              onDataChanged={() => setDataVersion((v) => v + 1)}
            />
          )}

          {activeTab === 'laporan' && session.role !== 'santri' && (
            <LaporanView key={`lap-${dataVersion}`} session={session} />
          )}
        </main>

        {/* Footer */}
        {currentSettings.tampilkan_dashboard_footer !== false && (
          <footer className="mt-12 py-4 border-t border-gray-200 text-center text-xs text-gray-500 print:hidden space-y-1">
            <p className="flex items-center justify-center gap-1 flex-wrap px-4">
              {currentSettings.dashboard_footer_mode === 'custom' && currentSettings.dashboard_footer_baris1 ? (
                <span>{currentSettings.dashboard_footer_baris1}</span>
              ) : (
                <>
                  <span className="font-semibold text-emerald-800">
                    {currentSettings.navbar_header_text || currentSettings.nama_aplikasi || 'Shibyanulilmi'}
                  </span>{' '}
                  — {currentSettings.navbar_tagline_text || currentSettings.tagline || "Sistem Monitoring & Setoran Tahfizh Qur'an"}{' '}
                  {currentSettings.nama_lembaga ? `(${currentSettings.nama_lembaga})` : ''}
                </>
              )}
            </p>
            {currentSettings.tampilkan_footer_poin !== false && (
              <p className="text-[11px] text-gray-400 px-4">
                {currentSettings.dashboard_footer_mode === 'custom' && currentSettings.dashboard_footer_baris2 ? (
                  currentSettings.dashboard_footer_baris2
                ) : (
                  `Sistem Poin: Nilai A=${currentSettings.poin_nilai_a}, B=${currentSettings.poin_nilai_b}, C=${currentSettings.poin_nilai_c} | Lancar=+${currentSettings.bonus_lancar}, Perlu Perbaikan=-${currentSettings.penalti_perbaikan} | Bonus Waktu Pagi=+${currentSettings.bonus_waktu_pagi} Poin`
                )}
              </p>
            )}
          </footer>
        )}
      </div>

      {/* ──────────────── MODALS ──────────────── */}
      {session.role !== 'santri' && (
        <InputSetoranModal
          session={session}
          isOpen={isInputSetoranOpen}
          onClose={() => {
            setIsInputSetoranOpen(false);
            setPreselectedNis(undefined);
          }}
          preselectedNis={preselectedNis}
          defaultAktivitas={defaultAktivitas}
          onSuccess={(msg) => {
            setDataVersion((v) => v + 1);
            showToast(msg);
          }}
        />
      )}

      <GantiPasswordModal
        session={session}
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
      />
    </div>
  );
}

