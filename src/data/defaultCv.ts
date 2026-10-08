import type { CompetenceItem, CvDocument, CvTemplate, DesignSettings, Education, Experience, Language, Profile, Interests } from '../types/cv';

export const defaultProfile: Profile = {
    name: 'John Doe', job: 'entreprise', title: 'Ingénieur Cloud Security | DevSecOps | Cloud Security Engineer | Azure | GCP | IAM | CI/CD',
    permis: 'Permis B',
    email: 'exemple@gmail.com', age: '25 ', website: 'https://exemple.com', language: 'Français', region: 'Île de France', city: 'Paris', phone: '0600000000', initials: 'NA',
    about: "Ingénieur Cloud Security orienté DevSecOps avec une expérience dans le pilotage de projets à grande échelle et la sécurisation des infrastructures. Habitué à coordonner des équipes techniques, intégrer la sécurité dans les projets IT et accompagner les transformations Cloud. Solide culture cybersécurité couvrant la gouvernance SSI, la gestion des risques, l'IAM, les audits de sécurité, la conformité (ISO 27001, NIST, CIS) et l'amélioration continue des processus de sécurité.",
};
export const defaultHardSkills = ['Gestion des identités et des accès (IAM)', 'Sécurisation des environnements Cloud Azure et GCP', 'Sécurité réseau et stratégies de chiffrement', 'Gestion des vulnérabilités et plans de remédiation', 'Audits de sécurité applicative (SAST/DAST)', 'Définition des standards d’architecture'];
export const defaultSoftSkills = ['Leadership technique', 'Résolution de problèmes', 'Force de proposition', 'Culture de la qualité', 'Capacité de vulgarisation'];
export const defaultLanguages: Language[] = [{ name: 'Français', level: 'natif' }, { name: 'Anglais', level: 'C2' }, { name: 'Espagnol', level: 'B2' }];
export const defaultExperiences: Experience[] = [
    { company: 'entreprise 1', role: 'Chef de projet / Architecte Cloud & DevSecOps', date: 'De sept. 2022 à déc. 2025', location: 'Île-de-France', text: 'Pilotage de plus de 300 sites et coordination de projets d’envergure nationale. Coordination des équipes techniques, métiers et prestataires. Suivi des plannings, budgets, risques et indicateurs de performance. Participation à la définition des architectures techniques et des bonnes pratiques. Pilotage des déploiements et accompagnement des équipes jusqu’à la mise en production.' },
    { company: 'entreprise 2', role: 'Fondateur & Chef de Projet – Entreprise personnelle', date: 'Depuis jan. 2020', location: 'Paris, Île-de-France', text: 'Conception, développement et déploiement de solutions techniques. Mise en place d’architectures Cloud sécurisées et évolutives. Administration de serveurs Linux et Windows. Intégration de mécanismes de sécurité dès la conception (Security by Design). Gestion des identités, des accès et des droits utilisateurs.' },
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
export const defaultDesign: DesignSettings = { picSize: 165, template: 'folio', nameScale: 235, titleScale: 110, textScale: 95, headingScale: 95, sectionSpacing: 100, blockSpacing: 50, lineHeight: 130, font: "'DM Sans'", accent: '#6d8520', ink: '#292928' };
export const defaultCvDocument: CvDocument = { profile: defaultProfile, photo: '', hardSkills: defaultHardSkills, softSkills: defaultSoftSkills, experiences: defaultExperiences, realizations: defaultRealization, interests: defaultInterests, education: defaultEducation, competences: defaultCompetences, languages: defaultLanguages, sectionOrder: defaultOrder, design: defaultDesign };