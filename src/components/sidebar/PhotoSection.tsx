import { importPhoto } from '../../lib/utils';

interface PhotoSectionProps {
    photo: string;
    picSize: number;
    onPhotoChange: (value: string) => void;
    onPhotoRemove: () => void;
}

export function PhotoSection({ photo, picSize, onPhotoChange, onPhotoRemove }: PhotoSectionProps) {
    return (
        <>
            <div className="field-label">
                PHOTO DU CV <span className="saved-label">JPG / PNG</span>
            </div>
            <label className="upload-box" htmlFor="photo-input">
                {photo ? (
                    <img src={photo} alt="Portrait du profil" style={{ width: picSize, height: picSize }} />
                ) : (
                    <span className="upload-placeholder">
                        ＋<small>Ajouter une photo</small>
                    </span>
                )}
                <input
                    id="photo-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => importPhoto(event, onPhotoChange)}
                />
            </label>
            {photo && (
                <button className="remove-photo" type="button" onClick={onPhotoRemove}>
                    Supprimer la photo
                </button>
            )}
        </>
    );
}
