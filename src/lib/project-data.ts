import { Language } from '@/lib/language';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  tags: string[];
  liveLink: string;
  codeLink: string;
};

const enProjects: Project[] = [
  {
    id: "dlob-community",
    title: "Dlob Community Platform Website",
    description: "A dynamic community platform website featuring interactive elements and engagement tools. Built to support and connect growing online communities.",
    imageUrl: "/dlob.png",
    imageHint: "community platform website",
    tags: ["Web Development", "Community Platform", "Next.js", "React", "TailwindCSS"],
    liveLink: "https://www.dlobcommunity.com/beranda",
    codeLink: "#",
  },
  {
    id: "wonderful-indonesia",
    title: "Wonderful Indonesia - AI Trip Planner",
    description: "An intelligent travel planner for exploring Indonesia, combining rich tourism data with an AI assistant to curate personalized itineraries.",
    imageUrl: "/wonderfulindo.png",
    imageHint: "AI Travel Platform",
    tags: ["AI", "Next.js", "Travel Tech", "React"],
    liveLink: "https://wonderfulindonesia.dreamhosters.com/",
    codeLink: "#",
  },
  {
    id: "future-xp",
    title: "Future Windows XP - Nostalgia OS with AI",
    description: "A nostalgic web-based recreation of Windows XP, beautifully infused with modern AI capabilities to bring classic memories into the future.",
    imageUrl: "/futurexp.png",
    imageHint: "AI OS Interface",
    tags: ["Web OS", "AI", "Nostalgia", "React"],
    liveLink: "https://futurexp.dreamhosters.com/",
    codeLink: "#",
  },
  {
    id: "seido-mitra-abadi",
    title: "Seido Mitra Abadi - Company Website",
    description: "Developed a modern company website for Seido Mitra Abadi featuring professional design, responsive layout, and dynamic content management. Built with Next.js and TailwindCSS for optimal performance.",
    imageUrl: "/imagess/seido.png",
    imageHint: "company website interface",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript", "Company Website", "Responsive Design"],
    liveLink: "https://seidomitraabadi.vercel.app/",
    codeLink: "#",
  },
  {
    id: "merra-ai",
    title: "Merra.ai - AI Interview Co-Pilot",
    description: "Developed Merra AI as AI Software Engineer, an AI-powered co-pilot for interviewers that assists with question generation, real-time response analysis, and provides post-interview insights.",
    imageUrl: "/imagess/merra.png",
    imageHint: "AI platform dashboard",
    tags: ["AI", "SaaS", "Next.js", "Recruitment Tech", "NLP", "Startup"],
    liveLink: "https://www.trymerra.ai/",
    codeLink: "#",
  },
  {
    id: "king-barbershop",
    title: "AI-Powered Barbershop Website",
    description: "Developed an AI-enhanced website for 'King Barbershop', featuring intelligent functionalities. View the live site or browse the code on GitHub.",
    imageUrl: "/imagess/kingbarber.png",
    imageHint: "barbershop website",
    tags: ["AI", "Web Development", "Next.js", "React", "Vercel", "JavaScript", "UI/UX"],
    liveLink: "https://king-barbershop.vercel.app/",
    codeLink: "https://github.com/ryradit/King-Barbershop",
  },
  {
    id: "llm-mental-health",
    title: "LLM Research for Mental Health",
    description: "Focused research on Indonesian Large Language Models (LLMs) for mental health applications, aiming to build empathetic and supportive conversational AI systems using NLP techniques.",
    imageUrl: "/imagess/mentalhealth.png",
    imageHint: "chatbot nlp",
    tags: ["LLMs", "NLP", "Python", "Research", "TensorFlow", "PyTorch"],
    liveLink: "https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2",
    codeLink: "#",
  },
  {
    id: "sports-booking",
    title: "Sports Booking Apps Startup",
    description: "Role: Android Developer.\nDeveloped an Android app to connect users with shared hobbies, featuring user profiles, event scheduling, and real-time notifications.",
    imageUrl: "/imagess/sweat.png",
    imageHint: "mobile app interface",
    tags: ["Android Development", "Mobile App", "Java/Kotlin", "Firebase", "UI/UX"],
    liveLink: "#",
    codeLink: "#",
  },
];

