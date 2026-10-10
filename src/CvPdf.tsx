import React, { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type {
    CvDocument,
    SectionOrder,
} from './types/cv';
import { Mail, Phone, Cake, Globe, MapPin, Languages, Car } from "lucide-react";

type ContactItem = {
    icon: ReactNode;
    value: string;
};

// ---------------------------------------------------------------------------
// Réordonnancement (drag & drop)
// ---------------------------------------------------------------------------

// Déplace la section "draggedTitle" à la position de la section "targetTitle"
// dans le tableau sectionOrder, en conservant tout le reste inchangé.
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

type OnSectionDrop = (draggedId: SectionOrder['title'], targetId: SectionOrder['title']) => void;

function DraggableSection({
    id,
    children,
    onSectionDrop,
}: {
    id: SectionOrder['title'];
    children: ReactNode;
    onSectionDrop: OnSectionDrop;
}) {
    const [isDragOver, setIsDragOver] = useState(false);

    return (
        <div
            className={`draggable-section${isDragOver ? ' is-drag-over' : ''}`}
            draggable
            onDragStart={(event) => {
                event.dataTransfer.setData('text/cv-sidebar-section', id);
                event.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                if (!isDragOver) setIsDragOver(true);
            }}
            onDragEnter={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragOver(false);
                const draggedId = event.dataTransfer.getData(
                    'text/cv-sidebar-section'
                ) as SectionOrder['title'];
                if (draggedId && draggedId !== id)
                    onSectionDrop(draggedId, id);
            }}
        >
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Rendu du contenu d'une section, indépendamment de sa page / colonne
// ---------------------------------------------------------------------------

// Rendu des sections qui vont dans la colonne "aside" (sidebar).
function renderAsideSection(section: SectionOrder, document: CvDocument): ReactNode {
    const { profile, hardSkills, languages, softSkills, realizations, interests } = document;
    const contactItems: ContactItem[] = [
        profile.email && {
            icon: <Mail size={12} />,
            value: profile.email,
        },
        profile.age && {
            icon: <Cake size={12} />,
            value: `${profile.age} ans`,
        },
        profile.website && {
            icon: <Globe size={12} />,
            value: profile.website,
        },
        profile.permis && {
            icon: <Car size={12} />,
            value: profile.permis,
        },
        profile.language && {
            icon: <Languages size={12} />,
            value: profile.language,
        },
        (profile.region || profile.city) && {
            icon: <MapPin size={12} />,
            value: `${profile.region} · ${profile.city}`,
        },
        profile.phone && {
            icon: <Phone size={12} />,
            value: profile.phone,
        },
    ].filter(Boolean) as ContactItem[];

    switch (section.title) {
        case 'about':
            return section.isVisible && (
                <section className="side-section">
                    <h4>{section.name}</h4>
                    {
                    contactItems
                    .map((item, index) => (
                        <div className="about-items" key={index}>
                            {item.icon}
                            <span>{item.value}</span>
                        </div>          
                    ))}

                </section>
            );
        case 'languages':
            return section.isVisible && (
                <section className="side-section">
                    <h4>{section.name}</h4>
                    {languages.map((language, index) => (
                        <p key={`${language.name}-${index}`}>
                            <span suppressContentEditableWarning>{language.name}</span>{' '}
                            <b suppressContentEditableWarning>{language.level}</b>
                        </p>
                    ))}
                </section>
            );
        case 'hardSkills':
            return section.isVisible && (
                <section className="side-section sidebar-skills">
                    <h4>{section.name}</h4>
                    {hardSkills.map((skill, index) => (
                        <p key={`${skill}-${index}`} suppressContentEditableWarning>
                            {skill}
                        </p>
                    ))}
                </section>
            );
        case 'softSkills':
            return section.isVisible && (
                <section className="side-section sidebar-skills">
                    <h4>{section.name}</h4>
                    {softSkills.map((skill, index) => (
                        <p key={`${skill}-${index}`} suppressContentEditableWarning>
                            {skill}
                        </p>
                    ))}
                </section>
            );
        case 'realizations':
            return section.isVisible && (
                <section className="side-section realization-section">
                    <h4>{section.name}</h4>
                    {realizations.map((real, index) => (
                        <p key={`${real.text}-${index}`} suppressContentEditableWarning>
                            {real.text}
                        </p>
                    ))}
                </section>
            );
        case 'interests':
            return section.isVisible && (
                <section className="side-section interests-section">
                    <h4>{section.name}</h4>
                    {interests.map((interest, index) => (
                        <p key={`${interest.text}-${index}`} suppressContentEditableWarning>
                            {interest.text}
                        </p>
                    ))}
                </section>
            );
        default:
            return section.isVisible && (
                <section className={'side-section ' + section.title + '-section'}>
                    <h4>{section.name}</h4>
                    <p>
                        {document[section.title]?.text ?? ''}
                    </p>
                </section>
            );
    }
}

// Rendu des sections qui vont dans la colonne principale (contenu).
function renderMainSection(section: SectionOrder, document: CvDocument): ReactNode {
    const { experiences, education, competences, hardSkills } = document;

    switch (section.title) {
        case 'educations':
            return section.isVisible && (
                <>
                    <h3 className="cv-section-title">{section.name}</h3>
                    <div className="education-list">
                        {education.map((item, index) => (
                            <div className="education-item" key={`${item.title}-${index}`}>
                                <strong suppressContentEditableWarning>{item.title}</strong>
                                <div>
                                    <span suppressContentEditableWarning>{item.date}</span>
                                </div>
                                <b suppressContentEditableWarning>{item.location}</b>
                                <p suppressContentEditableWarning>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </>
            );
        case 'competences':
            return section.isVisible && (
                <>
                    <h3 className="cv-section-title">{section.name}</h3>
                    <div className="competence-list">
                        {competences.map((item, index) => (
                            <div className="competence-row" key={`${item.name}-${index}`}>
                                <strong suppressContentEditableWarning>{item.name}</strong>
                                <p suppressContentEditableWarning>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </>
            );
        case 'hardSkills':
            return section.isVisible && (
                <>
                    <h3 className="cv-section-title">{section.name}</h3>
                    <div className="hardSkills-list">
                        {hardSkills.map((item, index) => (
                            <div className="hardSkills-row" key={`previewHardSkills-${index}`}>
                                    <p suppressContentEditableWarning>
                                        <strong suppressContentEditableWarning>
                                            {item}
                                        </strong>
                                    </p>
                            </div>
                        ))}
                    </div>
                </>
            );
        case 'experiences':
            return section.isVisible && (
                <>
                    <h3 className="cv-section-title">{section.name}</h3>
                    <div className="experience-list">
                        {experiences.map((item, index) => (
                            <div className="experience-item" key={`${item.company}-${index}`}>
                                <div className="experience-heading">
                                    <strong suppressContentEditableWarning>{item.role}</strong>
                                    <span suppressContentEditableWarning>{item.date}</span>
                                </div>
                                <b suppressContentEditableWarning>{item.company}</b>
                                <small suppressContentEditableWarning>{item.location}</small>
                                <p suppressContentEditableWarning>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </>
            );
        default:
            return section.isVisible && (
                <section className={'side-section ' + section.title + '-section'}>
                    <h4 id="cv-section-title">{section.name}</h4>
                    <div className="cv-section-list">
                        <div className="cv-section-items">
                            <div className="cv-section-heading">
                            <small suppressContentEditableWarning>{document[section.title]?.location ?? ''}</small>
                                <span suppressContentEditableWarning>{document[section.title]?.date ?? ''}</span>
                            </div>
                            <p suppressContentEditableWarning>{document[section.title]?.text ?? ''}</p>
                        </div>
                    </div>
                </section>
            );
    }
}

// ---------------------------------------------------------------------------
// Pagination automatique en fonction de section.isAside et de la hauteur réelle
// ---------------------------------------------------------------------------

type SectionHeights = Record<string, number>;

type PagePlan = {
    aside: SectionOrder[];
    main: SectionOrder[];
};

// Sépare les sections aside / contenu principal en respectant l'ordre du
// tableau sectionOrder, en s'appuyant uniquement sur section.isAside.
function splitByAside(sectionOrder: SectionOrder[]) {
    const aside: SectionOrder[] = [];
    const main: SectionOrder[] = [];
    sectionOrder.forEach((section) => (section.isAside ? aside : main).push(section));
    return { aside, main };
}

// Construit la liste des pages : répartit les sections aside et les sections
// principales dans des pages successives, sans jamais dépasser la hauteur
// disponible d'une colonne (mesurée dans le DOM). "reservedFirstPage..."
// représente la place déjà prise par l'en-tête / le résumé de profil, qui ne
// sont affichés que sur la première page.
function buildPagePlan(
    asideSections: SectionOrder[],
    mainSections: SectionOrder[],
    heights: SectionHeights,
    maxAsideHeight: number,
    maxMainHeight: number,
    reservedFirstPageAsideHeight: number,
    reservedFirstPageMainHeight: number
): PagePlan[] {
    const pages: PagePlan[] = [];
    let asideIndex = 0;
    let mainIndex = 0;

    do {
        const isFirstPage = pages.length === 0;
        const page: PagePlan = { aside: [], main: [] };

        let asideHeightUsed = isFirstPage ? reservedFirstPageAsideHeight : 0;
        while (asideIndex < asideSections.length) {
            const section = asideSections[asideIndex];
            const height = heights[section.title] ?? 0;
            // On dépasserait la hauteur disponible : on garde la section pour
            // la page suivante (sauf si la page est encore vide, pour éviter
            // qu'une section plus grande qu'une page entière ne bloque tout).
            if (asideHeightUsed + height > maxAsideHeight && page.aside.length > 0) break;
            page.aside.push(section);
            asideHeightUsed += height;
            asideIndex++;
        }

        let mainHeightUsed = isFirstPage ? reservedFirstPageMainHeight : 0;
        while (mainIndex < mainSections.length) {
            const section = mainSections[mainIndex];
            const height = heights[section.title] ?? 0;
            console.log(mainHeightUsed + height, maxMainHeight)
            if (mainHeightUsed + height > maxMainHeight && page.main.length > 0) break;
            page.main.push(section);
            mainHeightUsed += height;
            mainIndex++;
        }

        pages.push(page);
    } while (asideIndex < asideSections.length || mainIndex < mainSections.length);

    return pages;
}

// ---------------------------------------------------------------------------
// Rendu d'une page
// ---------------------------------------------------------------------------

// Variables CSS dérivées du design : DOIVENT être appliquées aussi bien sur
// les pages réelles que sur le bloc de mesure invisible, sinon la hauteur
// mesurée des sections ne correspond pas à la taille de police / interligne
// réellement configurés (bug : la mesure utilisait les valeurs par défaut du
// navigateur au lieu du design du CV, faussant la pagination).
function buildPaperStyle(design: CvDocument['design']): CSSProperties {
    return {
        '--cv-name-scale': design.nameScale / 100,
        '--cv-title-scale': design.titleScale / 100,
        '--cv-text-scale': design.textScale / 100,
        '--cv-heading-scale': design.headingScale / 100,
        '--cv-section-spacing': design.sectionSpacing / 100,
        '--cv-block-spacing': design.blockSpacing / 100,
        '--cv-line-height': design.lineHeight / 100,
        '--cv-font': design.font,
        '--cv-accent': design.accent,
        '--cv-ink': design.ink,
    } as CSSProperties;
}

function CvPage({
    document,
    plan,
    pageIndex,
    totalPages,
    atsPrompt,
    onSectionDrop,
}: {
    document: CvDocument;
    plan?: PagePlan;
    pageIndex: number;
    totalPages: number;
    atsPrompt: string;
    onSectionDrop: OnSectionDrop;
}) {
    const { profile, photo, design } = document;
    const isFirstPage = pageIndex === 0;
    const paperStyle = buildPaperStyle(design);

    return (
        <section className={`cv-paper cv-template-${design.template} pdf-page`} style={paperStyle}>
            <aside className="cv-sidebar">
                {isFirstPage && (
                    <>
                        <div
                            className="paper-photo"
                            style={{ width: design.picSize + 'px', height: design.picSize + 'px' }}
                        >
                            {photo ? (
                                <img src={photo} alt="Portrait du profil" />
                            ) : (
                                <span>{profile.initials}</span>
                            )}
                        </div>
                        <h2 id="nameScale" suppressContentEditableWarning>
                        {profile.name.split(' ').map((part, index) => (
                            <span key={index}>
                                {part}
                                <br />
                            </span>
                        ))}
                        </h2>
                        <h3 className="paper-title" suppressContentEditableWarning>
                            {profile.title}
                        </h3>
                    </>
                )}
                {plan?.aside.map((section) => (
                    <DraggableSection key={section.title} id={section.title} onSectionDrop={onSectionDrop}>
                        {renderAsideSection(section, document)}
                    </DraggableSection>
                ))}
            </aside>
            <div className="cv-content">
                {isFirstPage && (
                    <p className="profile-summary" suppressContentEditableWarning>
                        {profile.about}
                    </p>
                )}
                {plan?.main.map((section) => (
                    <DraggableSection key={section.title} id={section.title} onSectionDrop={onSectionDrop}>
                        {renderMainSection(section, document)}
                    </DraggableSection>
                ))}
            </div>
            <p className='ats_coutournement'>{atsPrompt}</p>
            <div className="page-number">
                <span>Page {pageIndex + 1} / {totalPages}</span>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Composant racine
// ---------------------------------------------------------------------------

export function CvHtml({
    document,
    zoom,
    pageNumber,
    atsPrompt,
    setCvData,
    setPageCount,
}: {
    document: CvDocument;
    zoom: number;
    pageNumber: number;
    atsPrompt: string;
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
    setPageCount?: (pageCount: number) => void;
}) {
    const [isVisibleButton, setIsVisibleButton] = useState(window.innerWidth > 650 ? true : false);
    const [pagePlan, setPagePlan] = useState<PagePlan[] | null>(null);

    const measureRootRef = useRef<HTMLDivElement>(null);
    const emptyAsideRef = useRef<HTMLDivElement>(null);
    const emptyMainRef = useRef<HTMLDivElement>(null);

    const handleSectionDrop: OnSectionDrop = (draggedId, targetId) => {
        setCvData((previousDocument) => ({
            ...previousDocument,
            sectionOrder: reorderSections(previousDocument.sectionOrder, draggedId, targetId),
        }));
    };

    
    const { aside: allAsideSections, main: allMainSections } = splitByAside(document.sectionOrder);
    // Mesure la hauteur réelle de chaque section (rendues sans limite de
    // hauteur) ainsi que la hauteur disponible d'une page vide, puis calcule
    // la pagination. Se relance à chaque changement du CV (texte, ordre...).
    useLayoutEffect(() => {
        const root = measureRootRef.current;
        if (!root) return;
        
        const heights: SectionHeights = {};
        root.querySelectorAll<HTMLElement>('[data-measure-title]').forEach((node) => {
            const title = node.dataset.measureTitle as string;
            heights[title] = node.offsetHeight;
        });

        const maxAsideHeight = 850;
        const maxMainHeight = 870;
        
        const plan = buildPagePlan(
            allAsideSections,
            allMainSections,
            heights,
            maxAsideHeight,
            maxMainHeight,
            heights['__header__'] ?? 0,
            heights['__summary__'] ?? 0
        );

        setPagePlan(plan);
        setPageCount?.(plan.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisibleButton, document]);

    if (!isVisibleButton) {
        return (
            <button className="isVisible-button" onClick={() => setIsVisibleButton(true)}>
                Montrer le cv
            </button>
        );
    }

    // Tant que la mesure n'a pas encore eu lieu (premier rendu), on affiche
    // une estimation naïve (tout sur une page) pour éviter un flash à vide.
    const displayedPlan =
        pagePlan ?? [{ aside: allAsideSections, main: allMainSections }].slice(0, Math.max(pageNumber, 1));

    return (
        <>
            <div
                id="cv-document"
                className="cv-document"
                style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                }}
            >
            {displayedPlan.map((plan, index) => {
                    return (
                        <CvPage
                            key={index}
                            atsPrompt={atsPrompt}
                            document={document}
                            plan={plan}
                            pageIndex={index}
                            totalPages={pageNumber}
                            onSectionDrop={handleSectionDrop}
                        />
                    );
            })}
            {Array.from({ length: pageNumber}, (_, index) => {
                if (index >= displayedPlan.length)    
                    return (
                        <CvPage
                            key={index}
                            atsPrompt={atsPrompt}
                            document={document}
                            pageIndex={index}
                            totalPages={pageNumber}
                            onSectionDrop={handleSectionDrop}
                        />
                    );
            })}
            </div>

            {/*
                Bloc de mesure invisible (visibility:hidden, jamais display:none
                pour rester "layoutable"). Il sert à connaître :
                - la hauteur réelle de chaque section si elle n'était pas contrainte,
                - la hauteur disponible d'une page vide (imposée par le CSS externe
                  de .cv-sidebar / .cv-content).
                Ces deux mesures permettent de répartir les sections page par page
                sans jamais dépasser la hauteur d'une page.
            */}
            <div
                ref={measureRootRef}
                aria-hidden
                style={{ position: 'absolute', top: 0, left: -99999, visibility: 'hidden', pointerEvents: 'none' }}
            >
                <section
                    className={`cv-paper cv-template-${document.design.template} pdf-page`}
                    style={{ ...buildPaperStyle(document.design), height: 'auto', minHeight: 0, overflow: 'visible' }}
                >
                    <aside className="cv-sidebar" style={{ height: 'auto', overflow: 'visible' }}>
                        <div data-measure-title="__header__">
                            <div
                                className="paper-photo"
                                style={{
                                    width: document.design.picSize + 'px',
                                    height: document.design.picSize + 'px',
                                }}
                            >
                                {document.photo ? (
                                    <img src={document.photo} alt="photo de profile" />
                                ) : (
                                    <span>{document.profile.initials}</span>
                                )}
                            </div>
                            <h2>{document.profile.name}</h2>
                            <h3 className="paper-title">{document.profile.title}</h3>
                        </div>
                        {allAsideSections.map((section) => (
                            <div key={section.title} data-measure-title={section.title}>
                                {renderAsideSection(section, document)}
                            </div>
                        ))}
                    </aside>
                    <div className="cv-content" style={{ height: 'auto', overflow: 'visible' }}>
                        <p data-measure-title="__summary__" className="profile-summary">
                            {document.profile.about}
                        </p>
                        {allMainSections.map((section) => (
                            <div key={section.title} data-measure-title={section.title}>
                                {renderMainSection(section, document)}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Page vide de référence : donne la hauteur max réelle d'une colonne.
                    On applique aussi le design (spacing, etc.) car le padding des
                    colonnes peut dépendre de --cv-section-spacing / --cv-block-spacing. */}
                <section
                    className={`cv-paper cv-template-${document.design.template} pdf-page`}
                    style={buildPaperStyle(document.design)}
                >
                    <aside className="cv-sidebar" ref={emptyAsideRef} />
                    <div className="cv-content" ref={emptyMainRef} />
                </section>
            </div>
        </>
    );
}