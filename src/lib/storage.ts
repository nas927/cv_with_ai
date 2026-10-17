import { defaultCvDocument, defaultDesign, defaultEducation, defaultHardSkills, defaultLanguages, defaultSoftSkills, defaultCompetences, defaultExperiences, defaultRealization, defaultProfile, defaultOrder, defaultTemplate } from '../data/defaultCv';
import type { CvDocument, CvTemplate } from '../types/cv';

function mergeDefaults<T>(defaults: T, saved: Partial<T>): T {
    if (typeof defaults !== 'object' || defaults === null)
        return (saved ?? defaults) as T;

    const result = { ...defaults } as T;

    for (const key in defaults) {
        if (key in saved) {
            const defaultValue = defaults[key];
            const savedValue = saved[key];

            if (
                typeof defaultValue === 'object' &&
                defaultValue !== null &&
                !Array.isArray(defaultValue)
            )
                result[key] = mergeDefaults(defaultValue, savedValue ?? {});
            else if (savedValue !== undefined)
                result[key] = savedValue;
        }
    }

    return result;
}

export const load = <T,>(key: string, fallback: T): T => {
    try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
};

export const loadTemplates = (): CvTemplate[] => {
    const saved = load<CvTemplate[]>('templates', defaultTemplate);
    return saved;
}

export const loadCvDocument = (): CvDocument => {
    const saved = load<Partial<CvDocument>>('folio-document', {});
    const defaultCV = JSON.parse(localStorage.getItem('defaultCV') ?? '');

    return mergeDefaults(defaultCvDocument, {
        ...saved,
        profile: mergeDefaults(
            defaultProfile,
            {
                ...saved.profile,
                ...load('folio-profile', {})
            }
        ),
        photo: saved.photo ?? defaultCV.photo ?? localStorage.getItem('folio-photo') ?? '',
        hardSkills: saved.hardSkills ?? defaultCV.hardSkills ?? defaultHardSkills,
        softSkills: saved.softSkills ?? defaultCV.softSkills ?? defaultSoftSkills,
        experiences: saved.experiences ?? defaultCV.experiences ?? defaultExperiences,
        realization: saved.realization ?? defaultCV.realization ?? defaultRealization,
        education: saved.education ?? defaultCV.education ?? defaultEducation,
        competences: saved.competences ?? defaultCV.competences ?? defaultCompetences,
        languages: saved.languages ?? defaultCV.languages ?? defaultLanguages,
        sectionOrder: saved.sectionOrder ?? defaultCV.sectionOrder ?? defaultOrder,
        design: saved.design ?? defaultCV.design ?? defaultDesign
    });
};