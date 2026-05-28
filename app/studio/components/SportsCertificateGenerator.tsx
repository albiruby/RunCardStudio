/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, Eye, FileText } from "lucide-react";

interface SportsCertificateProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function SportsCertificateGenerator({ previewRef, showToast }: SportsCertificateProps) {
  const unit = getUnit();
  const [formData, setFormData] = useState({
    athleteName: "",
    achievement: "",
    detailText: "",
    date: "",
    tone: "Serious",
    signatureTitle: ""
  });

  const [template, setTemplate] = useState("classic");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const exportSize = useExportSize();
  const activeAccentId = useTemplateAccent();
  const activeAccent = ACCENTS.find(a => a.id === activeAccentId) || ACCENTS[0];

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        let targetW = 480;
        let targetH = 480;
        if (exportSize === "story") { targetW = 400; targetH = 711; }
        else if (exportSize === "landscape") { targetW = 640; targetH = 360; }
        else if (exportSize === "compact") { targetW = 540; targetH = 283; }
        else if (exportSize === "printable") { targetW = 595; targetH = 842; }

        // We leave 48px horizontal padding, and 100px vertical padding (for the ratio dock and top spacing)
        const scaleW = width / (targetW + 48);
        const scaleH = height / (targetH + 110);
        const newScale = Math.min(scaleW, scaleH, 1); // Cap at 1
        
        setScale(newScale);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [exportSize]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getToneText = () => {
    switch (formData.tone) {
      case "Serious":
        return "has officially completed";
      case "Funny":
        return "has somehow survived";
      case "Brutal":
        return "barely endured and conquered";
      case "Minimal":
        return "Completed";
      default:
        return "has completed";
    }
  };

  const getHeader = () => {
    switch (formData.tone) {
      case "Serious": return "CERTIFICATE OF ACHIEVEMENT";
      case "Funny": return "CERTIFICATE OF SURVIVAL";
      case "Brutal": return "OFFICIAL DAMAGE RECORD";
      case "Minimal": return "AWARD";
      default: return "CERTIFICATE";
    }
  };

