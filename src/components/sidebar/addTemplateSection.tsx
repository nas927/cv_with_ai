import { useEffect, useState } from 'react';
import type { CvTemplate } from '../../types/cv';

interface TemplatesSectionProps {
    fold: boolean;
    templates: CvTemplate[];
    setTemplate: React.Dispatch<React.SetStateAction<CvTemplate[]>>;
}

export function TemplatesSection({
    fold,
    templates,
    setTemplate
}: TemplatesSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);
    
    const addTemplate = () =>
        setTemplate((current) => [
        ...current, 
        { id: 'identifiant', name: 'nom du template', description: 'description', used: false, css: ''},
    ]);

    const resetAllUsed = () => {
        setTemplate((current) =>
            current.map((template) => ({
                ...template,
                used: false
            }))
        );
    };

    const updateTemplate = (index: number, field: keyof CvTemplate, value: string) =>
    {
        if (field === 'used' && value === 'true')
            resetAllUsed();
        setTemplate((current) =>
            current.map((template, i) =>
                i === index
                    ? { ...template, [field]: value }
                    : template
            )
        );
    }

    const removeTemplate = (index: number) =>
        setTemplate((current) => 
            current.filter((_, i) => i !== index),
        );
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#1c1615"}}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de template" : "Afficher les options de template"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                TEMPLATES <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {templates.map((template, index) => (
                <div className="field-row" key={`templates-${index}`}>
                    <input
                        aria-label={`identifiant du template ${index + 1}`}
                        value={template.id}
                        onChange={(event) => updateTemplate(index, 'id', event.target.value)}
                    />
                    <input
                        aria-label={`Nom du template ${index + 1}`}
                        value={template.name}
                        onChange={(event) => updateTemplate(index, 'name', event.target.value)}
                    />
                    <input
                        aria-label={`Description du template ${index + 1}`}
                        value={template.description}
                        onChange={(event) => updateTemplate(index, 'description', event.target.value)}
                    />
                    <select 
                        style={{ gridColumn: "2 span"}}
                        onChange={(event) => updateTemplate(index, 'used', event.target.value)}
                        value={String(template.used)}
                    >
                        <option value="true">Utilisé</option>
                        <option value="false">Pas Utilisé</option>
                    </select>
                    <textarea
                        aria-label={`css`}
                        style={{ gridColumn: "2 span"}}
                        onChange={(event) => updateTemplate(index, "css", event.target.value)}
                        value={template.css}
                    >
                    </textarea>
                    <button
                        type="button"
                        aria-label={`Supprimer ${template.id}`}
                        onClick={() => removeTemplate(index)}
                    >
                        ×
                    </button>
                </div>
            ))}
            <button className="add-button" type="button" onClick={addTemplate}>
                + Ajouter une template
            </button>
         </>
        )}
    </div>
    );
}
