import { useEffect, useState } from 'react';
import { defaultDesign } from '../../data/defaultCv';
import type { CvTemplate, DesignSettings } from '../../types/cv';

interface DesignSectionProps {
    fold: boolean;
    design: DesignSettings;
    templates: CvTemplate[];
    onDesignChange: (value: DesignSettings | ((current: DesignSettings) => DesignSettings)) => void;
    setTemplate: React.Dispatch<React.SetStateAction<CvTemplate[]>>
}

export function DesignSection({ fold, design, templates, onDesignChange, setTemplate }: DesignSectionProps) {
    const resetAllUsed = () => {
        setTemplate((current) =>
            current.map((template) => ({
                ...template,
                used: false
            }))
        );
    };

    const updateTemplate = (id: string) =>
    {
        resetAllUsed();
        setTemplate((current) =>
            current.map((template) => template.id == id
                    ? { ...template, used: true }
                    : template
            )
        );
    }
    const handleRangeChange = (key: keyof DesignSettings, value: number) => {
        onDesignChange((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleColorChange = (key: keyof DesignSettings, value: string) => {
        onDesignChange((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleTemplateChange = (value: string) => {
        onDesignChange((current) => ({
            ...current,
            template: value,
        }));
        updateTemplate(value);
    };

    const handleFontChange = (value: string) => {
        onDesignChange((current) => ({
            ...current,
            font: value,
        }));
    };
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    return (
        <div className="design-controls">
            <div className="conditionnal-section">
                <button
                    className="button-preset"
                    type="button"
                    onClick={() => setShowDesignControls(!showDesignControls)}
                >
                    {showDesignControls ? "Masquer les options de style": "Afficher les options de style"}
                </button>
            </div>
            {showDesignControls && (
                <>
                    <div className="field-label">
                        APPARENCE DU CV <span className="saved-label">AUTO-SAUVEGARDÉE</span>
                    </div>

                    <label>
                        Modèle de CV
                        <select value={design.template} onChange={(event) => handleTemplateChange(event.target.value)}>
                            {templates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name} · {template.description}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Police des textes
                        <select value={design.font} onChange={(event) => handleFontChange(event.target.value)}>
                            <option value="'DM Sans'">Moderne · DM Sans</option>
                            <option value="'Libre Baskerville'">Éditoriale · Libre Baskerville</option>
                            <option value="'DM Mono'">Technique · DM Mono</option>
                            <option value="Georgia">Classique · Georgia</option>
                        </select>
                    </label>

                    <RangeControl
                        label="Taille de la photo"
                        value={design.picSize}
                        min={50}
                        max={180}
                        onChange={(value) => handleRangeChange('picSize', value)}
                    />

                    <RangeControl
                        label="Taille du nom"
                        value={design.nameScale}
                        min={85}
                        max={250}
                        onChange={(value) => handleRangeChange('nameScale', value)}
                    />

                    <RangeControl
                        label="Taille du Titre"
                        value={design.titleScale}
                        min={85}
                        max={120}
                        onChange={(value) => handleRangeChange('titleScale', value)}
                    />

                    <RangeControl
                        label="Taille du texte"
                        value={design.textScale}
                        min={85}
                        max={120}
                        onChange={(value) => handleRangeChange('textScale', value)}
                    />

                    <RangeControl
                        label="Taille des titres"
                        value={design.headingScale}
                        min={85}
                        max={125}
                        onChange={(value) => handleRangeChange('headingScale', value)}
                    />

                    <RangeControl
                        label="Espacement des rubriques"
                        value={design.sectionSpacing}
                        min={0}
                        max={140}
                        onChange={(value) => handleRangeChange('sectionSpacing', value)}
                    />

                    <RangeControl
                        label="Espacement entre les blocs"
                        value={design.blockSpacing}
                        min={0}
                        max={180}
                        onChange={(value) => handleRangeChange('blockSpacing', value)}
                    />

                    <RangeControl
                        label="Interligne"
                        value={design.lineHeight}
                        min={80}
                        max={180}
                        onChange={(value) => handleRangeChange('lineHeight', value)}
                    />

                    <div className="color-row">
                        <label>
                            Couleur d'accent
                            <input
                                type="color"
                                value={design.accent}
                                onChange={(event) => handleColorChange('accent', event.target.value)}
                            />
                        </label>
                        <label>
                            Couleur du texte
                            <input
                                type="color"
                                value={design.ink}
                                onChange={(event) => handleColorChange('ink', event.target.value)}
                            />
                        </label>
                    </div>

                    <button className="reset-design" type="button" onClick={() => onDesignChange(defaultDesign)}>
                        Réinitialiser le style
                    </button>
                </>
            )}
        </div>
    );
}

interface RangeControlProps {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}

function RangeControl({ label, value, min, max, onChange }: RangeControlProps) {
    return (
        <label>
            {label} <output>{value}</output>
            <input
                type="range"
                min={min}
                max={max}
                step="5"
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
            />
        </label>
    );
}