const idProjects: Project[] = [
  {
    id: "dlob-community",
    title: "Dlob Community Platform Website",
    description: "Website platform komunitas dinamis yang dilengkapi elemen interaktif dan alat keterlibatan. Dibangun untuk mendukung dan menghubungkan komunitas online.",
    imageUrl: "/dlob.png",
    imageHint: "website platform komunitas",
    tags: ["Pengembangan Web", "Platform Komunitas", "Next.js", "React", "TailwindCSS"],
    liveLink: "https://www.dlobcommunity.com/beranda",
    codeLink: "#",
  },
  {
    id: "wonderful-indonesia",
    title: "Wonderful Indonesia - Perencana Perjalanan AI",
    description: "Perencana perjalanan cerdas untuk menjelajahi Indonesia, menggabungkan data pariwisata dengan asisten AI untuk menyusun rencana perjalanan yang dipersonalisasi.",
    imageUrl: "/wonderfulindo.png",
    imageHint: "Platform Perjalanan AI",
    tags: ["AI", "Next.js", "Teknologi Perjalanan", "React"],
    liveLink: "https://wonderfulindonesia.dreamhosters.com/",
    codeLink: "#",
  },
  {
    id: "future-xp",
    title: "Future Windows XP - OS Nostalgia dengan AI",
    description: "Rekreasi Windows XP berbasis web yang nostalgia, dipadukan dengan kemampuan AI modern untuk membawa kenangan klasik ke masa depan.",
    imageUrl: "/futurexp.png",
    imageHint: "Antarmuka OS AI",
    tags: ["Web OS", "AI", "Nostalgia", "React"],
    liveLink: "https://futurexp.dreamhosters.com/",
    codeLink: "#",
  },
  {
    id: "seido-mitra-abadi",
    title: "Seido Mitra Abadi - Website Perusahaan",
    description: "Mengembangkan website perusahaan modern untuk Seido Mitra Abadi dengan desain profesional, tata letak responsif, dan manajemen konten dinamis. Dibangun dengan Next.js dan TailwindCSS untuk kinerja optimal.",
    imageUrl: "/imagess/seido.png",
    imageHint: "antarmuka website perusahaan",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript", "Website Perusahaan", "Desain Responsif"],
    liveLink: "https://seidomitraabadi.vercel.app/",
    codeLink: "#",
  },
  {
    id: "merra-ai",
    title: "Merra.ai - Co-Pilot Wawancara AI",
    description: "Mengembangkan Merra AI sebagai Insinyur Perangkat Lunak AI, sebuah co-pilot berbasis AI untuk pewawancara yang membantu dalam pembuatan pertanyaan, analisis respons real-time, dan memberikan wawasan pasca-wawancara.",
    imageUrl: "/imagess/merra.png",
    imageHint: "dasbor platform AI",
    tags: ["AI", "SaaS", "Next.js", "Teknologi Rekrutmen", "NLP", "Startup"],
    liveLink: "https://www.trymerra.ai/",
    codeLink: "#",
  },
  {
    id: "king-barbershop",
    title: "Website Barbershop dengan AI",
    description: "Mengembangkan website 'King Barbershop' yang ditingkatkan dengan AI, menampilkan fungsionalitas cerdas. Lihat situs langsung atau lihat kode di GitHub.",
    imageUrl: "/imagess/kingbarber.png",
    imageHint: "website barbershop",
    tags: ["AI", "Pengembangan Web", "Next.js", "React", "Vercel", "JavaScript", "UI/UX"],
    liveLink: "https://king-barbershop.vercel.app/",
    codeLink: "https://github.com/ryradit/King-Barbershop",
  },
  {
    id: "llm-mental-health",
    title: "Penelitian LLM untuk Kesehatan Mental",
    description: "Penelitian terfokus pada Model Bahasa Besar (LLM) Indonesia untuk aplikasi kesehatan mental, bertujuan membangun sistem percakapan AI yang empatik dan mendukung menggunakan teknik NLP.",
    imageUrl: "/imagess/mentalhealth.png",
    imageHint: "chatbot nlp",
    tags: ["LLMs", "NLP", "Python", "Penelitian", "TensorFlow", "PyTorch"],
    liveLink: "https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2",
    codeLink: "#",
  },
  {
    id: "sports-booking",
    title: "Startup Aplikasi Booking Olahraga",
    description: "Peran: Pengembang Android.\nMengembangkan aplikasi Android untuk menghubungkan pengguna dengan hobi yang sama, dilengkapi profil pengguna, penjadwalan acara, dan notifikasi real-time.",
    imageUrl: "/imagess/sweat.png",
    imageHint: "antarmuka aplikasi mobile",
    tags: ["Pengembangan Android", "Aplikasi Mobile", "Java/Kotlin", "Firebase", "UI/UX"],
    liveLink: "#",
    codeLink: "#",
  },
];

