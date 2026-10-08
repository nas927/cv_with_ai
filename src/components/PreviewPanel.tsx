import { CvHtml } from '../CvPdf';
import { emptyCvSchema, type CvDocument, type ImportantCv } from '../types/cv';
import { exportPdf, loadPDF } from '../lib/pdf';
import { type AiCvResponse, fetchAI } from '../lib/ai';
import { useState } from 'react';
import { checkIsArrayAndExist, updateClipboard } from '../lib/utils';

type cvLoadData = {
    text: string,
    pages: number
}

interface PreviewPanelProps {
    keyGroq: string;
    cvData: CvDocument;
    design: CvDocument['design'];
    zoom: number;
    optimizationMessage: string;
    isGenerating: boolean;
    aiResponse: AiCvResponse | string;
    dbResponse: any[];
    notReadyDataDB: boolean;
    pageNumber: number;
    database: IDBDatabase | null; 
    language: 'fr' | 'en';
    atsPrompt: string;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
    setFiveEntries: (entries: any[]) => void;
    setPageNumber: (pageNumber: number) => void;
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>;
    resetSkills: () => void;
}

export function PreviewPanel({
    keyGroq,
    cvData,
    zoom,
    optimizationMessage,
    isGenerating,
    aiResponse,
    dbResponse,
    notReadyDataDB,
    pageNumber,
    database,
    language,
    atsPrompt,
    onZoomIn,
    onZoomReset,
    onZoomOut,
    setFiveEntries,
    setPageNumber,
    setCvData,
    resetSkills
}: PreviewPanelProps) {
    const [loadedCv, setLoadedCv] = useState<cvLoadData[] | [] | string >([]);
    const [cvLoading, setCvLoading] = useState(false);
    const [loadAiResponseLM , setLoadAiResponseLM] = useState(false);
    const [aiResponseLM , setAiResponseLM] = useState("");
    const [cvGenerating, setCvGenerating] = useState(false);

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setCvLoading(true);
      
        if (!file) return;
      
        loadPDF(file)
        .then(async (data) => {
            const userPrompt = `
                Tu es un moteur d'extraction de CV expert. Tu dois analyser le texte d'un CV et le structurer en JSON strict.

                SCHÉMA DE SORTIE (respecte exactement ces 9 clés, aucune de plus, aucune de moins) :

                ${JSON.stringify(emptyCvSchema, null, 2)}

                ────────────────────────────────
                DÉFINITION DE CHAQUE CLÉ
                ────────────────────────────────

                1. "profile" — objet unique
                { name, job, title, email, age, website, permis, language, region, city, phone, about, initials }
                - Toutes les valeurs sont des strings. Si une info est absente dans le CV -> "".
                - "job" : peut rester "" si non trouvé, ne pas le déduire.
                - "title" : si absent, déduis un titre professionnel court et cohérent à partir des expériences/formations (ex: "Développeur Web Junior").
                - "about" : si absent, génère un résumé neutre de 1-2 phrases basé sur le profil (expériences + compétences), sans inventer de faits non présents.
                - "initials" : déduis-les du nom complet (ex: "Jean Dupont" -> "JD").

                2. "hardSkills" — tableau de strings
                Compétences techniques concrètes : langages, logiciels, outils, méthodes, certifications techniques.
                Ex: "Python", "Photoshop", "SEO", "Excel avancé".

                3. "softSkills" — tableau de strings
                Qualités comportementales et relationnelles.
                Ex: "communication", "travail d'équipe", "gestion du stress".

                4. "competences" — tableau d'objets { name, text }
                Savoir-faire métier plus larges, ni un outil précis (hardSkills) ni un trait de caractère (softSkills).
                - "name" : intitulé court de la compétence (ex: "Gestion de projet").
                - "text" : brève explication ou contexte d'application (1 phrase).
                - Si le CV n'en mentionne aucune explicitement, déduis 2 à 4 compétences pertinentes à partir des expériences décrites, sans inventer de faits.

                5. "experiences" — tableau d'objets { title, role, date, location, text }
                Une entrée par poste occupé.
                - "title" : nom de l'entreprise.
                - "role" : intitulé du poste.
                - "date" : période (ex: "2021 - 2023").
                - "location" : ville/pays si connu, sinon "".
                - "text" : description des missions, synthétisée.

                6. "realizations" — tableau d'objets { title, role, date, location, text }
                Réalisations ou projets marquants distincts d'un poste classique (projet perso, mission ponctuelle, accomplissement chiffré).
                - Même structure que "experiences".
                - Si aucune réalisation distincte n'est identifiable dans le CV -> tableau vide [], jamais un objet seul.

                7. "education" — tableau d'objets { title, date, location, text }
                Une entrée par formation/diplôme.
                - "title" : nom du diplôme + établissement.
                - "text" : détails utiles (mention, spécialité), sinon "".

                8. "languages" — tableau d'objets { name, level }
                - "name" : nom de la langue.
                - "level" : niveau tel qu'indiqué (ex: "Courant", "B2", "Natif"). Si non précisé -> "".

                9. "interests" — tableau d'objets { title, text }
                Centres d'intérêt personnels (hobbies), jamais professionnels.
                - "text" : courte précision si disponible, sinon "".

                ────────────────────────────────
                RÈGLES DE CLASSEMENT EN CAS D'AMBIGUÏTÉ
                ────────────────────────────────
                - Outil/logiciel/langage précis -> hardSkills.
                - Trait de personnalité -> softSkills.
                - Savoir-faire métier plus large sans être un outil précis -> competences.
                - Poste avec dates/entreprise -> experiences.
                - Accomplissement ponctuel sans structure de poste classique -> realization.
                - Ne jamais dupliquer la même information dans deux catégories différentes.
                - Ne jamais inventer d'informations factuelles (dates, entreprises, diplômes) absentes du CV. Seuls "title", "about" et "competences" peuvent être partiellement déduits/synthétisés si absents.

                ────────────────────────────────
                RÈGLES DE FORMAT (strict)
                ────────────────────────────────
                - Retourne uniquement du JSON valide, rien d'autre.
                - Aucun texte avant ou après, aucun markdown, aucun bloc de code.
                - Respecte exactement les noms de clés et leur casse.
                - Les 9 clés doivent toutes être présentes, même si vides.
                - Chaîne absente -> "". Tableau absent -> [].
                - N'utilise jamais null ni undefined.
                - Conserve l'ordre chronologique/original du CV dans les tableaux.

                Voici le CV à convertir :

                ${JSON.stringify(data)}
                `;
            const content = await fetchAI(userPrompt, keyGroq, true);
            if (!content.success)
            {
                setCvLoading(false);
                console.log(content.message)
                setLoadedCv(`Une erreur s'est produite : ${content.message}`)
                throw new Error(content.message as string);
            }
            const generated: ImportantCv = content.message as ImportantCv;
            setLoadedCv([
                data
            ]);
            setCvData((current) => ({
                ...current,
                profile: generated.profile ?? current.profile,
                competences: checkIsArrayAndExist(generated.competences) ? generated.competences : current.competences,
                experiences: checkIsArrayAndExist(generated.experiences) ? generated.experiences : current.experiences,
                education: checkIsArrayAndExist(generated.education) ? generated.education : current.education,
                hardSkills: checkIsArrayAndExist(generated.hardSkills) ? generated.hardSkills : current.hardSkills,
                softSkills: checkIsArrayAndExist(generated.softSkills) ? generated.softSkills : current.softSkills,
                realization: checkIsArrayAndExist(generated.realization) ? generated.realization : current.realization,
                interests: checkIsArrayAndExist(generated.interests) ? generated.interests : current.interests,
            }));
            resetSkills();
            setCvLoading(false);
        })
      };

    const generateLM = async () => {
        const description = document.getElementById("job-prompt") as HTMLInputElement;
        const addedPrompt = document.getElementById("added-prompt") as HTMLInputElement;
        const userPrompt = `
        Tu es un rédacteur de lettre de motivation hyper original
        
        Ton objectif est de retourner au format JSON avec une seul clé :
        - motivation qui contientdra la string de la lettre bien espacé

        Tu dois rédiger le cv en langue :
        ${language}
        Tu rédigeras cette lettre en fonction de cette description de job :
        ${description?.value} 

        Prends bien en compte de manière important ce qui est ici :
        ${addedPrompt?.value}

        Le CV de référence est celui-ci : 
        ${JSON.stringify(cvData)}
        `;

        console.log(userPrompt);
        setLoadAiResponseLM(true);
        const content = await fetchAI(userPrompt, keyGroq, true);
        if (!content.success)
        {
            setLoadAiResponseLM(false);
            setAiResponseLM(content.message as string);
            throw new Error(content.message as string);
        }
        const generated = content.message as { motivation: string};
        setAiResponseLM(generated?.motivation);
        setLoadAiResponseLM(false);
        updateClipboard(generated?.motivation);
    }

    return (
        <section className="preview-panel">
            <div className="preview-head">
                <div>
                    <div className="eyebrow">APERÇU EN DIRECT</div>
                    <p>{optimizationMessage}</p>
                </div>
                <div className="preview-actions">
                    <div className="zoom-control" aria-label="Contrôle du zoom PDF">
                        <button
                            type="button"
                            aria-label="Réduire le zoom"
                            onClick={onZoomOut}
                        >
                            −
                        </button>
                        <button type="button" aria-label="Réinitialiser le zoom" onClick={onZoomReset}>
                            {zoom}%
                        </button>
                        <button
                            type="button"
                            aria-label="Augmenter le zoom"
                            onClick={onZoomIn}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="add-page-button"
                        type="button"
                        onClick={() => {
                                const count = pageNumber - 1;
                                setPageNumber(count);
                                localStorage.setItem('page-number', count.toString());
                            }
                        }
                    >
                        Retirer une page <span>↑</span>
                    </button>
                    <button
                        className="add-page-button"
                        type="button"
                        onClick={() => {
                                const count = pageNumber + 1;
                                setPageNumber(count);
                                localStorage.setItem('page-number', count.toString());
                            }
                        }
                    >
                        Ajouter une page <span>↓</span>
                    </button>
                    <button
                        className="export-button"
                        type="button"
                        onClick={() => {
                            exportPdf(cvData.profile, setFiveEntries, database, setCvGenerating)
                            setCvGenerating(true);
                        }}
                    >
                        {cvGenerating && <span className="spinner" aria-hidden="true" />}
                        Générer le PDF <span>↓</span>
                    </button>
                </div>
            </div>
            <div className="pdf-stage">
                <CvHtml document={cvData} zoom={zoom} atsPrompt={atsPrompt} pageNumber={pageNumber} setPageCount={setPageNumber} setCvData={setCvData}/>
            </div>
            <section className="response-panel" aria-live="polite">
                <div className="response-heading">
                    <span className="eyebrow">Lettre de motivation</span>
                    <span className="saved-label">LM</span>
                </div>
                <button className="button-preset lm"
                onClick={generateLM}>
                        {loadAiResponseLM && <span className="spinner" aria-hidden="true" />}
                        Génerer une lettre de motivation
                </button>
                <pre>
                    {aiResponseLM as string || 'La réponse de Groq apparaîtra ici après et sera automatiquement copié au clipboard.'}
                </pre>
            </section>
            <section className="response-panel" aria-live="polite">
                <div className="response-heading">
                    <span className="eyebrow">RÉPONSE DE L'IA</span>
                    {aiResponse && !isGenerating && <span className="saved-label">GROQ</span>}
                </div>
                {isGenerating ? (
                    <div className="loading" role="status" aria-live="polite">
                        <span className="spinner" aria-hidden="true" />
                        <span>L'IA prépare votre réponse...</span>
                    </div>
                ) : (
                    <pre>
                        {aiResponse as string || 'La réponse de Groq apparaîtra ici après une optimisation.'}
                    </pre>
                )}
            </section>
            {database !== null ? (
                <section className="response-panel" aria-live="polite">
                    <div className="response-heading">
                        <span className="eyebrow">RÉPONSE DE LA BASE DE DONNÉES (5 Derniers)</span>
                        {dbResponse && <span className="saved-label">DB</span>}
                    </div>
                    {notReadyDataDB ? (
                        <div className="loading" role="status" aria-live="polite">
                            <span className="spinner" aria-hidden="true" />
                            <span>Chargement de la base de données...</span>
                        </div>
                    ) : (
                        <pre>
                            {dbResponse.length > 0 ? dbResponse.map((entry, index) => (
                                <div key={index}>{JSON.stringify(entry)}</div>
                            )) : 'La réponse de la base de données apparaîtra ici après une optimisation.'}
                        </pre>
                    )}
                </section>
            ) : null}
            <section className="response-panel" aria-live="polite">
                <div className="response-heading">
                    <span className="eyebrow">Charger le texte de votre CV</span>
                    <span className="saved-label">CV</span>
                </div>
                <div className="loading cvLoadParent" role="status" aria-live="polite">
                    <label htmlFor="cvload" className="button-preset">
                        {cvLoading && <span className="spinner" aria-hidden="true" />}
                         Chargez votre CV ici
                    </label>
                    <input type="file" id="cvload" onChange={handleFile} style={{ display: 'none'}}/>
                    <pre style={{ backgroundColor: 'white', color: 'black'}}>
                        {
                            typeof loadedCv !== "string" ? (
                                loadedCv.length > 0 ? loadedCv.map((entry, index) => (
                                    <div key={index}>{JSON.stringify(entry)}</div>
                                )) : 'La réponse de chargement apparaîtra ici'
                            ) : loadedCv
                        }
                    </pre>
                </div>
            </section>
        </section>
    );
}
