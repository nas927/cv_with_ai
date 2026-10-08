import { useEffect, useState } from 'react';
import type { CvDocument, Experience } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface RealisationsSectionProps {
    fold: boolean
    realizations: Experience[],
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function RealisationsSection({
    fold,
    realizations,
    setCvData
}: RealisationsSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateRealisation = (index: number, field: keyof Experience, value: string) =>
        setCvData((current) => ({
            ...current,
            realizations: current.realizations.map((real, i) =>
                i === index ? { ...real, [field]: value } : real
            ),
        }));
    
    const addRealisation = () =>
        setCvData((current) => ({
            ...current,
            realizations: [...current.realizations, { role: 'Titre', company: 'Nouvelle entreprise', location: 'Lieu', date: 'aujourd\'hui', text: 'Une description'}],
        }));
    
    const removeRealisation = (index: number) =>
        setCvData((current) => ({
            ...current,
            realizations: current.realizations.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#efa293"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de Réalisation" : "Afficher les options de Réalisations"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                Réalisations <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {realizations.map((real, index) => (
                <div className="field-row" key={`realisation-${index}`}>
                    <input
                        aria-label={`text`}
                        style={{ gridColumn: "2 span"}}
                        value={real.text}
                        onChange={(event) => updateRealisation(index, "text", event.target.value)}
                    />
                    <button
                        type="button"
                        aria-label={`Supprimer ${index}`}
                        onClick={() => removeRealisation(index)}
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        aria-label="Déplacer la section"
                        className='moveSection'
                        draggable
                        onDragStart={(event) => {
                            event.dataTransfer.setData('text/sidebar-section-realizations', index.toString());
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
                                'text/sidebar-section-realizations'
                            );
                            reorderSections<Experience>(realizations, parseInt(draggedId), index, "realizations", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addRealisation}>
                + Ajouter une réalisation
            </button>
         </>
        )}
    </div>
    );
}
