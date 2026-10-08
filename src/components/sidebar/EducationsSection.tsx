import { useEffect, useState } from 'react';
import type { Education, CvDocument } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface EducationsSectionProps {
    fold: boolean
    educations: Education[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function EducationsSection({
    fold,
    educations,
    setCvData
}: EducationsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateEducation = (index: number, field: keyof Education, value: string) =>
        setCvData((current) => ({
            ...current,
            education: current.education.map((educ, i) =>
                i === index ? { ...educ, [field]: value } : educ
            ),
        }));
    
    const addEducation = () =>
        setCvData((current) => ({
            ...current,
            education: [...current.education, { title: 'Titre', location: 'Lieu', date: 'aujourd\'hui', text: 'Une description'}],
        }));
    
    const removeEducation = (index: number) =>
        setCvData((current) => ({
            ...current,
            education: current.education.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#752e1e"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de Formation" : "Afficher les options de Formation"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                FORMATIONS <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {educations.map((educ, index) => (
                <div className="field-row" key={`educations-${index}`}>
                    <input
                        aria-label={`Titre`}
                        style={{ gridColumn: "2 span"}}
                        value={educ.title}
                        onChange={(event) => updateEducation(index, 'title', event.target.value)}
                    />
                    <input
                        aria-label={`Lieu`}
                        value={educ.location}
                        onChange={(event) => updateEducation(index, 'location', event.target.value)}
                    />
                    <input
                        style={{ gridColumn: "2 span"}}
                        aria-label={`Date`}
                        value={educ.date}
                        onChange={(event) => updateEducation(index, 'date', event.target.value)}
                    />
                    <textarea aria-label={`Lieu`}
                        onChange={(event) => updateEducation(index, 'text', event.target.value)}
                        value={educ.text}
                    >
                    </textarea>
                    <button
                        type="button"
                        aria-label={`Supprimer ${educ.title}`}
                        onClick={() => removeEducation(index)}
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        aria-label="Déplacer la section"
                        className='moveSection'
                        draggable
                        onDragStart={(event) => {
                            event.dataTransfer.setData('text/sidebar-section-educations', index.toString());
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
                                'text/sidebar-section-educations'
                            );
                            reorderSections<Education>(educations, parseInt(draggedId), index, "education", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addEducation}>
                + Ajouter une formation
            </button>
         </>
        )}
    </div>
    );
}
