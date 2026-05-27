/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RunReceiptGenerator from "./components/RunReceiptGenerator";
import RaceRecapGenerator from "./components/RaceRecapGenerator";
import WorkoutCardGenerator from "./components/WorkoutCardGenerator";
import RaceSplitGenerator from "./components/RaceSplitGenerator";
import PaceBandGenerator from "./components/PaceBandGenerator";
import DamageReportGenerator from "./components/DamageReportGenerator";
import RaceBibGenerator from "./components/RaceBibGenerator";
import RaceChecklistGenerator from "./components/RaceChecklistGenerator";
import SportsCertificateGenerator from "./components/SportsCertificateGenerator";
import PersonalBestGenerator from "./components/PersonalBestGenerator";
import TrainingWeekGenerator from "./components/TrainingWeekGenerator";
import GoalCardGenerator from "./components/GoalCardGenerator";
import ChallengeCardGenerator from "./components/ChallengeCardGenerator";
import FuelingPlanGenerator from "./components/FuelingPlanGenerator";
import ShoeRotationGenerator from "./components/ShoeRotationGenerator";
import RoutePosterGenerator from "./components/RoutePosterGenerator";
import ClientRender from "./components/ClientRender";
import { Download, Copy, Save, RotateCcw, FileText, Menu, X, ArrowLeft } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

const TAB_TYPES = [
  { id: "run-receipt", label: "Run Receipt", implemented: true },
  { id: "race-recap", label: "Race Recap", implemented: true },
  { id: "workout-card", label: "Workout Card", implemented: true },
  { id: "race-split", label: "Race Split", implemented: true },
  { id: "pace-band", label: "Pace Band", implemented: true },
  { id: "damage-report", label: "Damage Report", implemented: true },
  { id: "race-bib", label: "Race Bib", implemented: true },
  { id: "race-checklist", label: "Race Checklist", implemented: true },
  { id: "sports-certificate", label: "Sports Certificate", implemented: true },
  { id: "personal-best", label: "Personal Best Card", implemented: true },
  { id: "training-week", label: "Training Week Card", implemented: true },
  { id: "goal-card", label: "Goal Card", implemented: true },
  { id: "challenge-card", label: "Challenge Card", implemented: true },
  { id: "fueling-plan", label: "Fueling Plan Card", implemented: true },
  { id: "shoe-rotation", label: "Shoe Rotation Card", implemented: true },
  { id: "route-poster", label: "Route Poster", implemented: true },
];

