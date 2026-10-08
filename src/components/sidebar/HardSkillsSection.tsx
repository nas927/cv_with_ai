import { useEffect, useState } from 'react';
import type { CvDocument } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface HardSkillsSectionProps {
    fold: boolean
    hardskills: string[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function HardSkillsSection({
    fold,
    hardskills,
    setCvData
}: HardSkillsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateSkill = (index: number, value: string) =>
        setCvData((current) => ({
            ...current,
            hardSkills: current.hardSkills.map((skill, i) =>
                i === index ? value : skill
            ),
        }));
    
    const addSkill = () =>
        setCvData((current) => ({
            ...current,
            hardSkills: [...current.hardSkills, `hardskill`],
        }));
    
    const removeSkill = (index: number) =>
        setCvData((current) => ({
            ...current,
            hardSkills: current.hardSkills.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#d52700"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de Hardskill" : "Afficher les options de Hardskill"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                HardSills <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {hardskills.map((skill, index) => (
                <div className="field-row" key={`hardskill-${index}`}>
                    <input
                        aria-label={`Titre`}
                        style={{ gridColumn: "2 span"}}
                        value={skill}
                        onChange={(event) => updateSkill(index, event.target.value)}
                    />
                    <button
                        type="button"
                        aria-label={`Supprimer ${index}`}
                        onClick={() => removeSkill(index)}
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        aria-label="Déplacer la section"
                        className='moveSection'
                        draggable
                        onDragStart={(event) => {
                            event.dataTransfer.setData('text/sidebar-section-hardSkills', index.toString());
                            event.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = 'move';
                        }}
                        onDragEnter={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            const draggedId = event.dataTransfer.getData(
                                'text/sidebar-section-hardSkills'
                            );
                            reorderSections<string>(hardskills, parseInt(draggedId), index, "hardSkills", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addSkill}>
                + Ajouter une hard skills
            </button>
         </>
        )}
    </div>
    );
}
