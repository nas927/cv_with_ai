import { useEffect, useState } from 'react';
import type { CvDocument, CompetenceItem } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface CompetencesSectionProps {
    fold: boolean
    competences: CompetenceItem[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function CompetencesSection({
    fold,
    competences,
    setCvData
}: CompetencesSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateSkill = (index: number, field: keyof CompetenceItem, value: string) =>
        setCvData((current) => ({
            ...current,
            competences: current.competences.map((skill, i) =>
                i === index ? { ...skill, [field]: value } : skill
            ),
        }));
    
    const addSkill = () =>
        setCvData((current) => ({
            ...current,
            competences: [...current.competences, { name: 'Nouvelle compétence', text: 'text' }],
        }));
    
    const removeSkill = (index: number) =>
        setCvData((current) => ({
            ...current,
            competences: current.competences.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#644c47"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de Compétence" : "Afficher les options de Compétence"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                Compétences <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {competences.map((skill, index) => (
                <div className="field-row draggable-aside-section" key={`competences-${index}`}>
                    <input
                        aria-label={`name`}
                        style={{ gridColumn: "2 span"}}
                        value={skill.name}
                        onChange={(event) => updateSkill(index, "name", event.target.value)}
                    />
                    <textarea
                        aria-label={`text`}
                        style={{ gridColumn: "2 span"}}
                        onChange={(event) => updateSkill(index, "text", event.target.value)}
                        value={skill.text}
                    >
                    </textarea>
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
                            event.dataTransfer.setData('text/sidebar-section-competences', index.toString());
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
                                'text/sidebar-section-competences'
                            );
                            reorderSections<CompetenceItem>(competences, parseInt(draggedId), index, "competences", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addSkill}>
                + Ajouter une compétence
            </button>
         </>
        )}
    </div>
    );
}
