import { useEffect, useState } from 'react';
import type { CvDocument, Language } from '../../types/cv';
import { reorderSections } from '../../lib/utils';

interface LanguagesSectionProps {
    fold: boolean;
    languages: Language[];
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

export function LanguagesSection({
    fold,
    languages,
    setCvData
}: LanguagesSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    const updateLanguage = (index: number, field: keyof (typeof languages)[0], value: string) =>
        setCvData((current) => ({
            ...current,
            languages: current.languages.map((lang, i) =>
                i === index ? { ...lang, [field]: value } : lang
            ),
        }));
    
    const addLanguage = () =>
        setCvData((current) => ({
            ...current,
            languages: [...current.languages, { name: 'Nouvelle langue', level: 'Niveau' }],
        }));
    
    const removeLanguage = (index: number) =>
        setCvData((current) => ({
            ...current,
            languages: current.languages.filter((_, i) => i !== index),
        }));
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#561001"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de Langues" : "Afficher les options de Langues"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                LANGUES <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {languages.map((language, index) => (
                <div className="field-row" key={`lang-${index}`}>
                    <input
                        aria-label={`Nom de la langue ${index + 1}`}
                        value={language.name}
                        onChange={(event) => updateLanguage(index, 'name', event.target.value)}
                    />
                    <input
                        aria-label={`Niveau de la langue ${index + 1}`}
                        value={language.level}
                        onChange={(event) => updateLanguage(index, 'level', event.target.value)}
                    />
                    <button
                        type="button"
                        aria-label={`Supprimer ${language.name}`}
                        onClick={() => removeLanguage(index)}
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        aria-label="Déplacer la section"
                        className='moveSection'
                        draggable
                        onDragStart={(event) => {
                            event.dataTransfer.setData('text/sidebar-section-languages', index.toString());
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
                                'text/sidebar-section-languages'
                            );
                            reorderSections<Language>(languages, parseInt(draggedId), index, "languages", setCvData);
                        }}
                    >
                        ☰
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addLanguage}>
                + Ajouter une langue
            </button>
         </>
        )}
    </div>
    );
}
