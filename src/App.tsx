import { useDB, useCvData, useAiGeneration, useUiControls } from './hooks';
import { Header, Footer, Sidebar, PreviewPanel } from './components';
import { useTemplates } from './hooks/useTemplates';
import { useEffect } from 'react';
import './App.css';


function App() {
    // Templates init
    const templates = useTemplates();

    // BDD init
    const dbHook = useDB();
    
    // État du CV
    const cvDataHook = useCvData();
    
    // État de la génération IA
    const aiHook = useAiGeneration();
    
    // Contrôles UI
    const uiHook = useUiControls();

    useEffect(() => {
        let _mounted = false;

        if (_mounted)
            return;
        document.addEventListener("scroll", () => {
            const upOrDown = document.querySelector(".go-down-or-up") as HTMLDivElement;
            if (window.scrollY < 250)
                upOrDown.textContent = "↓";
            else
                upOrDown.textContent = "↑";

        })

        return () => {
            _mounted = true;
        }
    }, [])

    return (
        <main className="app-shell">
            <Header profile={cvDataHook.profile} />
            <div className="go-down-or-up" onClick={() => {
                if (window.scrollY < 250 && window.innerWidth <= 650)
                    document.querySelector('.preview-head')?.scrollIntoView();
                else if (window.scrollY < 250 && window.innerWidth > 650)
                    window.scrollTo({
                        top: (document.body.scrollHeight - window.innerHeight),
                        behavior: "smooth",
                    })
                else
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })
            }}>↓</div>
            <div className="workspace">
                <Sidebar
                    cvData={cvDataHook.cvData}
                    prompt={aiHook.prompt}
                    keyGroq={aiHook.keyGroq}
                    setATSPrompt={aiHook.setATSPrompt}
                    setKeyGroq={aiHook.setKeyGroq}
                    setPrompt={aiHook.setPrompt}
                    templates={templates.templates}
                    addedPrompt={aiHook.addedPrompt}
                    setAddedPrompt={aiHook.setAddedPrompt}
                    TJM={aiHook.TJM}
                    setTJM={aiHook.setTJM}
                    cvLanguage={aiHook.cvLanguage}
                    setCvLanguage={aiHook.setCvLanguage}
                    isGenerating={aiHook.isGenerating}
                    sharedSkillCount={cvDataHook.sharedSkillCount}
                    onGenerate={() => aiHook.generate(cvDataHook.cvData, cvDataHook.setCvData)}
                    resizeAllSkills={cvDataHook.resizeAllSkills}
                    onResetSkills={cvDataHook.resetSkills}
                    setCvData={cvDataHook.setCvData}
                    onPhotoChange={cvDataHook.setPhoto}
                    onPhotoRemove={() => cvDataHook.setPhoto('')}
                    onProfileFieldChange={cvDataHook.updateProfileField}
                    setSharedSkillCount={cvDataHook.setSharedSkillCount}
                    design={cvDataHook.design}
                    onDesignChange={cvDataHook.setDesign}
                    setTemplate={templates.setTemplate}
                />
                <PreviewPanel
                    keyGroq={aiHook.keyGroq}
                    pageNumber={cvDataHook.pageNumber}
                    atsPrompt={aiHook.atsPrompt}
                    language={aiHook.cvLanguage}
                    cvData={cvDataHook.cvData}
                    design={cvDataHook.design}
                    zoom={uiHook.zoom}
                    onZoomIn={uiHook.zoomIn}
                    onZoomOut={uiHook.zoomOut}
                    onZoomReset={uiHook.resetZoom}
                    optimizationMessage={aiHook.optimizationMessage}
                    isGenerating={aiHook.isGenerating}
                    aiResponse={aiHook.aiResponse}
                    database={dbHook.database}
                    notReadyDataDB={dbHook.notReadyDataDB}
                    dbResponse={dbHook.lastFiveEntries}
                    setFiveEntries={dbHook.setLastFiveEntries}
                    setPageNumber={cvDataHook.setPageNumber}
                    setCvData={cvDataHook.setCvData}
                    resetSkills={() => {
                            cvDataHook.resizeAllSkills(cvDataHook.sharedSkillCount);
                        }
                    }
                />
            </div>
            <Footer />
        </main>
    );
}

export default App;