  const handleCopy = () => {
    const lines = [];
    if (formData.athleteName !== undefined && formData.athleteName !== null && (formData.athleteName as any) !== false && (formData.athleteName as any) !== "—" && (formData.athleteName as any) !== "Input required" && String(formData.athleteName).trim() !== "") {
      const val = typeof formData.athleteName === 'boolean' ? 'Yes' : formData.athleteName;
      lines.push("Athlete Name: " + val);
    }
    if (formData.achievement !== undefined && formData.achievement !== null && (formData.achievement as any) !== false && (formData.achievement as any) !== "—" && (formData.achievement as any) !== "Input required" && String(formData.achievement).trim() !== "") {
      const val = typeof formData.achievement === 'boolean' ? 'Yes' : formData.achievement;
      lines.push("Achievement: " + val);
    }
    if (formData.detailText !== undefined && formData.detailText !== null && (formData.detailText as any) !== false && (formData.detailText as any) !== "—" && (formData.detailText as any) !== "Input required" && String(formData.detailText).trim() !== "") {
      const val = typeof formData.detailText === 'boolean' ? 'Yes' : formData.detailText;
      lines.push("Detail Text: " + val);
    }
    if (formData.date !== undefined && formData.date !== null && (formData.date as any) !== false && (formData.date as any) !== "—" && (formData.date as any) !== "Input required" && String(formData.date).trim() !== "") {
      const val = typeof formData.date === 'boolean' ? 'Yes' : formData.date;
      lines.push("Date: " + val);
    }
    if (formData.tone !== undefined && formData.tone !== null && (formData.tone as any) !== false && (formData.tone as any) !== "—" && (formData.tone as any) !== "Input required" && String(formData.tone).trim() !== "") {
      const val = typeof formData.tone === 'boolean' ? 'Yes' : formData.tone;
      lines.push("Tone: " + val);
    }
    if (formData.signatureTitle !== undefined && formData.signatureTitle !== null && (formData.signatureTitle as any) !== false && (formData.signatureTitle as any) !== "—" && (formData.signatureTitle as any) !== "Input required" && String(formData.signatureTitle).trim() !== "") {
      const val = typeof formData.signatureTitle === 'boolean' ? 'Yes' : formData.signatureTitle;
      lines.push("Signature Title: " + val);
    }
    lines.push("");
    lines.push("Made with RunCard Studio");
    const textToCopy = lines.join("\n");
    
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast("Copied to clipboard!");
      } catch (err) {
        showToast("Failed to copy.");
      }
      textArea.remove();
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast("Copied to clipboard!"))
        .catch((err) => {
          fallbackCopy(textToCopy);
        });
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const getPlainFormDataForCurrentCard = () => {
    return { ...formData };
  };

  const saveCurrentDraft = () => {
    const plainData = getPlainFormDataForCurrentCard();
    for (const key in plainData) {
      const val = (plainData as any)[key];
      if (typeof HTMLElement !== "undefined" && val instanceof HTMLElement) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Node !== "undefined" && val instanceof Node) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Event !== "undefined" && val instanceof Event) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof File !== "undefined" && val instanceof File) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Blob !== "undefined" && val instanceof Blob) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof val === "function") { showToast("Draft contains unsafe data and was not saved."); return; }
    }

    const pd = plainData as any;
    const title = pd.name || pd.title || pd.athleteName || pd.sessionName || pd.runnerName || pd.raceName || pd.sessionType || pd.distanceChoice || "Untitled Draft";

    const draft = {
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      cardType: "sports-certificate",
      title: String(title),
      template: typeof template !== 'undefined' ? template : "default",
      exportSize: typeof exportSize !== 'undefined' ? exportSize : "square",
      formData: plainData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0"
    };

    try {
      const existingStr = localStorage.getItem('runcard-drafts');
      let drafts = [];
      if (existingStr) {
        drafts = JSON.parse(existingStr);
      }
      drafts.push(draft);
      localStorage.setItem('runcard-drafts', JSON.stringify(drafts));
      showToast("Draft saved!");
    } catch(err) {
      showToast("Failed to save draft.");
    }
  };

  useEffect(() => {
    try {
       if (typeof window !== 'undefined') {
          const loadStr = localStorage.getItem('runcard-draft-load');
          if (loadStr) {
             const draft = JSON.parse(loadStr);
             if (draft && draft.cardType === "sports-certificate") {
                if (draft.formData) setFormData(draft.formData);
                if (draft.template && typeof setTemplate === "function") setTemplate(draft.template);
             }
          }
       }
    } catch {}
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)] gap-6 w-full font-sans">
      {/* COLUMN 1: CERTIFICATE CONFIGURATION */}
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center gap-2 px-1">
          <FileText className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">CERTIFICATE CONFIGURATION</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-xl flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Athlete Name</label>
             <input 
               type="text" 
               value={formData.athleteName}
               onChange={e => handleChange("athleteName", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Athlete Name"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Main Achievement</label>
             <input 
               type="text" 
               value={formData.achievement}
               onChange={e => handleChange("achievement", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder={`e.g. The 100${unit} Ultra Challenge`}
             />
          </div>
          
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Detail Text / Distance</label>
             <textarea 
               value={formData.detailText}
               onChange={e => handleChange("detailText", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="e.g. with unyielding determination..."
             ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date</label>
               <input 
                 type="text" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all uppercase"
                 placeholder="OCTOBER 24, 2026"
               />
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Tone</label>
               <select 
                 value={formData.tone}
                 onChange={e => handleChange("tone", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Serious">Serious</option>
                 <option value="Funny">Funny</option>
                 <option value="Brutal">Brutal</option>
                 <option value="Minimal">Minimal</option>
               </select>
            </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Signature Title (Opt)</label>
             <input 
               type="text" 
               value={formData.signatureTitle}
               onChange={e => handleChange("signatureTitle", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Race Director"
             />
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-3.5 h-3.5 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2.5 bg-transparent border hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} /> COPY CERTIFICATE</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start min-h-[calc(100vh-140px)] min-w-0">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5 animate-pulse">
            <Eye className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">LIVE PREVIEW</h2>
          </div>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">REPRESENTS COMPLETED CANVAS</p>
        </div>

        {/* Scalable Container for preview */}
        <div ref={containerRef} className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border rounded-xl p-4 md:p-8 flex items-center justify-center flex-1 min-h-[500px] xl:min-h-[600px] relative shadow-inner overflow-clip">
          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${scale})`, 
              transformOrigin: 'center center',
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
          >
            <div
              ref={previewRef}
              className={`${getExportSizeClasses(exportSize, template)}` + ` relative flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 select-none overflow-hidden
                ${template === 'classic' ? ' bg-[#fafafa] text-black border-[12px] border-[#ced4da] p-8 font-serif outline outline-1 outline-black' : ''}
                ${template === 'survival' ? ' w-[640px] h-[440px] bg-[#0a0a0c] text-[#f2f4f7] border-4 border-[#ff2020] p-10 font-mono' : ''}
                ${template === 'minimal award' ? ' w-[600px] h-[400px] bg-white text-black p-12 border border-gray-200 rounded-sm font-sans' : ''}
              `}
              style={template === 'survival' ? { borderColor: activeAccent.hex } : undefined}
            >
              {['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) ? (
                <SharedTemplates template={template} formData={formData} componentName="SportsCertificateGenerator" />
              ) : (
                <>
                  {template === 'classic' && (
                    <div 
                      className="border border-[#adb5bd] w-full h-full flex flex-col items-center flex-1 p-8 text-center relative"
                      style={{ borderColor: `${activeAccent.hex}6d` }}
                    >
                       <h1 
                         className="text-3xl font-black uppercase tracking-widest mb-10 text-gray-800"
                         style={{ color: activeAccent.hex }}
                       >
                         {getHeader()}
                       </h1>
                       <p className="italic text-gray-600 mb-6">This certifies that</p>
                       <h2 className="text-4xl font-black uppercase tracking-wider mb-6 border-b-2 border-gray-800 pb-2 px-8 inline-block" style={{ borderBottomColor: activeAccent.hex }}>{formData.athleteName || 'ATHLETE NAME'}</h2>
                       <p className="italic text-gray-600 mb-2">{getToneText()}</p>
                       <h3 className="text-2xl font-bold uppercase tracking-wide text-gray-800 mb-3">{formData.achievement || 'ACHIEVEMENT'}</h3>
                       <p className="text-sm italic text-gray-500 max-w-sm mx-auto mb-auto">{formData.detailText}</p>

                       <div className="w-full flex justify-between items-end mt-12 px-8">
                          <div className="flex flex-col items-center">
                             <div className="font-bold text-lg border-b border-gray-800 px-4 min-w-[120px]">{formData.date}</div>
                             <div className="text-xs uppercase tracking-widest mt-1 opacity-70">Date</div>
                          </div>
                          
                          <div 
                            className="w-16 h-16 rounded-full border-2 border-gray-400 flex items-center justify-center opacity-70"
                            style={{ borderColor: `${activeAccent.hex}bb` }}
                          >
                            <div className="w-12 h-12 rounded-full border border-gray-400" style={{ borderColor: `${activeAccent.hex}aa` }}></div>
                          </div>

                          <div className="flex flex-col items-center">
                             <div className="h-8 border-b border-gray-800 px-4 min-w-[140px] flex items-end justify-center font-black" style={{ fontFamily: 'cursive' }}></div>
                             <div className="text-xs uppercase tracking-widest mt-1 opacity-70">{formData.signatureTitle || 'Signature'}</div>
                          </div>
                       </div>
                    </div>
                  )}

                  {template === 'survival' && (
                    <div className="w-full h-full flex flex-col flex-1 relative border border-[#22252a] p-8 pt-6" style={{ borderColor: `${activeAccent.hex}33` }}>
                       <div className="absolute top-0 right-0 text-black font-black text-xs px-2 py-1 uppercase tracking-widest" style={{ backgroundColor: activeAccent.hex }}>Official Record</div>
                       
                       <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 w-2/3 leading-none" style={{ color: activeAccent.hex }}>{getHeader()}</h1>
                       
                       <div className="mb-8">
                         <p className="text-xs uppercase opacity-70 mb-1 tracking-widest">Subject ID</p>
                         <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-6 border-b border-[#22252a] pb-2">{formData.athleteName || 'ATHLETE NAME'}</h2>
                         
                         <div className="bg-[#111316] border border-[#22252a] p-4 text-sm mb-4" style={{ borderColor: `${activeAccent.hex}22` }}>
                           <span className="font-bold uppercase mr-2" style={{ color: activeAccent.hex }}>{getToneText()}</span>
                           <span className="font-bold text-white uppercase">{formData.achievement}</span>
                         </div>
                         
                         {formData.detailText && (
                           <p className="text-xs uppercase text-gray-400 opacity-80 leading-relaxed max-w-[80%]">&quot;{formData.detailText}&quot;</p>
                         )}
                       </div>

                       <div className="mt-auto grid grid-cols-2 gap-8 text-xs uppercase pt-6 border-t border-[#22252a] items-end" style={{ borderTopColor: `${activeAccent.hex}33` }}>
                          <div>
                            <div className="opacity-50 mb-1">Timestamp / Date</div>
                            <div className="font-black text-white text-lg">{formData.date || '-'}</div>
                          </div>
                          <div className="text-right">
                            <div className="opacity-50 mb-1">{formData.signatureTitle || 'Authorized By'}</div>
                            <div className="font-bold text-gray-300">RunCard System</div>
                          </div>
                       </div>
                    </div>
                  )}

                  {template === 'minimal award' && (
                    <div className="w-full h-full flex flex-col flex-1 relative justify-center text-center">
                       
                       <div className="w-12 h-12 border-2 border-black rounded-full mx-auto mb-8 flex items-center justify-center" style={{ borderColor: activeAccent.hex }}>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeAccent.hex }}></div>
                       </div>

                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3">{formData.date}</p>
                       <h2 className="text-4xl font-extrabold tracking-tight uppercase mb-2">{formData.athleteName || 'ATHLETE NAME'}</h2>
                       
                       <p className="text-sm uppercase tracking-widest font-bold mb-6" style={{ color: activeAccent.hex }}>{getToneText()}</p>
                       
                       <h3 className="text-2xl font-bold uppercase tracking-tight text-black mb-4">{formData.achievement || 'ACHIEVEMENT'}</h3>
                       <p className="text-sm text-gray-500 max-w-sm mx-auto">{formData.detailText}</p>

                       <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end border-t border-gray-100 pt-6">
                         <div className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-70">{formData.signatureTitle}</div>
                       </div>
                    </div>
                  )}

                  {/* Watermark */}
                  <div className={`mt-auto text-center font-mono text-[9px] tracking-[0.25em] uppercase pt-4 border-t ${
                    ['community challenge', 'weekly board', 'clean white', 'minimal award', 'minimal nutrition', 'minimal gear', 'classic', 'elite', 'receipt', 'white', 'table', 'minimal'].includes(template) 
                      ? 'border-dashed border-gray-400 text-gray-400' 
                      : 'border-dashed border-brand-border opacity-40 text-white'
                  }`}>
                    {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Centered Ratio Dock */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#090b0e]/95 backdrop-blur border border-brand-border/85 px-2 py-1.5 rounded-full flex items-center gap-1 shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-10 hover:border-brand-border-strong transition-all">
            {[
              { id: "square", label: "1:1 Feed" },
              { id: "story", label: "9:16 Story" },
              { id: "landscape", label: "16:9 Classic" },
              { id: "compact", label: "Fit" },
              { id: "printable", label: "PDF/A4" }
            ].map((ratio) => {
              const isActive = exportSize === ratio.id;
              return (
                <button
                  key={ratio.id}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                                            window.dispatchEvent(new CustomEvent('export-size-changed', { detail: ratio.id }));
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer outline-none focus:outline-none whitespace-nowrap
                    ${isActive 
                      ? 'text-black font-extrabold' 
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-lowest/50'}`}
                  style={isActive ? { backgroundColor: activeAccent.hex } : undefined}
                >
                  {ratio.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* COLUMN 3: STYLE CONTROLS */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] min-w-0">
        <div className="flex flex-col gap-0.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">STYLE CONTROLS</span>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Tweak appearance</p>
        </div>
        
        <TemplateSelector 
          activeTemplate={template}
          onSelectTemplate={setTemplate}
          localTemplates={[
            {
              "id": "classic",
              "label": "Certificate Classic"
            },
            {
              "id": "survival",
              "label": "Survival Certificate"
            },
            {
              "id": "minimal award",
              "label": "Minimal Award"
            }
          ]}
        />
      </div>
    </div>
  );
}
