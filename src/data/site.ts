/**
 * 網站層級的個人資料。
 * 履歷有更新時（經歷、學歷、聯絡方式），同步改這個檔案即可。
 */

export const site = {
  title: 'Mike (leemikepop)',
  name: 'Mike',
  handle: 'leemikepop',
  description:
    'Mike (leemikepop) — CS master’s student at NTHU working on Android device security, root / tamper detection, Linux kernel and systems.',
  headline: 'Android Security · Systems · Kernel',
  intro:
    'CS master’s student at National Tsing Hua University, researching Android device integrity and root / runtime-tampering detection. I have also built software routers (OpenWrt / VyOS), a mobile threat defense client, HPC parallel programs, and LLM applications.',
  location: 'Hsinchu, Taiwan',
  focus: ['Android Security', 'Root Detection', 'Linux Kernel', 'Networking', 'HPC', 'AI / CV'],
  links: [
    { label: 'GitHub', url: 'https://github.com/leemikepop' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/leemikepop/' },
    { label: 'Email', url: 'mailto:leemikepop@gmail.com' },
  ],
} as const;

export interface Experience {
  title: string;
  org: string;
  period: string;
  points: string[];
}

export const experience: Experience[] = [
  {
    title: 'Android Root Detection Research',
    org: 'NTHU Information Security Lab',
    period: '2026.01 — Present',
    points: [
      'Researching defenses for FinTech and security-sensitive apps against modern root-hiding and detection-bypass techniques.',
      'Building an advanced anti-root core library and evaluating TEE-backed Key Attestation and the Play Integrity API.',
    ],
  },
  {
    title: 'Android Mobile Threat Defense (MTD) System',
    org: 'NTHU Information Security Lab',
    period: '2025.09 — 2026.01',
    points: [
      'Led the overall architecture of an enterprise Android MTD client integrating C++, Kotlin and Python, delivering malicious-domain filtering, TLS certificate verification and real-time risk scoring.',
      'Implemented Device Policy Management and Always-on VPN lockdown for zero-trust traffic control.',
    ],
  },
  {
    title: 'Router OS Integration Engineer',
    org: 'Industry–Academia Collaboration (NTHU InfoSec Lab × networking vendor)',
    period: '2024.09 — 2025.08',
    points: [
      'Worked in an 8-person team on the final phase of a 3-year corporate R&D project on software-defined routers (OpenWrt / VyOS).',
      'Handled Captive Portal and VPN integration, system verification, functional testing, firewall scripts and CI/CD maintenance.',
    ],
  },
  {
    title: 'LLM Application Intern',
    org: 'T-Ambassador Program × Shanghai Commercial & Savings Bank',
    period: '2024.03 — 2024.07',
    points: [
      'Developed LLM applications for credit investigation and regulatory compliance, integrated with AWS and deployed with Docker.',
    ],
  },
  {
    title: 'AI / Computer Vision Research & Capstone',
    org: 'ITRI × NUTN Intelligent Visual Computing Lab',
    period: '2023.03 — 2023.12',
    points: [
      'Team lead on an ITRI collaboration predicting physical properties of textiles from images.',
      'Won First Place (Intelligent Systems) and the Industry Potential Award at the capstone competition.',
    ],
  },
];

export const education = [
  { school: 'National Tsing Hua University', degree: 'M.S. Computer Science', period: '2024 — Present' },
  { school: 'National University of Tainan', degree: 'B.S. Computer Science', period: '2020 — 2024' },
];

/** 專案分類：新增分類時在這裡加一筆，content.config.ts 會自動套用。 */
export const categories = {
  'android-security': 'Android Security',
  systems: 'Systems / Kernel',
  ai: 'AI / Data',
  app: 'Apps',
  coursework: 'Coursework',
} as const;

export type CategoryKey = keyof typeof categories;
export const categoryKeys = Object.keys(categories) as [CategoryKey, ...CategoryKey[]];
