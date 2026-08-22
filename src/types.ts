export type UserRole = 'admin' | 'guru' | 'santri';

export type JenisAktivitasMengaji = 'tahfizh' | 'iqro' | 'tajwid' | 'tadarus';

export type TingkatBacaan =
  | 'Mubtadi\''
  | 'Iqra\''
  | 'Qira\'ah'
  | 'Tajwid'
  | 'Taḥsin'
  | 'Taḥfiẓ'
  | 'Mutaqaddim'
  | 'Iqro 1'
  | 'Iqro 2'
  | 'Iqro 3'
  | 'Iqro 4'
  | 'Iqro 5'
  | 'Iqro 6'
  | 'Al-Qur\'an Binnazhar'
  | 'Tahsin Al-Qur\'an'
  | 'Tahfizh Al-Qur\'an';

export type StatusPenguasaanTajwid = 'belum' | 'sedang_dipelajari' | 'dikuasai';

export interface TajwidProgressItem {
  id: string;
  nama: string;
  kategori: string;
  status: StatusPenguasaanTajwid;
  tanggal_dinilai?: string;
  catatan?: string;
}

export interface User {
  id: string;
  nama: string;
  nip_nis: string; // NIP for admin/guru, NIS for santri
  password?: string;
  role: UserRole;
  kelas: string; // e.g. '7A,7B' or '7A' or '-'
}

export type StatusSantri = 'Aktif' | 'Nonaktif' | 'Non-Aktif' | 'Cuti' | 'Alumni' | 'Lulus' | 'Pindah';
export type JenisKelamin = 'L' | 'P' | 'Laki-laki' | 'Perempuan';

export interface Santri {
  nis: string;
  nama: string;
  kelas: string;
  target_juz: number;
  total_poin: number;
  poin_simak?: number;
  poin_hafalan?: number;
  badge: string;
  // Extended Mengaji fields
  tingkat_bacaan?: TingkatBacaan;
  halaman_bacaan?: string; // e.g. "Hal. 18" or "Juz 2 Hal 25"
  materi_tajwid_aktif?: string; // e.g. "Nun Sukun: Ikhfa Haqiqi"
  penguasaan_tajwid?: Record<string, StatusPenguasaanTajwid>; // topic_id -> status
  // Extended Profile & Status Santri
  status_santri?: StatusSantri;
  jenis_kelamin?: JenisKelamin;
  nama_wali?: string;
  no_hp_wali?: string;
  alamat?: string;
  tanggal_masuk?: string;
  keterangan?: string;
}

export type NilaiSetoran = 'A' | 'B' | 'C';
export type StatusSetoran = 'Lancar' | 'Cukup' | 'Perlu Perbaikan';

export interface Setoran {
  id_setoran: string;
  tanggal: string; // YYYY-MM-DD
  waktu: string;   // HH:mm
  nis: string;
  nama: string;
  kelas: string;
  // Activity classification
  jenis_aktivitas?: JenisAktivitasMengaji; // default: 'tahfizh'
  // Detail for Tahfizh / Tadarus
  juz?: number;
  surat?: string;
  ayat_dari?: number;
  ayat_sampai?: number;
  // Detail for Iqro'
  jilid_iqro?: number; // 1-6
  halaman_iqro?: number; // 1-32
  status_kenaikan?: 'Naik Halaman' | 'Ulang Halaman' | 'Naik Jilid' | 'Tetap';
  // Detail for Tajwid
  materi_tajwid?: string;
  kategori_tajwid?: string;
  // Common evaluation
  nilai: NilaiSetoran;
  status: StatusSetoran;
  poin: number;
  catatan: string;
  guru_pengoreksi: string;
}

export interface Kelas {
  id: string;
  nama_kelas: string;
}

export interface LeaderboardEntry {
  nis: string;
  nama: string;
  kelas: string;
  total_poin: number;
  poin_simak?: number;
  poin_hafalan?: number;
  ranking_kelas: number;
  ranking_global: number;
  ranking_tingkat?: number;
  badge: string;
  jumlah_setoran?: number;
  tingkat_bacaan?: TingkatBacaan;
  halaman_bacaan?: string;
  materi_tajwid_aktif?: string;
}

export interface SantriProgress extends Santri {
  poin_simak?: number;
  poin_hafalan?: number;
  setoran: {
    id_setoran?: string;
    tanggal: string;
    waktu?: string;
    jenis_aktivitas?: JenisAktivitasMengaji;
    juz?: number;
    surat?: string;
    ayat?: string;
    jilid_iqro?: number;
    halaman_iqro?: number;
    materi_tajwid?: string;
    status_kenaikan?: string;
    nilai: NilaiSetoran;
    status: StatusSetoran;
    poin: number;
    guru: string;
    catatan?: string;
  }[];
  jumlah_setoran: number;
  last_setoran: string;
  tajwid_dikuasai_count?: number;
  total_tajwid_count?: number;
}

export interface Session {
  token: string;
  username: string; // NIP or NIS
  role: UserRole;
  nama: string;
  kelas: string;
  nis?: string;
}

export interface SurahInfo {
  number: number;
  name: string;
  latinName: string;
  ayatCount: number;
  juz: number;
}

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string; // 'beranda' | 'profil' | 'galeri' | 'prestasi' | 'cek_santri' or external URL e.g. https://...
  is_external?: boolean;
  is_active?: boolean;
}