const zhProjects: Project[] = [
  {
    id: "dlob-community",
    title: "Dlob Community Platform Website",
    description: "一个包含互动元素和参与工具的动态社区平台网站。旨在支持和连接不断增长的在线社区。",
    imageUrl: "/dlob.png",
    imageHint: "社区平台网站",
    tags: ["网络开发", "社区平台", "Next.js", "React", "TailwindCSS"],
    liveLink: "https://www.dlobcommunity.com/beranda",
    codeLink: "#",
  },
  {
    id: "wonderful-indonesia",
    title: "Wonderful Indonesia - AI 旅行规划师",
    description: "一个用于探索印度尼西亚的智能旅行规划器，将丰富的旅游数据与AI助手相结合，以策划个性化的行程。",
    imageUrl: "/wonderfulindo.png",
    imageHint: "AI 旅游平台",
    tags: ["人工智能", "Next.js", "旅游科技", "React"],
    liveLink: "https://wonderfulindonesia.dreamhosters.com/",
    codeLink: "#",
  },
  {
    id: "future-xp",
    title: "Future Windows XP - 结合 AI 的怀旧操作系统",
    description: "一个基于网络的怀旧版Windows XP，完美融合了现代AI功能，将经典记忆带入未来。",
    imageUrl: "/futurexp.png",
    imageHint: "AI 操作系统界面",
    tags: ["网络操作系统", "人工智能", "怀旧", "React"],
    liveLink: "https://futurexp.dreamhosters.com/",
    codeLink: "#",
  },
  {
    id: "seido-mitra-abadi",
    title: "Seido Mitra Abadi - 公司网站",
    description: "为Seido Mitra Abadi开发了现代公司网站，具有专业设计、响应式布局和动态内容管理功能。使用Next.js和TailwindCSS构建以实现最佳性能。",
    imageUrl: "/imagess/seido.png",
    imageHint: "公司网站界面",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript", "公司网站", "响应式设计"],
    liveLink: "https://seidomitraabadi.vercel.app/",
    codeLink: "#",
  },
  {
    id: "merra-ai",
    title: "Merra.ai - AI面试助手",
    description: "作为AI软件工程师开发Merra AI，这是一个面向面试官的AI助手，可帮助生成问题、实时分析回答并提供面试后的见解。",
    imageUrl: "/imagess/merra.png",
    imageHint: "AI平台仪表板",
    tags: ["AI", "SaaS", "Next.js", "招聘技术", "NLP", "创业"],
    liveLink: "https://www.trymerra.ai/",
    codeLink: "#",
  },
  {
    id: "king-barbershop",
    title: "AI驱动的理发店网站",
    description: "为'King Barbershop'开发了一个具有智能功能的AI增强网站。查看在线网站或在GitHub上浏览代码。",
    imageUrl: "/imagess/kingbarber.png",
    imageHint: "理发店网站",
    tags: ["AI", "网站开发", "Next.js", "React", "Vercel", "JavaScript", "UI/UX"],
    liveLink: "https://king-barbershop.vercel.app/",
    codeLink: "https://github.com/ryradit/King-Barbershop",
  },
  {
    id: "llm-mental-health",
    title: "心理健康LLM研究",
    description: "专注研究印尼大型语言模型（LLM）在心理健康应用中的应用，旨在使用NLP技术构建富有同理心和支持性的对话AI系统。",
    imageUrl: "/imagess/mentalhealth.png",
    imageHint: "聊天机器人nlp",
    tags: ["LLMs", "NLP", "Python", "研究", "TensorFlow", "PyTorch"],
    liveLink: "https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2",
    codeLink: "#",
  },
  {
    id: "sports-booking",
    title: "运动预订应用创业项目",
    description: "角色：Android开发者。\n开发了一个Android应用，用于连接有共同爱好的用户，具有用户档案、活动安排和实时通知功能。",
    imageUrl: "/imagess/sweat.png",
    imageHint: "移动应用界面",
    tags: ["Android开发", "移动应用", "Java/Kotlin", "Firebase", "UI/UX"],
    liveLink: "#",
    codeLink: "#",
  },
];

