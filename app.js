/**
 * E-PORTOFOLIO INTERAKTIF SEMINAR PPG CALON GURU 2026
 * Mahasiswa : Syahla Ayu Yasinta, S.Pd.
 * Program   : PPG Calon Guru Gelombang 1 Tahun 2026
 * Prodi     : Pendidikan Bahasa dan Sastra Indonesia, Universitas Muhammadiyah Purwokerto
 * Sekolah   : SMP Negeri 5 Purwokerto
 */

document.addEventListener('DOMContentLoaded', () => {
  // Daftar Urutan Bagian / Sections (7 Bagian Ringkas & Terpadu)
  const sections = [
    { id: 'cover', title: 'Cover' },
    { id: 'menu', title: 'Menu' },
    { id: 'profil', title: 'Profil & Mitra' },
    { id: 'topik3', title: 'Topik 3' },
    { id: 'uts', title: 'UTS' },
    { id: 'uas', title: 'UAS' },
    { id: 'sintesis', title: 'Sintesis & Penutup' }
  ];

  let currentSectionIndex = 0;

  // DOM Elements
  const sectionElements = document.querySelectorAll('.portfolio-section');
  const navPillButtons = document.querySelectorAll('.nav-pill-btn');
  const progressBar = document.getElementById('portfolioProgressBar');
  const btnPrev = document.getElementById('btnNavPrev');
  const btnNext = document.getElementById('btnNavNext');
  const stepIndicator = document.getElementById('navStepIndicator');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalFrame = document.getElementById('modalFrame');
  const modalTitle = document.getElementById('modalTitle');
  const modalExternalBtn = document.getElementById('modalExternalBtn');

  // ===================================================================
  // 1. NAVIGASI BAGIAN (SECTION SWITCHER)
  // ===================================================================
  function goToSection(indexOrId, updateHash = true) {
    let targetIndex = 0;

    if (typeof indexOrId === 'number') {
      targetIndex = Math.max(0, Math.min(sections.length - 1, indexOrId));
    } else if (typeof indexOrId === 'string') {
      const cleanId = indexOrId.replace('#', '');
      const foundIdx = sections.findIndex(s => s.id === cleanId);
      if (foundIdx !== -1) {
        targetIndex = foundIdx;
      }
    }

    currentSectionIndex = targetIndex;
    const targetSection = sections[targetIndex];

    // Update Tampilan Bagian (Hanya 1 bagian yang aktif!)
    sectionElements.forEach(sec => {
      if (sec.id === targetSection.id) {
        sec.classList.add('active-section');
      } else {
        sec.classList.remove('active-section');
      }
    });

    // Update Nav Pills di Header
    navPillButtons.forEach(btn => {
      const target = btn.getAttribute('data-target');
      if (target === targetSection.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Progress Bar
    if (progressBar) {
      const progressPercent = ((targetIndex + 1) / sections.length) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update Bottom Dock Navigator (Tanpa nomor 1/8 sesuai instruksi)
    if (stepIndicator) {
      stepIndicator.innerHTML = `<span>${targetSection.title}</span>`;
    }

    if (btnPrev) {
      btnPrev.disabled = targetIndex === 0;
    }
    if (btnNext) {
      btnNext.disabled = targetIndex === sections.length - 1;
      if (targetIndex === sections.length - 1) {
        btnNext.innerHTML = `Selesai <i class="fas fa-check"></i>`;
      } else {
        btnNext.innerHTML = `Selanjutnya <i class="fas fa-arrow-right"></i>`;
      }
    }

    // Scroll ke atas dengan halus
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash jika diminta
    if (updateHash) {
      history.pushState(null, null, `#${targetSection.id}`);
    }
  }

  // Event Listener Nav Pills
  navPillButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      goToSection(targetId);
    });
  });

  // Event Listener Tombol Prev & Next
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentSectionIndex > 0) {
        goToSection(currentSectionIndex - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentSectionIndex < sections.length - 1) {
        goToSection(currentSectionIndex + 1);
      }
    });
  }

  // Tautan Cepat / Kartu Dashboard di Menu Utama
  document.querySelectorAll('[data-jump-to]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = el.getAttribute('data-jump-to');
      const subtab = el.getAttribute('data-subtab');
      goToSection(targetId);

      // Jika ada subtab khusus (misal topik3 modul ajar)
      if (subtab) {
        setTimeout(() => {
          activateSubTab(targetId, subtab);
        }, 150);
      }
    });
  });

  // Handle URL Hash awal saat dimuat
  if (window.location.hash) {
    goToSection(window.location.hash, false);
  } else {
    goToSection(0, false);
  }

  // Listen back/forward browser history
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      goToSection(window.location.hash, false);
    } else {
      goToSection(0, false);
    }
  });

  // ===================================================================
  // 2. SUB-TAB ARTEFAK DI TOPIK 3, UTS, UAS
  // ===================================================================
  function activateSubTab(sectionId, subtabId) {
    const sectionEl = document.getElementById(sectionId);
    if (!sectionEl) return;

    const tabs = sectionEl.querySelectorAll('.subnav-btn');
    const panels = sectionEl.querySelectorAll('.artefact-panel');

    tabs.forEach(tab => {
      if (tab.getAttribute('data-panel') === subtabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    panels.forEach(panel => {
      if (panel.id === subtabId) {
        panel.classList.add('active-panel');
      } else {
        panel.classList.remove('active-panel');
      }
    });
  }

  document.querySelectorAll('.subnav-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const parentSection = tabBtn.closest('.portfolio-section');
      const targetPanelId = tabBtn.getAttribute('data-panel');

      if (parentSection && targetPanelId) {
        activateSubTab(parentSection.id, targetPanelId);
      }
    });
  });

  // ===================================================================
  // 3. MODAL VIEWER UNTUK EMBED DOKUMEN & VIDEO
  // ===================================================================
  window.openEmbedModal = function(url, title, directLink) {
    if (!modalOverlay || !modalFrame) return;

    modalTitle.textContent = title || 'Pratinjau Dokumen Artefak';
    modalFrame.src = url;
    
    if (modalExternalBtn) {
      modalExternalBtn.href = directLink || url;
    }

    modalOverlay.classList.add('active-modal');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    if (!modalOverlay || !modalFrame) return;
    modalOverlay.classList.remove('active-modal');
    modalFrame.src = '';
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Tautan Copy Link dengan Feedback Tooltip
  window.copyLinkToClipboard = function(url, btnElement) {
    navigator.clipboard.writeText(url).then(() => {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = `<i class="fas fa-check" style="color:#2F7A50;"></i> Tautan Tersalin!`;
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
      }, 2000);
    }).catch(err => {
      console.error('Gagal menyalin tautan:', err);
      alert('Tautan: ' + url);
    });
  };

  // ===================================================================
  // 4. THEME TOGGLE (NORMAL IVORY, SEPIA, DARK NIGHT)
  // ===================================================================
  const themes = ['default', 'theme-sepia', 'theme-dark'];
  let currentThemeIdx = 0;

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.remove('theme-sepia', 'theme-dark');
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const nextTheme = themes[currentThemeIdx];

      if (nextTheme !== 'default') {
        document.body.classList.add(nextTheme);
      }

      // Update icon
      if (nextTheme === 'theme-dark') {
        themeToggleBtn.innerHTML = `<i class="fas fa-moon"></i>`;
        themeToggleBtn.title = "Mode Gelap Aktif (Klik untuk Mode Terang)";
      } else if (nextTheme === 'theme-sepia') {
        themeToggleBtn.innerHTML = `<i class="fas fa-book-open"></i>`;
        themeToggleBtn.title = "Mode Buku Sepia Aktif";
      } else {
        themeToggleBtn.innerHTML = `<i class="fas fa-sun"></i>`;
        themeToggleBtn.title = "Mode Terang Aktif";
      }
    });
  }

  // ===================================================================
  // 5. PENCARIAN CEPAT KATA KUNCI ARTEFAK & KAJIAN TEORI
  // ===================================================================
  const searchIndexData = [
    { section: 'topik3', subtab: 't3-modul', title: 'Topik 3 — Modul Ajar: Menyimpulkan Isi Teks Deskripsi (Sroto Sokaraja)', tags: 'RPP modul ajar teks deskripsi Sroto Sokaraja PBL problem based learning vygotsky ZPD scaffolding tomlinson diferensiasi kelas VII banyumas' },
    { section: 'topik3', subtab: 't3-lkpd', title: 'Topik 3 — Analisis LKPD: Teks Deskripsi Sroto Sokaraja', tags: 'LKPD lembar kerja taksonomi bloom anderson krathwohl C2 C6 cooperative learning johnson literasi membaca' },
    { section: 'topik3', subtab: 't3-media', title: 'Topik 3 — Media Pembelajaran PPT Sroto Sokaraja', tags: 'PPT presentasi multimedia mayer cognitive load sweller advance organizer ausubel banyumas' },
    { section: 'topik3', subtab: 't3-video', title: 'Topik 3 — Video Pelaksanaan Praktik Mengajar (YouTube)', tags: 'video youtube rekaman praktik topik 3 teks deskripsi Sroto Sokaraja SMPN 5 purwokerto mengajar kelas VII' },
    { section: 'topik3', subtab: 't3-nonajar', title: 'Topik 3 — Kegiatan Non-Mengajar: Ekstrakurikuler Kreativo', tags: 'kegiatan non mengajar ekstrakurikuler kreativo konten edukasi peliputan video rabu SMPN 5 purwokerto' },
    { section: 'topik3', subtab: 't3-pamong', title: 'Topik 3 — Penilaian Guru Pamong (Perangkat & Praktik)', tags: 'penilaian guru pamong evaluasi perangkat praktik mandiri' },
    { section: 'uts', subtab: 'uts-modul', title: 'UTS — Modul Ajar & Jurnal CERITA (Menyunting Teks Deskripsi)', tags: 'UTS menyempurnakan menyunting teks deskripsi jurnal cerita kartu editor teman deep learning mindful meaningful joyful' },
    { section: 'uts', subtab: 'uts-lkpd', title: 'UTS — LKPD Kelompok & Teks Final Mandiri', tags: 'LKPD menyunting tanda baca ejaan diksi process writing approach collaborative learning formatif feedback' },
    { section: 'uts', subtab: 'uts-media', title: 'UTS — PPT Media Interaktif Before & After', tags: 'PPT media interaktif sebelum sesudah perbaikan kalimat scaffolding process writing mayer' },
    { section: 'uts', subtab: 'uts-video', title: 'UTS — Video Pelaksanaan Praktik Mengajar (YouTube)', tags: 'video youtube rekaman praktik SMPN 5 purwokerto mengajar kelas VII' },
    { section: 'uts', subtab: 'uts-pamong', title: 'UTS — Penilaian Guru Pamong (Perangkat & Praktik Mengajar)', tags: 'penilaian guru pamong evaluasi perangkat pembelajaran praktik mengajar tatap muka siklus 1' },
    { section: 'uas', subtab: 'uas-modul', title: 'UAS — Modul Ajar: Menyimak Cerita Fantasi & Menemukan Amanat', tags: 'UAS cerita fantasi menyimak pesan amanat kartu peran LKM cooperative learning mayer' },
    { section: 'uas', subtab: 'uas-lkpd', title: 'UAS — LKPD Menangkap Pesan & Bukti Peristiwa', tags: 'LKPD menyimak cerita fantasi bukti peristiwa taksonomi bloom constructive alignment biggs' },
    { section: 'uas', subtab: 'uas-media', title: 'UAS — PPT Interaktif Fantasi: Rara & Bola-Bola Waktu', tags: 'PPT multimedia mayer cerita fantasi rara selendang ajaib bola-bola waktu TPACK sweller video audio' },
    { section: 'uas', subtab: 'uas-video', title: 'UAS — Video Praktik Mengajar (Google Drive)', tags: 'video praktik mengajar gdrive google drive menyimak fantasi' },
    { section: 'uas', subtab: 'uas-pamong', title: 'UAS — Penilaian Guru Pamong', tags: 'penilaian guru pamong perangkat praktik' },
    { section: 'sintesis', subtab: '', title: 'Sintesis Transformatif & Penutup Portofolio', tags: 'sintesis penutup transformatif filosofi mengajar ki hajar dewantara model guru ideal kekuatan kelemahan tindak lanjut RTL CPD terima kasih quote sastra kontak' },
    { section: 'profil', subtab: '', title: 'Profil Syahla Ayu Yasinta, S.Pd. & SMP Negeri 5 Purwokerto', tags: 'profil syahla ayu yasinta riwayat pendidikan komitmen visi SMPN 5 purwokerto kearifan lokal banyumas cablaka' }
  ];

  if (searchBtn && searchModal && searchInput && searchResults) {
    searchBtn.addEventListener('click', () => {
      searchModal.classList.add('active-modal');
      searchInput.value = '';
      renderSearchResults('');
      setTimeout(() => searchInput.focus(), 100);
    });

    document.getElementById('searchModalClose').addEventListener('click', () => {
      searchModal.classList.remove('active-modal');
    });

    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim().toLowerCase());
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;

    if (!query) {
      searchResults.innerHTML = `
        <div style="padding:1.5rem; text-align:center; color:var(--neutral-muted); font-size:0.88rem;">
          <i class="fas fa-search" style="font-size:1.8rem; margin-bottom:0.75rem; opacity:0.4;"></i>
          <p>Ketik kata kunci untuk mencari artefak, teori (PBL, Vygotsky, Mayer, Bloom, TPACK), atau materi.</p>
        </div>
      `;
      return;
    }

    const filtered = searchIndexData.filter(item => {
      return item.title.toLowerCase().includes(query) || item.tags.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div style="padding:1.5rem; text-align:center; color:var(--neutral-muted); font-size:0.88rem;">
          <p>Tidak ditemukan artefak untuk kata kunci "<strong>${query}</strong>". Coba kata kunci seperti <em>PBL, LKPD, Fantasi, Video,</em> atau <em>Teori</em>.</p>
        </div>
      `;
      return;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:0.65rem; padding:0.5rem 0;">';
    filtered.forEach(item => {
      html += `
        <div class="search-result-row" data-sec="${item.section}" data-sub="${item.subtab}" style="padding:0.85rem 1.15rem; background:rgba(245,240,230,0.5); border-radius:8px; border:1px solid var(--neutral-border); cursor:pointer; display:flex; align-items:center; justify-content:space-between; transition:all 0.2s;">
          <div>
            <h5 style="font-size:0.92rem; color:var(--primary); margin-bottom:0.25rem;">${item.title}</h5>
            <span style="font-size:0.75rem; color:var(--accent-terracotta); text-transform:uppercase; font-weight:600;">Bagian: ${item.section.toUpperCase()}</span>
          </div>
          <i class="fas fa-chevron-right" style="color:var(--primary); font-size:0.8rem;"></i>
        </div>
      `;
    });
    html += '</div>';

    searchResults.innerHTML = html;

    searchResults.querySelectorAll('.search-result-row').forEach(row => {
      row.addEventListener('click', () => {
        const sec = row.getAttribute('data-sec');
        const sub = row.getAttribute('data-sub');
        searchModal.classList.remove('active-modal');
        goToSection(sec);
        if (sub) {
          setTimeout(() => activateSubTab(sec, sub), 200);
        }
      });
    });
  }

  // ===================================================================
  // 6. SHORTCUT KEYBOARD (1-8 untuk lompat bagian, ESC untuk tutup modal)
  // ===================================================================
  document.addEventListener('keydown', (e) => {
    // Abaikan jika user sedang mengetik di input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active-modal')) {
        searchModal.classList.remove('active-modal');
      }
      return;
    }

    if (e.key === 'Escape') {
      closeModal();
      if (searchModal) searchModal.classList.remove('active-modal');
      return;
    }

    // Navigasi Panah Kiri & Kanan
    if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
      if (currentSectionIndex < sections.length - 1) {
        goToSection(currentSectionIndex + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
      if (currentSectionIndex > 0) {
        goToSection(currentSectionIndex - 1);
      }
    }

    // Tombol Angka 1 s.d. 8
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 8) {
      goToSection(num - 1);
    }
  });

  // Mobile Menu Drawer Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      goToSection('menu');
    });
  }
});
