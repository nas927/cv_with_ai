import type { CvEditor } from '../types/cv';

export const createNullEditor = (): CvEditor => ({
    enabled: false,
    updateProfile: () => {},
    updateList: () => {},
    updateExperience: () => {},
    updateRealization: () => {},
    updateInterests: () => {},
    updateEducation: () => {},
    updateCompetence: () => {},
    updateLanguage: () => {},
});
