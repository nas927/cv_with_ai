import { useEffect, useState } from 'react';
import { loadCvDocument } from '../lib/storage';
import type { CvDocument, DesignSettings, Profile, CompetenceItem } from '../types/cv';
import { initializeSkills, initializeCompetences } from '../lib/utils';

export function useCvData() {
    const [cvData, setCvData] = useState<CvDocument>(loadCvDocument);
    const { profile, photo, hardSkills, softSkills, languages, competences, design } = cvData;
    const [pageNumber, setPageNumber] = useState(localStorage.getItem('page-number')
    ? Number(localStorage.getItem('page-number'))
    : 2);


    // Sauvegarde automatique
    useEffect(() => {
        localStorage.setItem('folio-document', JSON.stringify(cvData));
    }, [cvData]);

    // Setters pour différentes parties du CV
    const setPhoto = (value: string) =>
        setCvData((current) => ({ ...current, photo: value }));

    const updateProfileField = (field: keyof Profile, value: string) =>
        setCvData((current) => ({
            ...current,
            profile: { ...current.profile, [field]: value },
        }));

    const setDesign = (value: DesignSettings | ((current: DesignSettings) => DesignSettings)) =>
        setCvData((current) => ({
            ...current,
            design: typeof value === 'function' ? value(current.design) : value,
        }));

    const resizeAllSkills = (count: number) => {
        setCvData((current) => ({
            ...current,
            hardSkills: (initializeSkills(current.hardSkills, 'Hard Skill', count) as string[]),
            softSkills: (initializeSkills(current.softSkills, 'Soft Skill', count) as string[]),
            competences: (initializeCompetences(current.competences, 'Competence', count) as CompetenceItem[]),
        }));
    };

    const resizeSpecificSkills = () => {
        const countCompetence = localStorage.getItem("competenceCount") ? parseInt(localStorage.getItem("competenceCount") ?? "") : sharedSkillCount;
        const hardSkillsCount = localStorage.getItem("hardSkillsCount") ? parseInt(localStorage.getItem("hardSkillsCount") ?? "") : sharedSkillCount;
        const softSkillsCount = localStorage.getItem("softSkillsCount") ? parseInt(localStorage.getItem("softSkillsCount") ?? "") : sharedSkillCount;

        setCvData((current) => ({
            ...current,
            hardSkills: (initializeSkills(current.hardSkills, 'Hard Skill', hardSkillsCount) as string[]),
            softSkills: (initializeSkills(current.softSkills, 'Soft Skill', softSkillsCount) as string[]),
            competences: (initializeCompetences(current.competences, 'Competence', countCompetence) as CompetenceItem[]),
        }));
    };

    const resetSkills = () => {
        setCvData((current) => ({
            ...current,
            profile: {
                ...current.profile,
                job: '',
                title: '',
                about: '',
            },
            hardSkills: [],
            softSkills: [],
            competences: [],
            experiences: current.experiences.map(exp => ({
                ...exp,
                role: exp.role?.split(' / ')[0] || '',
                text: "",
            }))
        }));
        resizeSpecificSkills();
    };

    const [sharedSkillCount, setSharedSkillCount] = useState(localStorage.getItem('sharedSkillCount')
        ? Number(localStorage.getItem('sharedSkillCount'))
        : 7);

    return {
        cvData,
        profile,
        photo,
        hardSkills,
        softSkills,
        languages,
        competences,
        design,
        sharedSkillCount,
        pageNumber,
        // Methods
        setCvData,
        setPhoto,
        updateProfileField,
        setDesign,
        resizeAllSkills,
        setSharedSkillCount,
        resetSkills,
        setPageNumber,
    };
}
