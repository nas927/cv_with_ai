import { useEffect, useState } from 'react';
import type { Profile } from '../../types/cv';
import { PhotoSection } from './PhotoSection';

interface ProfileSectionProps {
    fold: boolean;
    profile: Profile;
    onFieldChange: (field: keyof Profile, value: string) => void;
    photo: string;
    onPhotoChange: (value: string) => void;
    onPhotoRemove: () => void;
    picSize: number;
}

export function ProfileSection({ fold, profile, onFieldChange, photo, onPhotoChange, onPhotoRemove, picSize }: ProfileSectionProps) {
    const fields = [
        { key: 'job' as const, label: 'Nom de la société' },
        { key: 'name' as const, label: 'Nom' },
        { key: 'title' as const, label: 'Titre' },
        { key: 'permis' as const, label: 'Permis' },
        { key: 'email' as const, label: 'E-mail', type: 'email' },
        { key: 'phone' as const, label: 'Téléphone' },
        { key: 'age' as const, label: 'Âge' },
        { key: 'language' as const, label: 'Langue' },
        { key: 'region' as const, label: 'Région' },
        { key: 'city' as const, label: 'Ville' },
        { key: 'initials' as const, label: 'Initiales' },
        { key: 'website' as const, label: 'Site web' },
    ];
    const [showDesignControls, setShowDesignControls] = useState(false);

    useEffect(() => {
        if (fold !== null)
            setShowDesignControls(fold);
    }, [fold]);

    return (
        <div className="profile-controls">
            <div className="conditionnal-section">
                <button
                    className="button-preset"
                    style={{ backgroundColor: "#62423b"}}
                    type="button"
                    onClick={() => setShowDesignControls(!showDesignControls)}
                >
                    {showDesignControls ? "Masquer les options de Profile": "Afficher les options de Profile"}
                </button>
            </div>
        {showDesignControls && (
            <>
                <PhotoSection photo={photo} onPhotoChange={onPhotoChange} onPhotoRemove={onPhotoRemove} picSize={picSize} />
                <div className="field-label">
                    INFORMATIONS DU PROFIL <span className="saved-label">AUTO-SAUVEGARDÉES</span>
                </div>
                {fields.map(({ key, label, type = 'text' }) => (
                    <label key={key}>
                        {label}
                        <input
                            type={type}
                            value={profile[key]}
                            onChange={(event) => onFieldChange(key, event.target.value)}
                        />
                    </label>
                ))}
                <label>
                    À propos
                    <textarea
                        value={profile.about}
                        onChange={(event) => onFieldChange('about', event.target.value)}
                    />
                </label>
            </>
        )}
        </div>
    );
}