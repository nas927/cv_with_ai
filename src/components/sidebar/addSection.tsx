import { useEffect, useState } from 'react';
import { boolToString, toBool } from '../../lib/utils'
import { type CvDocument, type SectionOrder } from '../../types/cv';

interface AddSectionProps {
    fold: boolean;
    cvData: CvDocument
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
}

type newSection = {
    titre: string,
    date: string,
    location: string,
    text: string
}

function reorderSections(
    sectionOrder: SectionOrder[],
    draggedTitle: SectionOrder['title'],
    targetTitle: SectionOrder['title']
): SectionOrder[] {
    if (draggedTitle === targetTitle) return sectionOrder;

    const fromIndex = sectionOrder.findIndex((section) => section.title === draggedTitle);
    const toIndex = sectionOrder.findIndex((section) => section.title === targetTitle);

    if (fromIndex === -1 || toIndex === -1) return sectionOrder;

    const updated = [...sectionOrder];
    const [draggedSection] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, draggedSection);

    return updated;
}

export function AddSection({
    fold,
    cvData,
    setCvData
}: AddSectionProps) {
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);
    
    const addSection = () =>
    {
        const id = "id_" + cvData.sectionOrder.length
        setCvData((current) => ({
            ...current,
            sectionOrder: [ ...current.sectionOrder, {name: "titre", title: id, isAside: true, isVisible: true} ],
            [id]: {titre: "Titre", date: "", location: "", text: "Description"}
        }));
    }

    const updateSection = (id: string, field: keyof newSection, value: string) =>
        setCvData((current) => ({
            ...current,
            [id]: {...current[id], [field]: value},
            sectionOrder: current.sectionOrder.map(sectionO => 
                sectionO.title === id ? { ...sectionO, [field]: value } : sectionO
            )
        }));

    const updateSectionOrder = (id: string, field: keyof SectionOrder, value: string | boolean) => {
        if (field === 'isAside' || field ===  'isVisible')
            value = toBool(value as string);
        setCvData((current) => ({
            ...current,
            sectionOrder: current.sectionOrder.map((newSec) =>
                newSec.title === id ? { ...newSec, [field]: value } : newSec
            ),
        }));
    }

    const removeNewSection = (id: string) => { 
        setCvData(current => {
            const { [id]: removed, ...CvData } = current;
            return {
                ...CvData as CvDocument,
                sectionOrder: (CvData.sectionOrder as SectionOrder[]).filter(section =>
                    section.title !== id
                )
             } as CvDocument;
        });
    }
    
    return (
        <div className="fields-controls">
            <div className="conditionnal-section">
            <button
                className="button-preset"
                style={{ backgroundColor: "#ead8d4", color: 'black'}}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.color = 'white'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'black'}
                type="button"
                onClick={() => setShowDesignControls(!showDesignControls)}
            >
                {showDesignControls ? "Masquer les options de section" : "Afficher les options de section"}
            </button>
        </div>
        {showDesignControls && (
         <>
            <div className="field-label">
                SECTIONS <span className="saved-label">AUTO-SAUVEGARDÉES</span>
            </div>
            {cvData['sectionOrder'].map((section, index) => {
                if (section.title !== "design" && section.title !== "sectionOrder" && section.title !== "photo")
                return (
                    <div className="field-row" key={`newSection_${index}`}>
                        <input
                            aria-label={`nom`}
                            style={{ gridColumn: "2 span"}}
                            id='name_new_section'
                            value={section.name}
                            placeholder='titre'
                            onChange={(event) => {
                                    updateSectionOrder(section.title, 'name', event.target.value)
                                }
                            }
                        />
                        <select 
                            style={{ gridColumn: "2 span"}}
                            id='option_aside_new_section'
                            value={boolToString(section.isAside)}
                            onChange={(event) => updateSectionOrder(section.title, 'isAside', event.target.value)}
                        >
                            <option value="true">Aside</option>
                            <option value="false">Pas Aside</option>
                        </select>
                        <select 
                            style={{ gridColumn: "2 span"}}
                            id='option_aside_new_section'
                            value={boolToString(section.isVisible)}
                            onChange={(event) => updateSectionOrder(section.title, 'isVisible', event.target.value)}
                        >
                            <option value="true">Visible</option>
                            <option value="false">Pas Visible</option>
                        </select>
                        <input
                            aria-label={`date`}
                            style={{ gridColumn: "2 span"}}
                            id='option_date_new_section'
                            placeholder='Date si souhaité'
                            value={cvData[section.title]?.date ?? ''}
                            onChange={(event) => updateSection(section.title, 'date', event.target.value)}
                        />
                        <input
                            aria-label={`location`}
                            style={{ gridColumn: "2 span"}}
                            placeholder='Lieu si souhaité'
                            id='option_location_new_section'
                            value={cvData[section.title]?.location ?? ''}
                            onChange={(event) => updateSection(section.title, 'location', event.target.value)}
                        />
                        <textarea
                            aria-label={`Text`}
                            style={{ gridColumn: "2 span"}}
                            value={cvData[section.title]?.text ?? ''}
                            placeholder='Description en bas si souhaité'
                            onChange={(event) => updateSection(section.title, 'text', event.target.value)}
                        >
                        </textarea>
                        <button
                            type="button"
                            aria-label={`Supprimer ${section.title}`}
                            onClick={() => removeNewSection(section.title)}
                        >
                        ×
                        </button>
                        <button
                            type="button"
                            aria-label="Déplacer la section"
                            className='moveSection'
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData('text/sidebar-section-order', section.title);
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
                                    'text/sidebar-section-order'
                                );
                                setCvData((previousDocument) => ({
                                    ...previousDocument,
                                    sectionOrder: reorderSections(cvData['sectionOrder'], draggedId, section.title),
                                }));
                            }}
                        >
                            ☰
                        </button>
                    </div>
                )
                })}
            <button className="add-button" type="button" onClick={addSection}>
                + Ajouter une section
            </button>
         </>
        )}
    </div>
    );
}
