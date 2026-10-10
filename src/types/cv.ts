import type { CSSProperties, ReactNode } from 'react';

export type Language = { name: string; level: string };
export type Profile = {
    name: string;
    job: string;
    title: string;
    permis: string;
    email: string;
    age: string;
    website: string;
    language: string;
    region: string;
    city: string;
    phone: string;
    about: string;
    initials: string;
};
export type Experience = {
    company: string;
    role?: string;
    date: string;
    location: string;
    text: string;
};
export type Education = { title: string; date: string; location: string; text: string };
export type Interests = { title: string; text: string };
export type CompetenceItem = { name: string; text: string };
export type SectionOrder = {name: string, title: string, isAside: boolean, isVisible: boolean};
export type DesignSettings = {
    picSize: number;
    template: string;
    nameScale: number;
    titleScale: number;
    aboutScale: number;
    textScale: number;
    headingScale: number;
    sectionSpacing: number;
    blockSpacing: number;
    lineHeight: number;
    font: string;
    accent: string;
    ink: string;
};
export type CvDocument = {
    profile: Profile;
    photo: string;
    hardSkills: string[];
    softSkills: string[];
    experiences: Experience[];
    realizations: Experience[];
    education: Education[];
    competences: CompetenceItem[];
    languages: Language[];
    interests: Interests[];
    sectionOrder: SectionOrder[];
    design: DesignSettings;

    [key: string]: any;
};
export type ImportantCv = Omit<CvDocument, 'SectionOrder | design | photo'>
export const emptyCvSchema: ImportantCv = {
    profile: {name:"",job:"",title:"",email:"",age:"",website:"",permis:"",language:"",region:"",city:"",phone:"",about:"",initials:""},
    hardSkills: [],
    softSkills: [],
    experiences: {title:'',role:'',date:'',location:'',text:''},
    realization: {title: '',role: '',date: '',location: '',text: ''},
    education: {title: '',date: '',location: '',text: ''},
    competences: {name: '',text: ''},
    languages: {name: '',level: ''},
    interests: {title: '', text: ''}
};
export type CvEditor = {
    enabled: boolean;
    updateProfile: (field: keyof Profile, value: string) => void;
    updateList: (field: 'hardSkills' | 'softSkills', index: number, value: string) => void;
    updateExperience: (index: number, field: keyof Experience, value: string) => void;
    updateRealization: (field: keyof Experience, value: string) => void;
    updateInterests: (field: keyof Interests, value: string) => void;
    updateEducation: (index: number, field: keyof Education, value: string) => void;
    updateCompetence: (index: number, field: keyof CompetenceItem, value: string) => void;
    updateLanguage: (index: number, field: keyof Language, value: string) => void;
};

export type CvTemplate = {
    id: string;
    name: string;
    description: string;
    css: string;
    used: boolean;
};

export type CvPaperStyle = CSSProperties & Record<`--${string}`, string | number>;
export type CvContent = ReactNode;