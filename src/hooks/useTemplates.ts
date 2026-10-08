import { useState, useEffect } from "react";
import type { CvTemplate } from '../types/cv';
import { loadTemplates } from '../lib/storage';

const usedTemplate = (templates: CvTemplate[]): CvTemplate | null => {
    return templates.find(template => template.used) ?? null;
};

export function useTemplates() {
    const [templates, setTemplate] = useState<CvTemplate[]>(loadTemplates);
    
    // Sauvegarde automatique
    useEffect(() => {
        localStorage.setItem('templates', JSON.stringify(templates));
        const existStyle = document.getElementById("custom-css");
        const template: CvTemplate | null = usedTemplate(templates);
        
        if (existStyle)
            existStyle.remove();
        if (template)
        {
            const style = document.createElement("style");
            style.id = "custom-css";
            style.textContent = template.css;
            document.head.appendChild(style);
        }
    }, [templates]);

    return {
        templates,
        setTemplate
    };
}