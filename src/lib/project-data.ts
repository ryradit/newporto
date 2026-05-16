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
