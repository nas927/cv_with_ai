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
                You are an expert CV extraction engine. You must analyze the text of a CV and structure it into strict JSON.

                OUTPUT SCHEMA (follow exactly these 9 keys, no more, no less):
                
                ${JSON.stringify(emptyCvSchema, null, 2)}
                
                ────────────────────────────────
                DEFINITION OF EACH KEY
                ────────────────────────────────
                
                1. "profile" — single object
                { name, job, title, email, age, website, permis, language, region, city, phone, about, initials }
                
                - All values must be strings. If information is missing from the CV -> "".
                - "job": may remain "" if not found, do not infer it.
                - "title": if missing, infer a short and coherent professional title based on experiences/education (example: "Junior Web Developer").
                - "about": if missing, generate a neutral 1-2 sentence summary based on the profile (experiences + skills), without inventing facts not present in the CV.
                - "initials": infer them from the full name (example: "Jean Dupont" -> "JD").
                
                2. "hardSkills" — array of strings
                
                Concrete technical skills: programming languages, software, tools, methods, technical certifications.
                Examples: "Python", "Photoshop", "SEO", "Advanced Excel".
                
                3. "softSkills" — array of strings
                
                Behavioral and interpersonal qualities.
                Examples: "communication", "teamwork", "stress management".
                
                4. "competences" — array of objects { name, text }
                
                Broader professional know-how, neither a specific tool (hardSkills) nor a personality trait (softSkills).
                
                - "name": short skill title (example: "Project Management").
                - "text": brief explanation or usage context (1 sentence).
                - If the CV does not explicitly mention any, infer 2 to 4 relevant competencies from the described experiences, without inventing facts.
                
                5. "experiences" — array of objects { title, role, date, location, text }
                
                One entry per position held.
                
                - "title": company name.
                - "role": job title.
                - "date": period (example: "2021 - 2023").
                - "location": city/country if known, otherwise "".
                - "text": summarized description of responsibilities and tasks.
                
                6. "realizations" — array of objects { title, role, date, location, text }
                
                Notable achievements or projects distinct from a standard job position (personal project, one-time mission, measurable accomplishment).
                
                - Same structure as "experiences".
                - If no distinct achievement can be identified in the CV -> empty array [], never a single object.
                
                7. "education" — array of objects { title, date, location, text }
                
                One entry per education/training/diploma.
                
                - "title": diploma name + institution.
                - "text": useful details (specialization, honors, etc.), otherwise "".
                
                8. "languages" — array of objects { name, level }
                
                - "name": language name.
                - "level": level as stated in the CV (example: "Fluent", "B2", "Native"). If not specified -> "".
                
                9. "interests" — array of objects { title, text }
                
                Personal interests (hobbies), never professional.
                
                - "text": short clarification if available, otherwise "".
                
                ────────────────────────────────
                CLASSIFICATION RULES IN CASE OF AMBIGUITY
                ────────────────────────────────
                
                - Specific tool/software/programming language -> hardSkills.
                - Personality trait -> softSkills.
                - Broader professional know-how without being a specific tool -> competences.
                - Position with dates/company -> experiences.
                - One-time accomplishment without a standard job structure -> realization.
                - Never duplicate the same information in two different categories.
                - Never invent factual information (dates, companies, diplomas) missing from the CV. Only "title", "about" and "competences" may be partially inferred/synthesized when missing.
                
                ────────────────────────────────
                STRICT FORMAT RULES
                ────────────────────────────────
                
                - Return only valid JSON, nothing else.
                - No text before or after, no markdown, no code block.
                - Respect exactly the key names and their casing.
                - All 9 keys must always be present, even if empty.
                - Missing string -> "".
                - Missing array -> [].
                - Never use null or undefined.
                - Preserve the original chronological/order of the CV in arrays.
                
                Here is the CV to convert:

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
            You are a highly creative cover letter writer.

            Your objective is to return a JSON object with exactly one key:
            - "motivation": containing the full cover letter as a well-formatted string with proper spacing.
            
            You must write the cover letter in this language:
            ${language}
            
            You must write this cover letter based on the following job description:
            ${description?.value}
            
            Carefully and importantly take into account the following additional instructions:
            ${addedPrompt?.value}
            
            The reference CV is the following:
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
