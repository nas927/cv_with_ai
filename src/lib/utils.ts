import type { CvDocument, CompetenceItem } from "../types/cv";

export const cleanJobDescription = (description: string): string => {
    return description.trim();
};

const compressImage = (file: File, maxSize: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calcul des nouvelles dimensions en gardant le ratio
                let { width, height } = img;
                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context unavailable'));

                ctx.drawImage(img, 0, 0, width, height);

                // toDataURL en JPEG avec compression = équivalent de sharp().jpeg({quality})
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const importPhoto = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onPhotoChange: (photo: string) => void
) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const compressedDataUrl = await compressImage(file, 300, 0.9);
        onPhotoChange(compressedDataUrl);
    } catch (error) {
        console.error('Erreur lors de l\'import de la photo:', error);
    }
};

export const checkIsArrayAndExist = (objet: Object | any): boolean=> {
    if (!objet || Object.keys(objet).length === 0)
        return false;
    if (!Array.isArray(objet))
        return false;
    return true;
};

export function toBool(value: string): boolean
{
    if (value === 'true')
        return true;
    return false;
}

export function boolToString(value: boolean): string {
    if (value)
        return "true";
    return "false";
}

export function updateClipboard(newClip: string) {
    navigator.clipboard.writeText(newClip).then(
        () => {
            console.log("copied");
        },
        () => {
            console.error("Non copié au clipboard");
        },
    );
}

export function reorderSections<T>(
    Section: T[],
    draggedId: number,
    targetId: number,
    field: keyof CvDocument,
    setCvData: React.Dispatch<React.SetStateAction<CvDocument>>
): void {
    if (draggedId === targetId) return;

    const fromIndex = Section.find((section, index) => {
        return index === draggedId ? section : null;
    });
    const toIndex = Section.find((section, index) => {
        return index === targetId ? section : null;
    });

    if (fromIndex === -1 || toIndex === -1) return;

    const newSection = [...Section];

    [newSection[draggedId], newSection[targetId]] = [
        newSection[targetId],
        newSection[draggedId]
    ];

    setCvData((current) => ({
        ...current,
        [field]: newSection
    }))
}

export function initializeCompetences(originalCompetences: CompetenceItem[], what: string, count: number): CompetenceItem[] {
    originalCompetences = originalCompetences.slice(0, count);
    while (originalCompetences.length < count)
        originalCompetences.push({ name: `${what} ${originalCompetences.length + 1}`, text: '' });
    return originalCompetences;
}

export function initializeSkills(originalSkills: string[], what: string, count: number): string[] {
    originalSkills = originalSkills.slice(0, count);
    while (originalSkills.length < count)
        originalSkills.push(`${what} ${originalSkills.length + 1}`);
    return originalSkills;
}
