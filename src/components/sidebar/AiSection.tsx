interface AiSectionProps {
    fold: boolean;
    setFold: (value: boolean) => void;
    prompt: string;
    setPrompt: (value: string) => void;
    addedPrompt: string;
    setAddedPrompt: (value: string) => void;
    TJM: string;
    setTJM: (value: string) => void;
    setATSPrompt: (value: string) => void;
    keyGroq: string;
    setKeyGroq: (value: string) => void;
    cvLanguage: 'fr' | 'en';
    setCvLanguage: (value: 'fr' | 'en') => void;
    isGenerating: boolean;
    onGenerate: () => void;
    onResetSkills: () => void;
}

export function AiSection({
    fold,
    setFold,
    keyGroq,
    setKeyGroq,
    prompt,
    setPrompt,
    addedPrompt,
    setAddedPrompt,
    TJM,
    setTJM,
    setATSPrompt,
    cvLanguage,
    setCvLanguage,
    isGenerating,
    onGenerate,
    onResetSkills,
}: AiSectionProps) {
    return (
        <>
            <a href="https://buy.stripe.com/cNi14nbCOe359lH60C4ko06" target="_blank" rel="noreferrer">
                <button className="button-preset payment" aria-label="soutien un branleur">Faire un petit don de 1 €</button>
            </a>
            <a href="/utilisation.md" target="_blank" rel="noreferrer">
                <button className="button-preset" style={{ backgroundColor: "#a63116"}}>Voir le guide d'utilisation</button>
            </a>
            <button className="button-preset" type="button" onClick={() => setFold(!fold)}>
                {fold ? "Plier toutes les sections" : "Déplier toutes les sections"}
            </button>
            <button className="button-preset reset-skills" type="button" onClick={onResetSkills}>
                Réinitialiser les champs modifiés par IA
            </button>

            <label className="field-label" htmlFor="groq-key">
                Clé groq
            </label>
            <input
                id="groq-key"
                value={keyGroq}
                onChange={(event) => {
                    localStorage.setItem('groqKey', event.target.value);
                    setKeyGroq(event.target.value);
                }}
            />

            <label className="field-label" htmlFor="job-prompt">
                POSTE CIBLÉ
            </label>
            <textarea
                className="prompt-input"
                id="job-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
            />

            <label className="field-label" htmlFor="added-prompt">
                TJM si spécifié il sera ajouté au cv
            </label>
            <input
                id="added-prompt"
                value={TJM}
                onChange={(event) => setTJM(event.target.value)}
            />
            <label className="field-label" htmlFor="added-prompt">
                Instruction à ajouter pour l'ia
            </label>
            <input
                id="added-prompt"
                value={addedPrompt}
                onChange={(event) => setAddedPrompt(event.target.value)}
            />
            <label className="field-label" htmlFor="ats-prompt">
                Instruction pour l'ats
            </label>
            <input
                id="ats-prompt"
                placeholder="Changez l'ATS prompt"
                onChange={(event) => setATSPrompt(event.target.value)}
            />

            <label className="language-choice" htmlFor="cv-language">
                LANGUE DU CV
                <select
                    id="cv-language"
                    value={cvLanguage}
                    onChange={(event) => setCvLanguage(event.target.value as 'fr' | 'en')}
                >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                </select>
            </label>

            <button className="generate-button" type="button" onClick={onGenerate} disabled={isGenerating}>
                {isGenerating ? 'Analyse en cours...' : 'Optimiser avec Groq'} <span>↗</span>
            </button>
        </>
    );
}
