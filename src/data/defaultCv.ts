import type { CompetenceItem, CvDocument, CvTemplate, DesignSettings, Education, Experience, Language, Profile, Interests } from '../types/cv';

export const defaultProfile: Profile = {
    name: 'John Doe', job: 'entreprise', title: 'Ingénieur DevSecOps / SRE',
    permis: 'Permis B',
    email: 'exemple@gmail.com', age: '25 ', website: 'https://exemple.com', language: 'Français', region: 'Île de France', city: 'Paris', phone: '0600000000', initials: 'NA',
    about: "Ingénieur passionné par les environnements Linux, l’automatisation et la fiabilité des systèmes. Fort de plusieurs années d’expérience DevOps, je conçois des infrastructures IaC, optimise les pipelines CI/CD et assure le support N3 avec une approche SRE.",
};
export const defaultHardSkills = [
    "Programmation Web — NextJS, Laravel, Django, Node.js, Express, Sass, TypeScript, Tailwind, Bootstrap, ESLint, Prettier, Vite, React",
    "Cybersécurité — Hardening, Pentesting, Threat Modeling, Application Security, Secure Code Review, Malware Analysis, Network Security, API Security, Vulnerability Research, OSINT",
    "Programmation générale — Python (FastAPI, HuggingFace, Qt), C++ (WxWidgets, ImGui, API Windows/Linux), C (drivers)",
    "Administration réseau & analyse de paquets — Windows Defender, iptables, Netcat, tcpdump, OpenVPN, OpenSSL, Wireshark, BurpSuite, Nmap",
    "Cloud & automatisation CI/CD — Terraform, Ansible, Kubernetes, SonarQube, ArgoCD, Vault, VMware, Proxmox",
    "Méthodologies & bonnes pratiques — Agile Scrum, TDD, DDD, BDD, SOLID, GitOps, Refactoring, Code Review, Clean Code, POO, MVC, MVVM",
    "Environnements — Linux, Windows, Docker, Git, GitLab, GitHub",
    "Bases de données — IndexedDB, PostgreSQL, MySQL, SQLite, Elasticsearch",
    "Observabilité & métriques — Loki, Logstack, Grafana, Prometheus",
    "Intelligence artificielle — Ollama, GGUF, llama.cpp, LangChain, HuggingFace, RAG, Fine-Tune",
    "Scripting — Bash, PowerShell, sh, zsh",
    "Tests & validation — Jest, Vitest, Playwright, xUnit, NUnit, Postman",
    "DevSecOps — SAST, DAST, PRA, PCA, HA, HLA, LLA, LPM, rédaction DAS/DAT"
  ];
  
  export const defaultSoftSkills = [
    "Communication efficace",
    "Travail d'équipe",
    "Gestion du temps",
    "Résolution de problèmes",
    "Adaptabilité",
    "Leadership technique",
    "Esprit analytique"
  ];
export const defaultLanguages: Language[] = [{ name: 'Français', level: 'natif' }, { name: 'Anglais', level: 'C2' }, { name: 'Espagnol', level: 'B2' }];
export const defaultExperiences: Experience[] = [
    {
      company: "Groupama",
      role: "Ingénieur DevSecOps",
      date: "Sept. 2022 - Déc. 2025",
      location: "Île-de-France",
      text: "Conception et déploiement d’infrastructures automatisées avec Terraform et Ansible. Gestion de clusters Kubernetes pour des applications critiques, mise en place de pipelines CI/CD sécurisés avec GitLab CI, intégration GitOps via ArgoCD, développement de tableaux de bord de monitoring avec Prometheus et Grafana. Prise en charge du support N3 et résolution d’incidents majeurs selon les principes SRE. Amélioration du MTTR de 30 % grâce à l’automatisation des diagnostics."
    },
    {
      company: "Lynoria OS",
      role: "Architecte Full-Stack",
      date: "2025 - 2026",
      location: "Paris/Lille",
      text: "Architecture de solutions cloud-native basées sur Docker et Kubernetes. Définition de patterns de microservices, automatisation du provisionnement d’infrastructure avec Terraform, création de scripts Python pour la gestion du cycle de vie des conteneurs. Optimisation des pipelines CI/CD avec GitLab et déploiement continu via ArgoCD. Mise en place d’une observabilité complète avec Prometheus et Grafana et participation aux revues d’incidents pour garantir la haute disponibilité."
    },
    {
      company: "Alpaguide.fr",
      role: "Développeur Full Stack Web & Mobile",
      date: "Aujourd'hui",
      location: "Paris",
      text: "Développement d'une plateforme web et mobile avec Next.js, React et TypeScript. Conception de nouvelles fonctionnalités et amélioration continue de l'expérience utilisateur. Coordination technique entre plusieurs développeurs et participation aux choix d'architecture. Mise en place et optimisation des processus de développement et de livraison continue."
    },
    {
      company: "DIA",
      role: "Architecte IA",
      date: "2024 - 2025",
      location: "Île-de-France",
      text: "Déploiement d’une solution de détection d’images suspectes basée sur l’intelligence artificielle pour une dizaine de magasins DIA. Conception et mise en place d’un modèle d’analyse d’images permettant d’identifier automatiquement des comportements ou situations visuelles inhabituelles afin d’améliorer la surveillance, la prévention des incidents et la réactivité des équipes terrain. Intégration de la solution dans l’environnement existant, optimisation des performances du modèle et accompagnement des utilisateurs."
    },
    {
      company: "ExcelCoder",
      role: "Développeur Python / IA",
      date: "2025",
      location: "Paris",
      text: "Développement d'une extension Microsoft Excel intégrant un assistant basé sur des LLM. Conception et déploiement d'un modèle d'intelligence artificielle local au format GGUF. Mise en place d'une solution garantissant confidentialité, faible latence et traitement local des données. Développement et maintenance du projet au sein d'un dépôt Git privé."
    },
    {
      company: "Stresser.to",
      role: "Développeur SaaS",
      date: "2022",
      location: "Paris",
      text: "Conception et développement d'une plateforme SaaS destinée aux tests de charge réseau et à l'évaluation de la résilience des infrastructures. Développement du backend, de l'interface d'administration et des systèmes de gestion utilisateurs."
    },
    {
      company: "MakeFolio",
      role: "Fondateur & Développeur Application IA",
      date: "2026",
      location: "Paris",
      text: "Conception d'une plateforme de génération de CV assistée par intelligence artificielle. Développement du frontend avec React et du backend serverless sur Vercel. Génération automatisée de CV adaptés aux offres d'emploi grâce aux LLM. Développement d'un moteur de personnalisation des compétences, expériences et mises en page."
    },
    {
      company: "Kibyli, KrystalBeauty",
      role: "Développeur WordPress",
      date: "2024",
      location: "Paris",
      text: "Développement de sites WordPress sur mesure en PHP. Création d'une boutique e-commerce avec gestion des commandes et paiements. Développement d'un site vitrine intégrant un système de réservation et de calendrier. Maintenance et évolution du code source via GitHub privé."
    }
  ];
