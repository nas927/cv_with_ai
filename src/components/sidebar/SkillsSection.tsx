import { useEffect, useState } from "react";
import { initializeSkills, initializeCompetences } from "../../lib/utils";
import type { CompetenceItem, CvDocument } from "../../types/cv";

interface SkillsSectionProps {
    fold: boolean;
    sharedSkillCount: number;
    setSharedSkillCount: (count: number) => void;
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
    resizeAllSkills: (count: number) => void;
}

export function SkillsSection({ fold, sharedSkillCount, setSharedSkillCount, setCvData, resizeAllSkills }: SkillsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);
    const [competenceCount, setCompetenceCount] = useState(localStorage.getItem('competenceCount') ?? 9)
    const [hardSkillsCount, setHardSkillsCount] = useState(localStorage.getItem('hardSkillsCount') ?? 14)
    const [softSkillsCount, setSoftSkillsCount] = useState(localStorage.getItem('softSkillsCount') ?? sharedSkillCount)

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    return (
        <div className="skill-controls">
            <div className="conditionnal-section">
                <button
                    className="button-preset"
                    style={{ backgroundColor: "#621301"}}
                    type="button"
                    onClick={() => setShowDesignControls(!showDesignControls)}
                >
                    {showDesignControls ? "Masquer les options de nombre de Compétences" : "Afficher les options de nombre de Compétences"}
                </button>
            </div>
        {showDesignControls && (
            <>
            <div className="field-label">GESTION DES COMPÉTENCES</div>
            <label>
                Même nombre pour les 3 listes{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={sharedSkillCount}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);

                        setSharedSkillCount(newCount);
                        setCompetenceCount(newCount);
                        setHardSkillsCount(newCount);
                        setSoftSkillsCount(newCount);
                        resizeAllSkills(newCount);
                    
                        localStorage.setItem('sharedSkillCount', event.target.value);
                        localStorage.setItem('competenceCount', event.target.value);
                        localStorage.setItem('hardSkillsCount', event.target.value);
                        localStorage.setItem('softSkillsCount', event.target.value);
                    }}
                />
            </label>
            <label>
                Nombre de compétences{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={competenceCount}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);

                        setCvData((current) => ({
                            ...current,
                            competences: (initializeCompetences(current.competences, 'Competence', newCount) as CompetenceItem[]),
                        }));
                    
                        localStorage.setItem('competenceCount', event.target.value);
                        setCompetenceCount(newCount);
                    }}
                />
            </label>
            <label>
                Nombre de hardSkills{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={hardSkillsCount}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);

                        setCvData((current) => ({
                            ...current,
                            hardSkills: (initializeSkills(current.hardSkills, 'hardSkills', newCount)),
                        }));
                    
                        localStorage.setItem('hardSkillsCount', event.target.value);
                        setHardSkillsCount(newCount);
                    }}
                />
            </label>
            <label>
                Nombre de softSkills{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={softSkillsCount}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);

                        setCvData((current) => ({
                            ...current,
                            softSkills: (initializeSkills(current.softSkills, 'softSkills', newCount)),
                        }));
                    
                        localStorage.setItem('softSkillsCount', event.target.value);
                        setSoftSkillsCount(newCount);
                    }}
                />
            </label>
            </>
        )}
        </div>
    );
}