export interface AppSettings {
  // 1. Identitas Aplikasi & Lembaga
  nama_aplikasi: string;
  tagline: string;
  edisi_label: string;
  nama_lembaga: string;
  alamat_lembaga: string;
  telepon_lembaga: string;
  nama_kepala: string;
  nip_kepala: string;
  kota_cetak: string;
  
  // Custom Logo & Preset
  logo_url?: string; // Base64 data URL or external URL
  logo_preset?: 'quran' | 'masjid' | 'bintang' | 'kitab' | 'lentera';
  
  // Portal Publik Customization
  hero_badge?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  sambutan_kepala?: string;
  foto_kepala_url?: string;

  // Header Navbar Customization
  navbar_header_text?: string;
  navbar_tagline_text?: string;
  navbar_edisi_badge?: string;
  navbar_running_text?: string;
  navbar_tampilkan_running_text?: boolean;

  // Footer Menu & Tampilan Footer Publik
  footer_deskripsi?: string;
  footer_kolom_nav_title?: string;
  footer_links?: FooterLinkItem[];
  footer_kolom_info_title?: string;
  footer_kolom_info_desc?: string;
  footer_tombol_masuk_label?: string;
  footer_tampilkan_tombol_masuk?: boolean;
  footer_copyright?: string;
  footer_pembina?: string;
  footer_sosial_wa?: string;
  footer_sosial_ig?: string;
  footer_sosial_fb?: string;
  footer_sosial_yt?: string;
  footer_maps_url?: string;

  // Dashboard / App Bottom Footer Customization (Baris 1 & Baris 2)
  dashboard_footer_baris1?: string;
  dashboard_footer_baris2?: string;
  dashboard_footer_mode?: 'auto' | 'custom';
  tampilkan_dashboard_footer?: boolean;

  // 2. Sistem Poin & Evaluasi
  poin_nilai_a: number;
  poin_nilai_b: number;
  poin_nilai_c: number;
  bonus_lancar: number;
  penalti_perbaikan: number;
  bonus_waktu_pagi: number;

  // 3. Ambang Batas & Nama Badge
  badge_bintang_min: number;
  badge_bintang_label: string;
  badge_teladan_min: number;
  badge_teladan_label: string;
  badge_berkembang_min: number;
  badge_berkembang_label: string;
  badge_pemula_min: number;
  badge_pemula_label: string;
  badge_dasar_label: string;

  // 4. Preferensi Tampilan & Cetak
  tampilkan_footer_poin: boolean;
  format_tanggal: 'masehi' | 'hijriah' | 'keduanya';
  header_cetak_logo: boolean;

  // 5. Tanda Tangan & Cap Stempel Resmi Dokumen
  tanda_tangan_kepala_url?: string;
  tanda_tangan_bendahara_url?: string;
  cap_lembaga_url?: string;
  cap_lembaga_preset?: 'shibyanulilmi_hijau' | 'shibyanulilmi_biru' | 'shibyanulilmi_ungu' | 'lunas_infak' | 'kustom';
  nama_bendahara?: string;
  nip_bendahara?: string;
  tampilkan_ttd_dokumen?: boolean;
  tampilkan_cap_lembaga?: boolean;
  tampilkan_ttd_kuitansi?: boolean;
  tampilkan_cap_kuitansi?: boolean;
  tampilkan_ttd_raport?: boolean;
  tampilkan_cap_raport?: boolean;
}

export interface GaleriItem {
  id: string;
  judul: string;
  kategori: 'Kegiatan Mengaji' | 'Setoran & Ujian' | 'Wisuda & Prestasi' | 'Kajian & Doa' | 'Fasilitas & Suasana' | 'Lainnya';
  tanggal: string;
  deskripsi: string;
  imageUrl: string;
  lokasi?: string;
}

export interface PengajarItem {
  id: string;
  nama: string;
  peran: string;
  spesialisasi?: string;
  fotoUrl?: string;
}

export interface ProfilLembagaInfo {
  nama_resmi: string;
  sejarah_singkat: string;
  visi: string;
  misi: string[];
  jadwal_kegiatan: string;
  program_unggulan: {
    nama: string;
    deskripsi: string;
    target: string;
  }[];
  fasilitas: string[];
  pengajar: PengajarItem[];
  alamat_lengkap: string;
  whatsapp: string;
  email: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  google_maps_url?: string;
}

export type KategoriInfak =
  | 'SPP / Infak Bulanan'
  | 'Infak Pembangunan'
  | 'Infak Pendaftaran / Awal Masuk'
  | 'Kas Halaqah'
  | 'Infak PHBI & Kegiatan'
  | 'Sedekah / Infak Sukarela';

export type MetodePembayaranInfak = 'Tunai' | 'Transfer Bank' | 'QRIS';

export interface TransaksiInfak {
  id_infak: string;
  nomor_kuitansi: string;
  tanggal: string; // YYYY-MM-DD
  nis: string;
  nama: string;
  kelas: string;
  kategori_infak: KategoriInfak;
  periode_bulan?: string; // e.g. "Agustus 2026"
  nominal: number;
  metode_pembayaran: MetodePembayaranInfak;
  penerima: string;
  keterangan?: string;
  status: 'Lunas' | 'Pending';
  created_at?: string;
}

