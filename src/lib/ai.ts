import type { CvDocument, ImportantCv, Profile } from '../types/cv';

export type AiCvResponse = Pick<
    CvDocument,
    'hardSkills' | 'softSkills' | 'experiences' | 'competences'
> & { profile: Profile; education?: CvDocument['education'] };
type AiDocumentUpdate = Omit<AiCvResponse, 'profile'> & { profile: Profile };

const generatedList = <T,>(generated: T[] | undefined, current: T[], max: number): T[] => {
    if (!Array.isArray(generated) || generated.length === 0) return current;
    return generated.slice(0, max);
};

const parseAiJson = (content: string, isPartial: boolean = false): Partial<CvDocument> => {
    const cleaned = content
        .replace(/^\s*```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end <= start) throw new Error('Réponse JSON invalide');
    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as Partial<CvDocument>;
    //console.log('Réponse IA parsée :', parsed);
    if (
        !isPartial && (
        !parsed.profile ||
        typeof parsed.profile.job !== 'string' ||
        typeof parsed.profile.title !== 'string' ||
        typeof parsed.profile.about !== 'string' ||
        !Array.isArray(parsed.experiences) ||
        !Array.isArray(parsed.competences) ||
        !Array.isArray(parsed.hardSkills) ||
        !Array.isArray(parsed.softSkills)
    )) {
        throw new Error('Réponse IA incomplète : le profil et les quatre listes sont nécessaires');
    }
    return parsed as Partial<CvDocument>;
};

export const constrainAiDocument = (
    generated: AiCvResponse,
    current: CvDocument
): AiDocumentUpdate => ({
    profile: {
        ...current.profile,
        job: generated.profile.job,
        title: generated.profile.title,
        about: generated.profile.about,
    },
    hardSkills: generatedList(generated.hardSkills, current.hardSkills, 12),
    softSkills: generatedList(generated.softSkills, current.softSkills, 12),
    experiences: generatedList(generated.experiences, current.experiences, 12),
    competences: generatedList(generated.competences, current.competences, 9),
    education: generatedList(generated.education, current.education, 12)
});

export const fetchAI = async (userPrompt: string, token: string, isPartial: boolean, model = 'openai/gpt-oss-120b'): Promise<{message: string | AiCvResponse | {motivation: string} | ImportantCv, success: boolean}> => {
    if (!token) 
        return {message: "Il vous manque le token groq", success: false};
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: 'system',
                    content: `Tu es un expert en rédaction de CV. Réponds uniquement avec du JSON valide.`,
                },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
        }),
    });
    if (!response.ok) 
        return {message: "Une erreur est survenue ! " + response.status, success: false};
    const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
    };
    let content: string | undefined = payload.choices?.[0]?.message?.content;
    if (content && content === '' && content !== undefined)
        return {message: "", success: false}
    return {message: parseAiJson(content as string, isPartial), success: true};
}
