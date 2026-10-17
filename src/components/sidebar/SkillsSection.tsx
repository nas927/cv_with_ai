import { useEffect, useState } from "react";
import { initializeSkills, initializeCompetences, filterIt } from "../../lib/utils";
import type { CompetenceItem, CvDocument } from "../../types/cv";

interface SkillsSectionProps {
    fold: boolean;
    cvData: CvDocument;
    sharedSkillCount: number;
    setSharedSkillCount: (count: number) => void;
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
    resizeAllSkills: (count: number) => void;
}

export function SkillsSection({ fold, cvData, sharedSkillCount, setSharedSkillCount, setCvData, resizeAllSkills }: SkillsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);
    const competences = filterIt(cvData.sectionOrder , 'competences')
    const softskills = filterIt(cvData.sectionOrder , 'softSkills')
    const hardskills = filterIt(cvData.sectionOrder , 'hardSkills')

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
                        
                        if (competences?.index && softskills?.index && hardskills?.index)
                            setCvData(prev => ({
                                ...prev,
                                sectionOrder: prev.sectionOrder.map((section, index) =>
                                    index === competences.index || index === softskills.index || index === hardskills.index
                                        ? {
                                              ...section,
                                              count: sharedSkillCount,
                                          }
                                        : section
                                ),
                            }));
                        setSharedSkillCount(newCount);
                        resizeAllSkills(newCount);
                    }}
                />
            </label>
            <label>
                Nombre de compétences{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={competences?.object.count}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);

                        if (competences?.index)
                            setCvData((current) => ({
                                ...current,
                                competences: (initializeCompetences(current.competences, 'Competence', newCount) as CompetenceItem[]),
                                sectionOrder: current.sectionOrder.map((section, index) =>
                                    index === competences.index
                                        ? {
                                              ...section,
                                              count: newCount,
                                          }
                                        : section
                                ),
                            }));
                    }}
                />
            </label>
            <label>
                Nombre de hardSkills{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={hardskills?.object.count}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);
                        if (hardskills?.index)
                            setCvData((current) => ({
                                ...current,
                                hardSkills: (initializeSkills(current.hardSkills, 'hardSkills', newCount)),
                                sectionOrder: current.sectionOrder.map((section, index) =>
                                    index === hardskills.index
                                        ? {
                                              ...section,
                                              count: newCount,
                                          }
                                        : section
                                ),
                            }));
                    }}
                />
            </label>
            <label>
                Nombre de softSkills{' '}
                <input
                    type="number"
                    min="0"
                    max="19"
                    value={softskills?.object.count}
                    onChange={(event) => {
                        const newCount = Number(event.target.value);
                        if (softskills?.index)
                            setCvData((current) => ({
                                ...current,
                                softSkills: (initializeSkills(current.softSkills, 'softSkills', newCount)),
                                sectionOrder: current.sectionOrder.map((section, index) =>
                                    index === softskills.index
                                        ? {
                                              ...section,
                                              count: newCount,
                                          }
                                        : section
                                ),
                            }));
                    }}
                />
            </label>
            </>
        )}
        </div>
    );
}