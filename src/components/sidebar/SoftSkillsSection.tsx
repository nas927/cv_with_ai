import { useEffect, useState } from 'react';
import type { CvDocument } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface SoftSkillsSectionProps {
    fold: boolean
    softskills: string[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function SoftSkillsSection({
    fold,
    softskills,
    setCvData
}: SoftSkillsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateSkill = (index: number, value: string) =>
        setCvData((current) => ({
            ...current,
            softSkills: current.softSkills.map((skill, i) =>
                i === index ? value : skill
            ),
        }));
    
    const addSkill = () =>
        setCvData((current) => ({
            ...current,
            softSkills: [...current.softSkills, `softskill`],
        }));
    
    const removeSkill = (index: number) =>
        setCvData((current) => ({
            ...current,
            softSkills: current.softSkills.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#662213"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de Softskill" : "Afficher les options de Softskill"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                SoftSills <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {softskills.map((skill, index) => (
                <div className="field-row" key={`softskill-${index}`}>
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
                            event.dataTransfer.setData('text/sidebar-section-softSkills', index.toString());
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
                                'text/sidebar-section-softSkills'
                            );
                            reorderSections<string>(softskills, parseInt(draggedId), index, "softSkills", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addSkill}>
                + Ajouter une solft skills
            </button>
         </>
        )}
    </div>
    );
}