export const defaultRealization: Experience[] = [
    { company: 'Semjase Dev', date: '(2016)', location: '', text: '+ 10000 utilisateurs à travers le monde. Expérience concrète et renommée dans le monde du reverse gaming à l’âge de 15 ans.' },
];
export const defaultInterests: Interests[] = [
    { title: 'Semjase Dev', text: 'Passionné par le développement de jeux vidéo et la cybersécurité.' }
];
export const defaultTemplate: CvTemplate[] = [
    { id: 'folio', name: 'Folio', description: 'Équilibré et polyvalent', used: true, css: '' },
    { id: 'editorial', name: 'Editorial', description: 'Plus expressif et structuré', used: false, css: '' },
    { id: 'compact', name: 'Compact', description: 'Dense pour les profils expérimentés', used: false, css: '' },
]
export const defaultOrder = [
    {name: 'about', title: 'about', isAside: true, isVisible: true},
    {name: 'languages', title: 'languages', isAside: true, isVisible: true}, 
    {name: 'hardSkills', title:'hardSkills', isAside: true, isVisible: true}, 
    {name: 'softSkills', title:'softSkills', isAside: true, isVisible: true}, 
    {name: 'realizations', title:'realizations', isAside: true, isVisible: true}, 
    {name: 'interests', title:'interests', isAside: true, isVisible: true}, 
    {name: 'educations', title:'educations', isAside: false, isVisible: true}, 
    {name: 'experiences', title:'experiences', isAside: false, isVisible: true}, 
    {name: 'competences', title:'competences', isAside: false, isVisible: true}
]
export const defaultEducation: Education[] = [{ title: 'Pentester Senior', date: 'Depuis avr. 2024', location: 'TryHackMe · Paris', text: 'Cours et CTF gamifié pour tester et améliorer ses compétences en cybersécurité, niveau Master top 3%.' }, { title: 'École 42', date: 'De mai 2021 à juin 2022', location: 'Paris 17', text: 'Post BAC scientifique après 2 ans de développement web Symfony et Angular. Assembleur, NASM, C, C++, algorithmie, architecture LLM et environnement Unix.' }];
export const defaultCompetences: CompetenceItem[] = [{ name: 'DevSecOps', text: 'ISO 27001, NIST, CIS Benchmarks, OWASP Top 10, Politiques de sécurité, Gouvernance SSI' }, { name: 'Réseau', text: 'TCP/IP, DNS, Load Balancer, Reverse Proxy, Firewall' }, { name: 'Cloud & Infrastructure', text: 'Azure, Google Cloud Platform (GCP), Virtualisation, IaC, Docker, Kubernetes, VPN' }, { name: 'Infrastructure as Code', text: 'Terraform, Ansible' }, { name: 'CyberSécurité', text: 'Cloud Security, IAM, RBAC, MFA, Zero Trust, Hardening, Gestion des vulnérabilités, Threat Modeling, Chiffrement, PKI, SIEM, SOC' }, { name: 'Architecture', text: 'Architecture Cloud, Architecture sécurisée, DAT, DAS, Urbanisation SI, Conception technique, Transformation Cloud' }];
export const defaultDesign: DesignSettings = { picSize: 165, template: 'folio', nameScale: 235, titleScale: 110, aboutScale: 85, textScale: 95, headingScale: 95, sectionSpacing: 100, blockSpacing: 50, lineHeight: 130, font: "'DM Sans'", accent: '#6d8520', ink: '#292928' };
export const defaultCvDocument: CvDocument = { profile: defaultProfile, photo: '', hardSkills: defaultHardSkills, softSkills: defaultSoftSkills, experiences: defaultExperiences, realizations: defaultRealization, interests: defaultInterests, education: defaultEducation, competences: defaultCompetences, languages: defaultLanguages, sectionOrder: defaultOrder, design: defaultDesign };