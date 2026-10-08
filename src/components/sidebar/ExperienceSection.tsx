import { useEffect, useState } from 'react';
import type { Experience, CvDocument } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface ExperienceSectionProps {
    fold: boolean
    experiences: Experience[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function ExperienceSection({
    fold,
    experiences,
    setCvData
}: ExperienceSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateExperience = (index: number, field: keyof (typeof experiences)[0], value: string) =>
        setCvData((current) => ({
            ...current,
            experiences: current.experiences.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            ),
        }));
    
    const addExperience = () =>
        setCvData((current) => ({
            ...current,
            experiences: [...current.experiences, { role: 'Titre', company: 'Nouvelle entreprise', location: 'Lieu', date: 'aujourd\'hui', text: 'Une description'}],
        }));
    
    const removeExperience = (index: number) =>
        setCvData((current) => ({
            ...current,
            experiences: current.experiences.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#e1674b"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options d'Expérience" : "Afficher les options d'Expérience"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                EXPERIENCES <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {experiences.map((exp, index) => (
                <div className="field-row" key={`exp-${index}`}>
                    <input
                        aria-label={`Titre`}
                        style={{ gridColumn: "2 span"}}
                        value={exp.role}
                        onChange={(event) => updateExperience(index, 'role', event.target.value)}
                    />
                    <input
                        aria-label={`Entreprise`}
                        value={exp.company}
                        onChange={(event) => updateExperience(index, 'company', event.target.value)}
                    />
                    <input
                        aria-label={`Lieu`}
                        value={exp.location}
                        onChange={(event) => updateExperience(index, 'location', event.target.value)}
                    />
                    <input
                        style={{ gridColumn: "2 span"}}
                        aria-label={`Date`}
                        value={exp.date}
                        onChange={(event) => updateExperience(index, 'date', event.target.value)}
                    />
                    <textarea aria-label={`Lieu`}
                        onChange={(event) => updateExperience(index, 'text', event.target.value)}
                        value={exp.text}
                    >
                    </textarea>
                    <button
                        type="button"
                        aria-label={`Supprimer ${exp.company}`}
                        onClick={() => removeExperience(index)}
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        aria-label="Déplacer la section"
                        className='moveSection'
                        draggable
                        onDragStart={(event) => {
                            event.dataTransfer.setData('text/sidebar-section-experiences', index.toString());
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
                                'text/sidebar-section-experiences'
                            );
                            reorderSections<Experience>(experiences, parseInt(draggedId), index, "experiences", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addExperience}>
                + Ajouter une expérience
            </button>
         </>
        )}
    </div>
    );
}