export function getProjectsByLanguage(language: Language): Project[] {
  switch (language) {
    case 'id':
      return idProjects;
    case 'zh':
      return zhProjects;
    default:
      return enProjects;
  }
}

export const webBuilderProjects: Project[] = [
  {
    "id": "all-residential-services",
    "title": "All Residential Services",
    "description": "Cedar Falls & Waterloo Iowa",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "All Residential Services website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://allresidentialservice.com/",
    "codeLink": "#"
  },
  {
    "id": "salomon-aig-dental-marketing-agency",
    "title": "Salomon Aig | Dental Marketing Agency",
    "description": "We help dental clinics attract 25-50% more patient bookings in 60 days. Get your free 2-minute audit and discover new growth opportunities.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Salomon Aig | Dental Marketing Agency website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://salomonaig.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "maranatha-seventh-day-adventist-church",
    "title": "Maranatha Seventh-day Adventist Church",
    "description": "Welcome to Maranatha SDA Church in Barnstaple, Mandeville, Jamaica. Join us for worship, Bible study, prayer meetings, and community outreach.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Maranatha Seventh-day Adventist Church website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://maranathasdachurchja.org/",
    "codeLink": "#"
  },
  {
    "id": "phase-noise",
    "title": "Phase Noise",
    "description": "High-performance clocks, oscillators, and low phase noise electronics supporting the global Time and Frequency community for over 40 years.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Phase Noise website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://phasenoise.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "american-legion-post-123",
    "title": "American Legion Post 123",
    "description": "American Legion Post 123 in Angeles City, Philippines supports U.S. veterans and their families through community programs, benefits advocacy, and fellowship.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "American Legion Post 123 website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://al123pi.org/",
    "codeLink": "#"
  },
  {
    "id": "altman-photography",
    "title": "Altman Photography",
    "description": "Professional event, portrait, wedding, real estate, and commercial photography with over 30 years of experience preserving memories.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Altman Photography website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://altmanphotographyremixer.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "rishabh-mehta",
    "title": "Rishabh Mehta",
    "description": "Portfolio and blog by Rishabh Mehta — long-form analysis on geopolitics, technology, and film for professionals and curious readers.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Rishabh Mehta website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://rishabh-mehta.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "framholt-konsulentene",
    "title": "Framholt-konsulentene",
    "description": "Framholt-konsulentene tilbyr styrebistand, profesjonell tekstproduksjon og statist- og modelltjenester for film og reklame.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Framholt-konsulentene website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "http://framholt.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "rasyid-notaris",
    "title": "Rasyid Notaris",
    "description": "Professional notary office in Pontianak, Indonesia providing comprehensive notarial and legal documentation services with integrity and precision.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Rasyid Notaris website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://www.rasyidnotaris.id/",
    "codeLink": "#"
  },
  {
    "id": "carrera-underwear",
    "title": "Carrera Underwear",
    "description": "Carrera Underwear — Italian B2B manufacturer of intimate apparel, hosiery, beachwear, sportswear and workwear. Private label and custom solutions at industrial scale.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Carrera Underwear website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://carreraunderwear.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "lexis-luscious-powerwashes",
    "title": "Lexis Luscious PowerWashes",
    "description": "Full-service indoor and outdoor cleaning and reset solutions for vacation rentals, homeowners, and property managers in Northeast Michigan.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Lexis Luscious PowerWashes website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "http://lexislusciouspowerwashes.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "bellow-books",
    "title": "Bellow Books",
    "description": "Bellow Books modernizes historic Reformed theological works for contemporary readers. Browse our collection of carefully updated Puritan and Reformation classics.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Bellow Books website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://bellowbooks.com/",
    "codeLink": "#"
  },
  {
    "id": "ruth-banda-batista-realtor",
    "title": "Ruth Banda Batista Realtor",
    "description": "Ruth Banda Batista is a North Dallas real estate professional specializing in buyer guidance, seller advocacy, and seamless transactions across the DFW Metroplex.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Ruth Banda Batista Realtor website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://ruthbbrealtor.com/",
    "codeLink": "#"
  },
  {
    "id": "pauline-taschinski",
    "title": "Pauline Taschinski",
    "description": "Portfolio von Pauline Taschinski – angehende Wissenschaftlerin, Dozentin für Soziale Arbeit, Musikpädagogin und feministische Jugendarbeiterin.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Pauline Taschinski website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://paulinetaschinski.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "kumbo-council",
    "title": "Kumbo Council",
    "description": "Official digital platform for Kumbo Municipal Authority in the North West Region of Cameroon serving 127,000 residents across 42 villages.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Kumbo Council website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://kumbocouncil.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "tmack-productions",
    "title": "TMack Productions",
    "description": "TMack Productions — professional music production, mixing, mastering, scoring, and artist development. Shop digital products and merchandise online.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "TMack Productions website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://lecadre.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "freedom-valet-trash-services",
    "title": "Freedom Valet Trash Services",
    "description": "Doorstep valet trash, recycling, and yard waste bin pickup service in Johnson County, KS. Perfect for busy families, rentals, and anyone wanting stress-free trash days.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Freedom Valet Trash Services website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://freedomvalettrash.com/",
    "codeLink": "#"
  },
  {
    "id": "intuitive-reads",
    "title": "Intuitive Reads",
    "description": "Personalized spiritual guidance through tarot readings, Vedic astrology, energy work, and animal communication. Authentic insight for life transitions and personal growth.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Intuitive Reads website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://intuitivereadsr.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "greene-llc",
    "title": "Greene LLC",
    "description": "Greene LLC delivers scalable network infrastructure and technical foundation solutions enabling businesses to operate efficiently and securely.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Greene LLC website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://greenellc.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "organic-cleaning-service",
    "title": "Organic Cleaning Service",
    "description": "Professional organic cleaning with 7+ years of experience. Post-construction, move-in/out, and facility maintenance. EPA-certified, eco-friendly solutions for homes and businesses.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Organic Cleaning Service website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://organiccleaningservice.org/",
    "codeLink": "#"
  },
  {
    "id": "steve-volpe-author",
    "title": "Steve Volpe | Author",
    "description": "Steve Volpe is a self-published fiction author on Amazon KDP. Explore his debut book series launching 2026-2027 and subscribe for exclusive updates.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Steve Volpe | Author website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://www.stevevolpebooks.com/",
    "codeLink": "#"
  },
  {
    "id": "anser-biosciences",
    "title": "Anser Biosciences",
    "description": "Anser Biosciences provides bespoke, evidence-based research solutions through enthusiastic collaboration, working as an integrated extension of your team.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Anser Biosciences website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://anserbiosciences.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "veri-veroza",
    "title": "Veri Veroza",
    "description": "Veri Veroza is a professional photography and videography studio specializing in weddings, commercial, Reels, video production, and high-end interior photography.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Veri Veroza website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://veriveroza.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "katt-s-sparkly-cleaning-services",
    "title": "Katt's Sparkly Cleaning Services",
    "description": "Professional residential and commercial cleaning services in Gilmer, TX. Deep cleans, move-in/out, Airbnb turnovers, and more — serving a 50+ mile radius.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Katt's Sparkly Cleaning Services website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://kattssparklycleaningservices.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "queensriver",
    "title": "Queensriver",
    "description": "UK property investment coaching, mentorship and seminars for modern investors — learn residential and commercial property from the ground up.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Queensriver website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://www.queensriver.co.uk/",
    "codeLink": "#"
  },
  {
    "id": "priced2move",
    "title": "Priced2move",
    "description": "Fullstack web development project for Priced2move. Featuring custom design and responsive layout.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Priced2move website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://priced2move.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "inversiones-capital-minera",
    "title": "Inversiones Capital Minera",
    "description": "Desarrollo y gestion de capital humano para la industria minera. Especializacion, formacion continua and excelencia operacional.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Inversiones Capital Minera website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://capitalminera.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "binateks-technical-solutions-limited",
    "title": "Binateks Technical Solutions Limited",
    "description": "Engineering solutions company specializing in vertical transportation, building automation, and engineering maintenance across West Africa and Australia.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Binateks Technical Solutions Limited website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://binatekstsl.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "appwings",
    "title": "AppWings",
    "description": "AppWings is your trusted, audited home for free Android APKs — fast downloads, malware verification, clean ad-light interface, and a curated library of open-source apps.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "AppWings website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://appwings.store/",
    "codeLink": "#"
  },
  {
    "id": "plane-of-oscuris",
    "title": "Plane of Oscuris",
    "description": "A community archive preserving the lore, dialogue, and artifacts of Norrath. Chronicles, voices, and maps from across the planes — kept by adventurers, for adventurers.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Plane of Oscuris website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://oscuris.com/",
    "codeLink": "#"
  },
  {
    "id": "arc-solutions",
    "title": "Arc Solutions",
    "description": "Arc Solutions is a New Zealand-based consultancy bridging the gap between Finance and IT, specialising in ERP implementation, cost modelling, and process transformation.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Arc Solutions website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://www.arcsolutions.co.nz/",
    "codeLink": "#"
  },
  {
    "id": "era-echo",
    "title": "Era Echo",
    "description": "Era Echo designs modern timepieces with precise movements and premium materials. Chronographs, divers, and heritage pieces built for everyday wear.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Era Echo website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://eresecho.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "mid-east-company",
    "title": "Mid East Company",
    "description": "Mid East Company for Oil Facilities Maintenance, Refineries, Wells, and Petrochemicals — comprehensive maintenance solutions across the oil and gas sector.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Mid East Company website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://migtckw.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "heat-haven",
    "title": "Heat Haven",
    "description": "Heat Haven — Gas Safe registered heating engineers serving Gloucestershire. Boiler installation, servicing, repairs and central heating maintenance.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Heat Haven website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://heat-haven.co.uk/",
    "codeLink": "#"
  },
  {
    "id": "a-star-projects",
    "title": "A Star Projects",
    "description": "Luxury bespoke bathroom renovations in Maidstone and Kent. 15 years of master craftsmanship, 3D design, and premium fixtures.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "A Star Projects website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://astarprojectsuk.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "importsbol",
    "title": "IMPORTSBOL",
    "description": "Importamos productos originales de USA a Bolivia. Electronica, ropa de marca and pedidos personalizados con entrega segura.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "IMPORTSBOL website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://importsbol.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "i-am-her-d",
    "title": "I AM HER'D",
    "description": "A community platform and archive for the I AM HER'D community.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "I AM HER'D website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://iamherdcommunity.org/",
    "codeLink": "#"
  },
  {
    "id": "jc-farms",
    "title": "JC Farms",
    "description": "Agricultural project and website for JC Farms in Zambia.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "JC Farms website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://jcfarmsver2.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "tranquil-trinity-llc",
    "title": "Tranquil Trinity, LLC",
    "description": "Tranquil Trinity provides athletic training, education and consulting, and complementary medicine services in Tuscaloosa, AL — a holistic approach to athletic health and recovery.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Tranquil Trinity, LLC website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://www.tranquiltrinity.com/",
    "codeLink": "#"
  },
  {
    "id": "prof-uriel-simonsohn",
    "title": "Prof Uriel Simonsohn",
    "description": "Academic portfolio of Prof Uriel Simonsohn, historian of the early and medieval Islamic Near East at the University of Haifa.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Prof Uriel Simonsohn website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://urielsimonsohn.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "matthew-quinn-system-safety-engineer",
    "title": "Matthew Quinn — System Safety Engineer",
    "description": "Matthew Quinn is a System Safety Engineer specialising in UK Defence and aerospace, building forward-thinking safety into mission-critical systems.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Matthew Quinn — System Safety Engineer website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://matthewquinn.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "royal-gourmet",
    "title": "Royal Gourmet",
    "description": "Royal Gourmet — Award-winning authentic Cantonese dim sum and premium frozen specialties for elite UK retailers, caterers, and wholesale partners.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "Royal Gourmet website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://royalgourmetuk.dreamhosters.com/",
    "codeLink": "#"
  },
  {
    "id": "hc-group",
    "title": "HC Group",
    "description": "Corporate website for HC Group based in Hong Kong.",
    "imageUrl": "/imagess/placeholder.jpg",
    "imageHint": "HC Group website",
    "tags": [
      "Web Builder",
      "Fullstack",
      "Responsive"
    ],
    "liveLink": "https://hochoi.hk/",
    "codeLink": "#"
  }
];
