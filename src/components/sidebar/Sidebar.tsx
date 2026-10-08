import type { CvDocument, DesignSettings, Profile, CvTemplate } from '../../types/cv';
import { AiSection } from './AiSection';
import { ProfileSection } from './ProfileSection';
import { LanguagesSection } from './LanguagesSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationsSection } from './EducationsSection';
import { HardSkillsSection } from './HardSkillsSection';
import { SoftSkillsSection } from './SoftSkillsSection';
import { CompetencesSection } from './CompetencesSection';
import { RealisationsSection } from './RealisationsSection';
import { InterestsSection } from './InterestsSection';
import { DesignSection } from './DesignSection';
import { TemplatesSection } from './addTemplateSection';
import { AddSection } from './addSection';
import { useState } from 'react';

interface SidebarProps {
    cvData: CvDocument;
    prompt: string;
    addedPrompt: string;
    TJM: string;
    keyGroq: string;
    templates: CvTemplate[];
    cvLanguage: 'fr' | 'en';
    isGenerating: boolean;
    sharedSkillCount: number;
    design: DesignSettings;
    // Callbacks
    setPrompt: (value: string) => void;
    setAddedPrompt: (value: string) => void;
    setTJM: (value: string) => void;
    setATSPrompt: React.Dispatch<React.SetStateAction<string>>;
    setKeyGroq: (value: string) => void;
    setCvLanguage: (value: 'fr' | 'en') => void;
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
    onGenerate: () => void;
    onResetSkills: () => void;
    onPhotoChange: (value: string) => void;
    onPhotoRemove: () => void;
    onProfileFieldChange: (field: keyof Profile, value: string) => void;
    setSharedSkillCount: (count: number) => void;
    resizeAllSkills: (count: number) => void;
    onDesignChange: (value: DesignSettings | ((current: DesignSettings) => DesignSettings)) => void;
    setTemplate: React.Dispatch<React.SetStateAction<CvTemplate[]>>;
}

export function Sidebar({
    cvData,
    prompt,
    keyGroq,
    addedPrompt,
    TJM,
    templates,
    cvLanguage,
    isGenerating,
    sharedSkillCount,
    design,
    setCvData,
    setPrompt,
    setKeyGroq,
    setAddedPrompt,
    setTJM,
    setCvLanguage,
    onGenerate,
    onResetSkills,
    onPhotoChange,
    onPhotoRemove,
    onProfileFieldChange,
    resizeAllSkills,
    setSharedSkillCount,
    onDesignChange,
    setTemplate,
    setATSPrompt
}: SidebarProps) {
    const [fold, setFold] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    return (
        <aside className="brief-panel">
            <div className="eyebrow"></div>
            <h1>
                Votre profil,
                <br />
                <em>mieux</em> présenté.
            </h1>
            <p className="intro">
                Importez une photo et adaptez chaque rubrique pour obtenir un CV plus lisible par
                les recruteurs.
            </p>

            <AiSection
                fold={fold}
                setFold={setFold}
                TJM={TJM}
                setTJM={setTJM}
                prompt={prompt}
                keyGroq={keyGroq}
                setKeyGroq={setKeyGroq}
                setPrompt={setPrompt}
                addedPrompt={addedPrompt}
                setAddedPrompt={setAddedPrompt}
                setATSPrompt={setATSPrompt}
                cvLanguage={cvLanguage}
                setCvLanguage={setCvLanguage}
                isGenerating={isGenerating}
                onGenerate={onGenerate}
                onResetSkills={onResetSkills}
            />

            <button className="button-preset set-options"
            onClick={() => { setShowOptions(!showOptions); }}>
                {showOptions ? 'Masquer les options' : 'Afficher les options'}
            </button>

            {showOptions && (
            <>
                <ProfileSection
                    fold={fold}
                    photo={cvData.photo}
                    onPhotoChange={onPhotoChange}
                    onPhotoRemove={onPhotoRemove}
                    picSize={design.picSize}
                    profile={cvData.profile}
                    onFieldChange={onProfileFieldChange}
                />

                <SkillsSection fold={fold} sharedSkillCount={sharedSkillCount} setCvData={setCvData} setSharedSkillCount={setSharedSkillCount} resizeAllSkills={resizeAllSkills} />

                <LanguagesSection
                    fold={fold}
                    languages={cvData.languages}
                    setCvData={setCvData}
                />

                <ExperienceSection
                    setCvData={setCvData}
                    experiences={cvData.experiences}
                    fold={fold}
                />
                
                <EducationsSection
                    setCvData={setCvData}
                    educations={cvData.education}
                    fold={fold}
                />

                <HardSkillsSection
                    setCvData={setCvData}
                    hardskills={cvData.hardSkills}
                    fold={fold}
                />

                <SoftSkillsSection
                    setCvData={setCvData}
                    softskills={cvData.softSkills}
                    fold={fold}
                />

                <CompetencesSection
                    setCvData={setCvData}
                    competences={cvData.competences}
                    fold={fold}
                />

                <RealisationsSection
                    setCvData={setCvData}
                    realizations={cvData.realizations}
                    fold={fold}
                />

                <InterestsSection
                    setCvData={setCvData}
                    interests={cvData.interests}
                    fold={fold}
                />

                <TemplatesSection
                    setTemplate={setTemplate}
                    templates={templates}
                    fold={fold}
                />

                <AddSection
                    setCvData={setCvData}
                    cvData={cvData}
                    fold={fold}
                />

                <DesignSection fold={fold} templates={templates} setTemplate={setTemplate} design={cvData.design} onDesignChange={onDesignChange} />
            </>
        )}
        </aside>
    );
}
