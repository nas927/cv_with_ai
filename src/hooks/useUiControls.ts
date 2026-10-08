import { useState } from 'react';

export function useUiControls() {
    const [zoom, setZoom] = useState(100);
    const [editMode, setEditMode] = useState(false);

    const zoomIn = () => setZoom((value) => Math.min(150, value + 5));
    const zoomOut = () => setZoom((value) => Math.max(75, value - 5));
    const resetZoom = () => setZoom(100);
    const toggleEditMode = () => setEditMode((value) => !value);

    return {
        zoom,
        setZoom,
        editMode,
        setEditMode,
        zoomIn,
        zoomOut,
        resetZoom,
        toggleEditMode,
    };
}
