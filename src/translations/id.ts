const id = {
  menu: {
    home: 'Beranda',
    about: 'Tentang',
    achievements: 'Prestasi',
    projects: 'Proyek',
    dashboard: 'Dasbor',
    chatRoom: 'Obrolan Langsung',
    contact: 'Kontak'
  },
  hero: {
    title: 'Ryan Radityatama',
    taglines: {
      aiEngineer: 'Machine Learning Engineer',
      nlpSpecialist: 'Spesialis NLP',
      softwareEngineer: 'Fullstack Developer'
    },
    description: 'Membangun solusi cerdas yang menjembatani kesenjangan antara data dan dampak dunia nyata. Mengeksplorasi perbatasan Machine Learning dan Deep Learning.',
    skills: 'Keahlian Saya',
    aboutDescription: 'Software & AI Engineer. Temukan latar belakang, keahlian, dan pengalaman saya.',
    projectsDescription: 'Jelajahi portofolio proyek AI, Web, dan Mobile saya.',
    chatDescription: 'Ruang obrolan untuk berekspresi dan berbagi lebih banyak.',
    contactDescription: 'Hubungi saya untuk kolaborasi.',
    viewProjects: 'Lihat proyek',
    startChat: 'Mulai obrolan',
    contactMe: 'Hubungi saya',
    learnMore: 'Pelajari lebih lanjut'
  },
  about: {
    title: 'Tentang Saya',
    role: 'Hai! Saya mengkombinasikan AI dengan solusi perangkat lunak yang berpusat pada manusia',
    paragraphs: [
      'Saya adalah Insinyur Perangkat Lunak AI dengan keahlian dalam integrasi AI, pengembangan perangkat lunak, dan optimasi sistem. Saya ahli dalam mengembangkan solusi perangkat lunak inovatif menggunakan React dan Node, dengan latar belakang yang kuat dalam mengintegrasikan model AI untuk meningkatkan fungsionalitas.',
      'Mahir dalam menggunakan alat seperti TensorFlow, PyTorch, dan OpenCV, saya memiliki pengalaman dalam pengembangan frontend dan backend. Saya memegang gelar Master dalam Ilmu Komputer dari Beijing Institute of Technology, dengan fokus penelitian pada LLM Indonesia untuk aplikasi kesehatan mental.',
      'Saya mahir dalam memimpin proyek pengembangan perangkat lunak, meningkatkan kinerja sistem, dan mendorong inovasi berkelanjutan.'
    ],
    downloadCV: 'Unduh CV',
    professionalExperience: 'Pengalaman Profesional',
    education: 'Pendidikan',
    careerHistory: [
      {
        title: 'WEBSITE SUCCESS ASSOCIATE',
        company: 'DreamHost',
        location: 'Brea, California, Amerika Serikat',
        period: 'Des 2025 – Sekarang',
        companyLogo: '/dreamhost logo.png',
        responsibilities: [
          'Merancang dan meluncurkan website yang responsif dan berfokus pada pengguna, mengelola pengembangan ujung-ke-ujung dari konsep, perencanaan, dan desain hingga pengujian, penerapan, dan dukungan pasca-peluncuran.',
          'Memberi saran kepada klien tentang pendekatan pengembangan yang sesuai, menyesuaikan website dengan kebutuhan bisnis, mengintegrasikan API dan layanan backend, serta memberikan solusi digital yang dapat diskalakan dan berkinerja tinggi.',
          'Meningkatkan kinerja dan keandalan website melalui caching, integrasi CDN, lazy loading, pengoptimalan gambar, praktik terbaik SEO, ditambah konfigurasi DNS, pengaturan SSL, dan penerapan hosting.',
          'Berkolaborasi dengan tim lintas fungsi untuk menyelesaikan masalah teknis, menyederhanakan alur kerja pelanggan, dan mendidik pengguna melalui dokumentasi, sumber daya yang dapat digunakan kembali, dan praktik terbaik pengembangan website modern.'
        ]
      },
      {
        title: 'MACHINE LEARNING ENGINEER',
        company: 'AME Research',
        location: 'Jakarta, Indonesia',
        period: 'Nov 2025 – Des 2025',
        companyLogo: '/ame_research_logo.jpg',
        responsibilities: [
          'Mengembangkan skrip scraping dan parsing khusus untuk mengekstrak dan menyusun kumpulan data penting dari PDF terstruktur yang tidak standar untuk Industri Pertambangan.',
          'Meningkatkan arsitektur perkiraan dengan menerapkan algoritme AI tingkat lanjut, meningkatkan efisiensi sistem, dan mengurangi overhead komputasi.',
          'Menerapkan model analisis sentimen yang disesuaikan dengan terminologi sektor pertambangan untuk mengotomatiskan deteksi pergeseran dan anomali pasar.',
          'Merancang alur kerja data ujung-ke-ujung yang menghubungkan ekstraksi dokumen, pemodelan prediktif, dan analitik untuk pelaporan yang mulus.'
        ]
      },
      {
        title: 'INSINYUR AI',
        company: 'Trymerra AI Ltd.',
        location: 'London, Inggris (Remote)',
        period: 'Maret 2025 – Juli 2025',
        companyLogo: '/imagess/merra (2).png',
        responsibilities: [
          'Mengembangkan produk minimum viable (MVP) untuk platform rekrutmen berbasis AI, menangani seluruh proses pengembangan dari desain UI/UX hingga implementasi full-stack. Tujuannya adalah menciptakan pengalaman yang mulus bagi kandidat dan rekruter.',
          'Membangun frontend menggunakan React dan mengembangkan API backend untuk menangani logika inti dan operasi data. Mengintegrasikan Appwrite sebagai solusi backend-as-a-service untuk autentikasi, manajemen database, dan fungsi cloud.',
          'Mengintegrasikan fitur AI percakapan lanjutan, termasuk parsing CV dan simulasi wawancara otomatis, untuk mengotomatisasi dan mempersonalisasi proses penyaringan kandidat. Fitur-fitur ini secara signifikan mengurangi beban kerja manual dan meningkatkan efisiensi.',
          'Fokus pada optimasi kinerja sistem untuk memastikan pengalaman pengguna yang responsif dan real-time. Menerapkan praktik terbaik dalam responsivitas frontend dan kecepatan backend, sambil terus menguji stabilitas di seluruh alur pengguna.'
        ]
      },
      {
        title: 'INSINYUR AI & ALGORITMA',
        company: 'PT. Digital SawitPRO',
        location: 'Jakarta, Indonesia',
        period: 'Jan 2025 – Feb 2025',
        companyLogo: '/imagess/sawitpro2.png',
        responsibilities: [
          'Mengelola pengembangan sistem computer vision berbasis AI untuk mendeteksi pohon kelapa sawit secara otomatis dari citra drone dan satelit. Ini membantu menghilangkan penghitungan manual, secara signifikan meningkatkan efisiensi dan akurasi dalam pemantauan perkebunan.',
          'Membangun dan menyempurnakan model deep learning menggunakan PyTorch, fokus pada metode deteksi objek dan segmentasi gambar yang sesuai untuk tata letak pertanian yang padat. Algoritma dioptimalkan untuk menangani kualitas gambar dan kondisi lingkungan yang bervariasi.',
          'Bekerja sama dengan tim teknis dan produk untuk mengintegrasikan sistem deteksi ke dalam pipeline yang dapat diskalakan, memungkinkan analisis real-time dan mendukung pengambilan keputusan dalam manajemen perkebunan kelapa sawit.'
        ]
      },
      {
        title: 'INSINYUR AI',
        company: 'Lab Riset NLPIR BIT',  
        location: 'Beijing, Tiongkok',
        period: 'April 2023 - April 2024',
        companyLogo: '/imagess/bit.png',
        responsibilities: [
          'Melakukan penelitian dan pengembangan untuk menyempurnakan model bahasa besar (LLM) untuk bahasa Indonesia, fokus pada peningkatan kinerja untuk tugas NLP sumber daya rendah seperti analisis sentimen, klasifikasi niat, dan generasi teks.',
          'Memproses dan mengkurasi dataset bahasa Indonesia skala besar, menerapkan strategi tokenisasi, pembersihan, dan anotasi untuk meningkatkan kualitas dan relevansi pelatihan model. Mengevaluasi output model menggunakan benchmark dan umpan balik manusia.'
        ]
      },
      {
        title: 'SENIOR SOLUSI TEKNOLOGI INFORMASI',
        company: 'Universitas Mercu Buana',
        location: 'Jakarta, Indonesia',
        period: 'Okt 2022 – Feb 2023', 
        companyLogo: '/imagess/mercu.png',
        responsibilities: [
          'Memimpin tim IT kecil untuk memastikan kelancaran operasi dan ketersediaan infrastruktur IT kampus, menjaga keandalan sistem dan mengatasi masalah teknis dengan cepat untuk mendukung kegiatan akademik dan administratif.',
          'Memulai dan menerapkan beberapa optimasi sistem IT, menghasilkan peningkatan efisiensi operasional sebesar 15% melalui alur kerja yang ditingkatkan, sistem yang diperbarui, dan integrasi proses internal yang lebih baik.',
          'Mengawasi proyek IT penting termasuk peningkatan sistem, migrasi cloud, dan peningkatan protokol keamanan.'
        ]
      },
      {
        title: 'PETUGAS SOLUSI IT & OPERASI INTERNASIONAL',
        company: 'Universitas Mercu Buana',
        location: 'Jakarta, Indonesia',
        period: 'Sep 2019 – Okt 2022',
        companyLogo: '/imagess/mercu.png',
        responsibilities: [
          'Mengelola pengembangan dan integrasi database untuk inisiatif akademik internasional, memastikan manajemen data yang akurat dan aliran informasi yang lancar di seluruh departemen dan mitra global.',
          'Memberikan dukungan teknis dan pelatihan langsung kepada staf administratif, meningkatkan penggunaan sistem dan produktivitas. Peningkatan sistem dan proses otomatisasi berkontribusi pada peningkatan efisiensi keseluruhan sebesar 20%.',
          'Mengkoordinasikan program internasional seperti pertukaran mahasiswa dan gelar bersama, sambil memelihara dan memperbarui situs web hubungan internasional agar selaras dengan branding institusi dan mendukung integrasi berbasis cloud.'
        ]
      }
    ],
    educationHistory: [
      {
        institution: 'BEIJING INSTITUTE OF TECHNOLOGY',
        location: 'Beijing, Tiongkok',
        degree: 'Gelar Master Ilmu Komputer dan Teknologi',
        period: '2022 - 2024',
        institutionLogo: '/imagess/bit.png',
        details: [
          'Penghargaan: Penerima Beasiswa Pemerintah Tiongkok',
          'Tesis: Penelitian tentang Fine-Tuning Model Bahasa Besar Indonesia untuk Kesehatan Mental',
          'Berpartisipasi sebagai Ketua Seksi Pemungutan Suara Pemilu, KBRI Beijing (Feb–Mar 2024): Mengawasi operasi pemilu luar negeri, berkoordinasi dengan Pejabat KBRI dan KPU.'
        ]
      },
      {
        institution: 'UNIVERSITAS MERCU BUANA',
        location: 'Jakarta, Indonesia',
        degree: 'Sarjana Teknik Informatika',
        period: '2015 - 2019',
        institutionLogo: '/imagess/mercu.png',
        details: [
          'Penghargaan: Dinominasikan sebagai Lulusan Cum-laude di Fakultas, IPK: 3,88/4,0',
          'Tesis: Aplikasi Mobile Berbasis Android untuk Mencari Lapangan Olahraga Terdekat dan Online'
        ]
      },
      {
        institution: 'BEIJING INSTITUTE OF TECHNOLOGY',
        location: 'Beijing, Tiongkok',
        degree: 'Gelar Sarjana Ilmu Komputer dan Teknologi',
        period: '2015 - 2019',
        institutionLogo: '/imagess/bit.png',
        details: [
          'Tesis: Aplikasi Mobile Berbasis Android untuk Mencari Lapangan Olahraga Terdekat dan Online'
        ]
      }
    ]
  },
  projects: {
    title: 'Proyek',
    viewProject: 'Lihat Proyek',
    techStack: 'Teknologi',
    liveDemo: 'Demo Langsung',
    sourceCode: 'Kode Sumber'
  },
  achievements: {
    title: 'Prestasi',
    certifications: 'Sertifikasi',
    awards: 'Penghargaan',
    publications: 'Publikasi'
  },
  contact: {
    title: 'Hubungi Saya',
    description: 'Punya pertanyaan, ide proyek, atau ingin terhubung? Jangan ragu untuk menghubungi. Saya selalu terbuka untuk mendiskusikan peluang dan kolaborasi baru.',
    name: 'Nama Lengkap',
    email: 'Alamat Email',
    message: 'Pesan',
    send: 'Kirim Pesan',
    success: 'Pesan berhasil terkirim!',
    error: 'Gagal mengirim pesan. Silakan coba lagi.'
  },
  chatRoom: {
    title: 'Obrolan Langsung',
    liveChat: 'Obrolan Langsung',
    assistant: '',
    description: "Mengobrol dengan asisten AI Ryan. Asisten ini dapat menjawab pertanyaan tentang Ryan berdasarkan profilnya atau membantu Anda menghubunginya.",
    welcome: "Halo! Saya asisten AI Ryan. Silakan berikan nama Anda dan pesan pertama Anda untuk memulai obrolan.",
    yourName: 'Nama Anda',
    namePlaceholder: 'Masukkan nama Anda',
    company: 'Perusahaan / Organisasi',
    companyOptional: '(Opsional)',
    companyPlaceholder: 'Perusahaan Anda atau Individual',
    messageLabel: 'Pesan Anda',
    messageLabelAs: 'Pesan Anda (sebagai {name})',
    firstMessage: 'Pesan Pertama Anda',
    messagePlaceholder: 'Ketik pesan Anda di sini...',
    send: 'Kirim Pesan',
    assistantTyping: 'Asisten sedang mengetik...',
    error: "Maaf, saya mengalami kesalahan. Silakan coba lagi atau hubungi Ryan secara langsung."
  },
  dashboard: {
    title: 'Dasbor',
    overview: 'Ikhtisar',
    statistics: 'Statistik',
    recentActivity: 'Aktivitas Terbaru'
  },
  footer: {
    rights: '© 2025 Ryan Radityatama. Hak cipta dilindungi undang-undang.'
  },
  smartTalk: {
    button: 'Obrolan Cerdas'
  }
};

export default id;