function ComingSoonPlaceholder({ activeTab }: { activeTab: string }) {
  const tab = TAB_TYPES.find(t => t.id === activeTab);
  const name = tab ? tab.label : "Card";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[70vh]">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">{name}</h2>
        <p className="text-text-muted text-sm font-mono uppercase tracking-widest text-primary-coral">This generator is coming soon.</p>
        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl opacity-30 select-none">
          <div className="w-1/3 h-2 bg-brand-border rounded mb-1"></div>
          <div className="w-full h-10 border border-brand-border rounded mb-4"></div>
          <div className="w-1/3 h-2 bg-brand-border rounded mb-1"></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
             <div className="w-full h-10 border border-brand-border rounded"></div>
             <div className="w-full h-10 border border-brand-border rounded"></div>
          </div>
          <div className="w-full h-32 border border-brand-border rounded"></div>
        </div>
      </div>
      <div className="lg:col-span-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
        <div className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border border-dashed rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[600px] overflow-hidden relative">
           <div className="w-[400px] h-[550px] border border-brand-border bg-surface-low rounded-lg flex flex-col p-8 opacity-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none select-none">
              <div className="w-1/2 h-6 bg-brand-border rounded mb-6"></div>
              <div className="w-full h-2 bg-brand-border rounded mb-3"></div>
              <div className="w-5/6 h-2 bg-brand-border rounded mb-3"></div>
              <div className="w-4/6 h-2 bg-brand-border rounded mb-10"></div>
              <div className="w-full border border-brand-border rounded mb-auto flex-1 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 border border-brand-border rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border border-brand-border rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StudioContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("type") || "run-receipt";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [exportSize, setExportSize] = useState("square");
  const previewRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Allow resetting child forms by passing a flag or calling a ref? 
  // Easier: use a key on the component to unmount/remount it.
  const [resetKey, setResetKey] = useState(0); 

  useEffect(() => {
    const type = searchParams.get("type");
    let t: NodeJS.Timeout;
    if (type && TAB_TYPES.some(t => t.id === type)) {
      t = setTimeout(() => {
        setActiveTab(prev => prev !== type ? type : prev);
      }, 0);
    }
    
    // Load default export size from settings
    setTimeout(() => {
      const savedSize = localStorage.getItem('runcard-default-export-size');
      if (savedSize) {
        setExportSize(savedSize);
      }
    }, 0);
    
    return () => clearTimeout(t);
  }, [searchParams]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('runcard-default-export-size', exportSize);
      window.dispatchEvent(new CustomEvent('export-size-changed', { detail: exportSize }));
    }
  }, [exportSize]);

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector('[data-active="true"]') as HTMLButtonElement | null;
    if (activeBtn) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeBtn.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (activeRect.left - containerRect.left) - (containerRect.width / 2) + (activeRect.width / 2);
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const showToast = (msg: string) => {
    if (msg === "Failed to save draft." && typeof window !== "undefined" && (window as any)._unsafeDraftBlocking) {
      return;
    }
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const handleUnsafe = () => {
      showToast("Draft contains unsafe data and was not saved.");
    };
    if (typeof window !== "undefined") {
      window.addEventListener("runcard-unsafe-draft-detected", handleUnsafe);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("runcard-unsafe-draft-detected", handleUnsafe);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const loadStr = localStorage.getItem('runcard-draft-load');
        if (loadStr) {
          const draft = JSON.parse(loadStr);
          if (draft) {
            if (draft.accent) {
              localStorage.setItem('runcard-template-accent', draft.accent);
              window.dispatchEvent(new CustomEvent('template-accent-changed', { detail: draft.accent }));
            }
            if (draft.exportSize) {
              setExportSize(draft.exportSize);
            }
          }
        }
      } catch (e) {}

      const timer = setTimeout(() => {
        localStorage.removeItem('runcard-draft-load');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleExportPng = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      // Use pixelRatio 4 and reset inline scale transforms for maximum crispness
      const cardCanvas = await htmlToImage.toCanvas(previewRef.current, {
        pixelRatio: 4,
        backgroundColor: "transparent",
        style: {
          transform: "none",
          transformOrigin: "unset",
        },
        cacheBust: true,
      });

      let tw = cardCanvas.width;
      let th = cardCanvas.height;
      let suffix = "auto";
      
      if (exportSize === "square") { tw = 1080; th = 1080; suffix = "square"; }
      else if (exportSize === "story") { tw = 1080; th = 1920; suffix = "story"; }
      else if (exportSize === "landscape") { tw = 1920; th = 1080; suffix = "landscape"; }
      else if (exportSize === "compact") { tw = 1200; th = 628; suffix = "compact"; }
      else if (exportSize === "printable") { tw = 2480; th = 3508; suffix = "printable"; } // A4 300dpi

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = tw;
      finalCanvas.height = th;
      const ctx = finalCanvas.getContext("2d");
      
      if (ctx) {
         const classListStr = previewRef.current.className;
         const innerHtmlStr = previewRef.current.innerHTML;
         const isLightBg = classListStr.includes("bg-[#f4f4f5]") || 
                           classListStr.includes("bg-white") || 
                           classListStr.includes("bg-[#fafafa]") ||
                           innerHtmlStr.includes("bg-[#f4f4f5]") || 
                           innerHtmlStr.includes("bg-white") || 
                           innerHtmlStr.includes("bg-[#fafafa]");

         // Background
         ctx.fillStyle = isLightBg ? "#ffffff" : "#0c1322"; 
         ctx.fillRect(0, 0, tw, th);
         
         // Subtle dot grid background matching the live preview style
         ctx.fillStyle = isLightBg ? "#e4e4e7" : "#22252a";
         for (let x = 0; x < tw; x += 32) {
             for (let y = 0; y < th; y += 32) {
                 ctx.beginPath();
                 ctx.arc(x, y, 2, 0, Math.PI * 2);
                 ctx.fill();
             }
         }

         let padding = 100;
         if (exportSize === "story") padding = 150;
         if (exportSize === "printable") padding = 200;
         
         const availW = tw - padding * 2;
         const availH = th - padding * 2;
         const scaleRatio = Math.min(availW / cardCanvas.width, availH / cardCanvas.height, 1);
         
         const cardW = cardCanvas.width * scaleRatio;
         const cardH = cardCanvas.height * scaleRatio;
         const dx = (tw - cardW) / 2;
         const dy = (th - cardH) / 2;
         
         // Card Shadow to separate it from bg
         ctx.shadowColor = isLightBg ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.8)";
         ctx.shadowBlur = 50;
         ctx.shadowOffsetY = 20;

         ctx.drawImage(cardCanvas, dx, dy, cardW, cardH);
         
         const dataUrl = finalCanvas.toDataURL("image/png", 1.0);
         const link = document.createElement("a");
         link.download = `runcard-${activeTab}-${suffix}.png`;
         link.href = dataUrl;
         link.click();
      }
      showToast("Exported PNG successfully");
    } catch (err) {
      console.error(err);
      showToast("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const classListStr = previewRef.current.className;
      const innerHtmlStr = previewRef.current.innerHTML;
      const isLightBg = classListStr.includes("bg-[#f4f4f5]") || 
                        classListStr.includes("bg-white") || 
                        classListStr.includes("bg-[#fafafa]") ||
                        innerHtmlStr.includes("bg-[#f4f4f5]") || 
                        innerHtmlStr.includes("bg-white") || 
                        innerHtmlStr.includes("bg-[#fafafa]");

      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        pixelRatio: 4,
        style: {
          transform: "none",
          transformOrigin: "unset",
        },
        backgroundColor: isLightBg ? "#ffffff" : "#0c1322",
        cacheBust: true,
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [previewRef.current.offsetWidth, previewRef.current.offsetHeight]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, previewRef.current.offsetWidth, previewRef.current.offsetHeight);
      pdf.save(`runcard-${activeTab}.pdf`);
      showToast("Exported PDF successfully");
    } catch (err) {
      console.error(err);
      showToast("PDF Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  const currentTabObj = TAB_TYPES.find(t => t.id === activeTab);
  const isImplemented = currentTabObj ? currentTabObj.implemented : true;
  const isPdfFriendly = activeTab === 'race-split' || activeTab === 'pace-band';

  return (
    <div className="flex flex-col flex-1 pb-24 lg:pb-16">
      {/* Toolbar Sticky */}
      <div className="bg-surface-lowest border-b border-brand-border sticky top-16 z-40 max-w-full">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-4">
          <div ref={tabsContainerRef} className="flex overflow-x-auto w-full lg:w-auto subtle-scrollbar gap-2 pb-2 lg:pb-0 border-b border-brand-border lg:border-none pr-4 scroll-smooth">
            {TAB_TYPES.map(tab => (
              <button
                key={tab.id}
                data-active={activeTab === tab.id ? "true" : "false"}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 text-[11px] lg:text-sm font-bold uppercase tracking-wider rounded transition-colors duration-200 cursor-pointer
                  ${activeTab === tab.id 
                    ? 'bg-primary-coral text-white shadow-[0_0_15px_rgba(255,84,81,0.35)]' 
                    : 'text-text-muted hover:text-text-primary hover:bg-surface'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
             <button
                onClick={handleReset}
                disabled={!isImplemented}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider border border-brand-border text-text-muted hover:text-text-primary hover:bg-surface rounded transition-colors flex items-center gap-1 bg-surface-lowest disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
             >
                <RotateCcw className="w-4 h-4" /> Reset Form
             </button>
             
             <div className="hidden lg:block h-6 w-px bg-brand-border mx-1 shrink-0"></div>

             <div className="hidden lg:flex items-center gap-2">
               <select 
                 value={exportSize}
                 onChange={e => setExportSize(e.target.value)}
                 className="bg-surface-lowest text-text-primary px-3 py-2 rounded text-xs font-bold uppercase border border-brand-border outline-none focus:border-secondary-lime shrink-0"
               >
                 <option value="square">Square Post</option>
                 <option value="story">IG Story</option>
                 <option value="landscape">Landscape</option>
                 <option value="compact">Compact Card</option>
                 {isPdfFriendly && <option value="printable">Printable</option>}
               </select>

               <button
                  onClick={handleExportPng}
                  disabled={isExporting || !isImplemented}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-primary-action text-white hover:bg-opacity-90 rounded transition-colors flex items-center gap-1 shadow-[0_0_15px_rgba(255,84,81,0.2)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
               >
                  <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export PNG'}
               </button>

               {isPdfFriendly && (
                 <button
                    onClick={handleExportPdf}
                    disabled={isExporting || !isImplemented}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-secondary-lime text-surface-lowest hover:bg-opacity-90 rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                 >
                    <FileText className="w-4 h-4" /> PDF
                 </button>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Export Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-lowest/95 backdrop-blur-md border-t border-brand-border p-4 z-[45] flex gap-3 items-center shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
         <div className="flex-1">
           <select 
             value={exportSize}
             onChange={e => setExportSize(e.target.value)}
             className="w-full bg-surface-low text-text-primary px-3 py-3 rounded-md text-xs font-bold uppercase border border-brand-border outline-none focus:border-secondary-lime transition-all"
           >
             <option value="square">Square 1:1</option>
             <option value="story">Story 9:16</option>
             <option value="landscape">Landscape 16:9</option>
             <option value="compact">Compact card</option>
             {isPdfFriendly && <option value="printable">Printable A4</option>}
           </select>
         </div>

         <button
            onClick={handleExportPng}
            disabled={isExporting || !isImplemented}
            className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider bg-primary-action text-white hover:bg-opacity-90 rounded-md transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,51,48,0.3)] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
         >
            <Download className="w-4 h-4" /> {isExporting ? '...' : 'PNG'}
         </button>

         {isPdfFriendly && (
           <button
              onClick={handleExportPdf}
              disabled={isExporting || !isImplemented}
              className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider bg-secondary-lime text-surface-lowest hover:bg-opacity-90 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
           >
              <FileText className="w-4 h-4" /> PDF
           </button>
         )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 border border-secondary-lime bg-surface-highest text-secondary-lime px-4 py-2 rounded shadow-lg font-bold uppercase text-sm z-50">
          {toastMessage}
        </div>
      )}

      {/* Main Studio Area */}
      <ClientRender fallback={<div className="p-8 text-center text-text-muted uppercase font-mono max-w-[1600px] xl:max-w-none mx-auto w-full px-4 md:px-8 xl:px-12 py-6 lg:py-8 min-h-[50vh] flex items-center justify-center">Loading Generator...</div>}>
        <div className="max-w-[1600px] xl:max-w-none mx-auto w-full px-4 md:px-8 xl:px-12 py-6 lg:py-8 min-h-[calc(100vh-136px)]">
          {!isImplemented && <ComingSoonPlaceholder activeTab={activeTab} />}
          {isImplemented && activeTab === "run-receipt" && <RunReceiptGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "race-recap" && <RaceRecapGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "workout-card" && <WorkoutCardGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "race-split" && <RaceSplitGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "pace-band" && <PaceBandGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "damage-report" && <DamageReportGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "race-bib" && <RaceBibGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "race-checklist" && <RaceChecklistGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "sports-certificate" && <SportsCertificateGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "personal-best" && <PersonalBestGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "training-week" && <TrainingWeekGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "goal-card" && <GoalCardGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "challenge-card" && <ChallengeCardGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "fueling-plan" && <FuelingPlanGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "shoe-rotation" && <ShoeRotationGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
          {isImplemented && activeTab === "route-poster" && <RoutePosterGenerator key={resetKey} previewRef={previewRef} showToast={showToast} />}
        </div>
      </ClientRender>
    </div>
  );
}

export default function Studio() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-muted uppercase font-mono">Loading Studio...</div>}>
      <StudioContent />
    </Suspense>
  );
}
