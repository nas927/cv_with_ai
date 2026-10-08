import { useEffect, useState } from 'react';
import type { CvDocument, Interests } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface InterestsSectionProps {
    fold: boolean
    interests: Interests[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function InterestsSection({
    fold,
    interests,
    setCvData
}: InterestsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateInterest = (index: number, field: keyof Interests, value: string) =>
        setCvData((current) => ({
            ...current,
            interests: current.interests.map((interest, i) =>
                i === index ? { ...interest, [field]: value } : interest
            ),
        }));
    
    const addInterest = () =>
        setCvData((current) => ({
            ...current,
            interests: [...current.interests, { title: 'Titre', text: 'Une description'}],
        }));
    
    const removeInterest = (index: number) =>
        setCvData((current) => ({
            ...current,
            interests: current.interests.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#994f40"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de centre d'Intérêt" : "Afficher les options de centre d'Intérêt"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                Centre d'intérêt <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {interests.map((interest, index) => (
                <div className="field-row" key={`interest-${index}`}>
                    <input
                        aria-label={`text`}
                        style={{ gridColumn: "2 span"}}
                        value={interest.text}
                        onChange={(event) => updateInterest(index, "text", event.target.value)}
                    />
                    <button
                        type="button"
                        aria-label={`Supprimer ${index}`}
                        onClick={() => removeInterest(index)}
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        aria-label="Déplacer la section"
                        className='moveSection'
                        draggable
                        onDragStart={(event) => {
                            event.dataTransfer.setData('text/sidebar-section-interests', index.toString());
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
                                'text/sidebar-section-interests'
                            );
                            reorderSections<Interests>(interests, parseInt(draggedId), index, "interests", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addInterest}>
                + Ajouter un centre d'intérêt
            </button>
         </>
        )}
    </div>
    );
}
