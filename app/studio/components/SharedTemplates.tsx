import React from 'react';

interface SharedTemplatesProps {
  template: string;
  formData: any;
  componentName: string;
  extraData?: any;
}

export default function SharedTemplates({ template, formData, componentName, extraData }: SharedTemplatesProps) {
  // Title extraction logic
  const title = String(
    formData.title || formData.name || formData.athleteName || formData.raceName || formData.sessionName || formData.runnerName || formData.achievement || 'RUN SUMMARY'
  );
  
  const dateStr = String(formData.date || formData.targetDate || formData.dateRange || formData.location || '');
  
  // Collect grid items for normal cards
  const gridItems = Object.entries(formData).filter(([k, v]) => {
    if (!v || v === false || typeof v === 'boolean') return false;
    if (['title','name','athleteName','raceName','sessionName','runnerName','date','targetDate','location','achievement','dateRange','id','createdAt','updatedAt','version','exportSize','cardType','template'].includes(k)) return false;
    if (Array.isArray(v) || typeof v === 'object') return false;
    return true;
  });

  const getLabel = (k: string) => {
    if (k.toLowerCase() === 'rpe') return 'RPE';
    return k.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
  };

  const renderContent = (themeClasses: any) => {
    if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
       return (
         <div className="flex-1 w-full text-center mt-2 pb-2">
            <div className={`grid grid-cols-2 text-[10px] uppercase font-bold tracking-widest pb-1 mb-2 border-b ${themeClasses.border}`}>
               <div>Dist</div><div>Pace/Cum</div>
            </div>
            <div className="flex flex-col gap-1 max-h-[80%] overflow-y-auto no-scrollbar">
              {extraData.splits.map((s: any, i: number) => (
                <div key={i} className={`grid grid-cols-2 text-sm font-mono items-center pb-1 border-b border-dashed ${themeClasses.borderDashed}`}>
                  <div className="font-bold">{s.km}</div>
                  <div>{s.current} <span className="opacity-50 text-[10px]">({s.total})</span></div>
                </div>
              ))}
            </div>
         </div>
       );
    }
    
    if (componentName === 'RaceSplitGenerator') {
       // Only show populated splits
       const splits = gridItems.filter(([k]) => k.startsWith('split'));
       const others = gridItems.filter(([k]) => !k.startsWith('split'));
       return (
         <div className="flex-1 w-full flex flex-col gap-4">
            <div className={`grid gap-2 ${template === 'split panel' || template === 'compact story' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {others.map(([k, v]) => (
                <div key={k} className={`flex flex-col flex-1 justify-center p-2 rounded ${themeClasses.card}`}>
                  <span className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${themeClasses.label}`}>{getLabel(k)}</span>
                  <span className={`text-sm font-bold truncate ${themeClasses.value}`}>{String(v)}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
              {splits.map(([k, v]) => (
                <div key={k} className={`flex justify-between items-center border-b pb-1 ${themeClasses.border}`}>
                  <span className={`text-[10px] uppercase font-bold ${themeClasses.label}`}>{k.replace('split', 'Split ')}</span>
                  <span className={`font-mono text-sm font-bold ${themeClasses.value}`}>{String(v)}</span>
                </div>
              ))}
            </div>
         </div>
       );
    }

    return (
      <div className={`flex-1 grid gap-3 ${template === 'compact story' ? 'grid-cols-1' : template === 'split panel' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'}`}>
        {gridItems.map(([k, v], i) => (
          <div key={k} className={`flex flex-col flex-1 min-h-[60px] justify-center p-3 rounded ${themeClasses.card}`}>
            <span className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${themeClasses.label}`}>{getLabel(k)}</span>
            <span className={`text-sm font-bold truncate ${themeClasses.value}`}>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  };

  const watermark = <div className={`mt-auto text-right text-[8px] uppercase tracking-widest font-mono opacity-40 pt-4 ${(template === 'print utility' || template === 'minimal white') ? 'text-black' : 'text-white'}`}>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}</div>;

  // 04 Carbon Grid
  if (template === 'carbon grid') {
    return (
      <div className="w-[480px] min-h-[500px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#181a1f] border border-[#22252a] text-[#f2f4f7] font-mono">
         <div className="absolute inset-0 bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:12px_12px] opacity-80 z-0"></div>
         <div className="relative z-10 p-8 flex flex-col h-full">
            <div className="mb-6 pb-4 border-b border-[#22252a]">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight text-white mb-1">{title}</h1>
              <div className="text-[10px] uppercase tracking-widest text-[#a0cc00] font-bold">{dateStr}</div>
            </div>
            {renderContent({
               card: 'border border-[#22252a] bg-[#121316]',
               label: 'text-primary-coral',
               value: 'text-white',
               border: 'border-[#22252a]',
               borderDashed: 'border-[#22252a]/50'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 05 Race Poster Pro
  if (template === 'race poster pro') {
    return (
      <div className="w-[480px] min-h-[500px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#0f1012] border-2 border-[#181a1f] text-white">
         <div className="h-4 bg-primary-coral w-full"></div>
         <div className="p-8 flex flex-col h-full font-sans">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{title}</h1>
            <div className="text-xs uppercase tracking-widest text-secondary-lime font-bold mb-8">{dateStr}</div>
            {renderContent({
               card: 'border-l-2 border-primary-coral pl-3 bg-[#181a1f]/50',
               label: 'text-gray-400',
               value: 'text-white text-lg',
               border: 'border-[#22252a]',
               borderDashed: 'border-[#22252a]/50'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 06 Minimal White
  if (template === 'minimal white') {
    return (
      <div className="w-[480px] min-h-[500px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#f4f4f5] border border-[#e4e4e7] text-[#18181b]">
         <div className="p-8 flex flex-col h-full font-sans">
            <div className="mb-8 border-b-2 border-[#18181b] pb-4">
              <h1 className="text-3xl font-black uppercase tracking-tight leading-tight text-black">{title}</h1>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2">{dateStr}</div>
            </div>
            {renderContent({
               card: 'border border-[#e4e4e7] bg-white',
               label: 'text-gray-500',
               value: 'text-black',
               border: 'border-[#e4e4e7]',
               borderDashed: 'border-[#e4e4e7]/50'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 07 Split Panel
  if (template === 'split panel') {
    return (
      <div className="w-[480px] min-h-[500px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#111316] text-[#f2f4f7] p-6 font-mono">
         <div className="bg-[#181a1f] rounded text-center p-6 mb-4 border border-[#22252a]">
           <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight text-secondary-lime">{title}</h1>
           <div className="text-[9px] uppercase tracking-widest text-gray-400 mt-2">{dateStr}</div>
         </div>
         <div className="flex-1 flex flex-col">
            {renderContent({
               card: 'border border-[#22252a] bg-[#181a1f]/50',
               label: 'text-primary-coral',
               value: 'text-white',
               border: 'border-[#22252a]',
               borderDashed: 'border-[#22252a]/50'
            })}
         </div>
         {watermark}
      </div>
    );
  }

  // 08 Neon Edge
  if (template === 'neon edge') {
    return (
      <div className="w-[480px] min-h-[500px] flex flex-col shadow-[0_0_20px_rgba(160,204,0,0.15)] relative transition-all duration-300 select-none overflow-hidden bg-[#0a0b0d] border border-secondary-lime text-white">
         <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-lime/10 blur-3xl rounded-full"></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-coral/10 blur-3xl rounded-full"></div>
         <div className="p-8 flex flex-col h-full relative z-10 font-sans">
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-tight text-secondary-lime mb-2">{title}</h1>
            <div className="text-xs uppercase tracking-widest text-gray-300 mb-8 border-l-2 border-primary-coral pl-3">{dateStr}</div>
            {renderContent({
               card: 'border-l-2 border-secondary-lime bg-black/50',
               label: 'text-primary-coral',
               value: 'text-white',
               border: 'border-secondary-lime/30',
               borderDashed: 'border-secondary-lime/20'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 09 Print Utility
  if (template === 'print utility') {
    return (
      <div className="w-[480px] min-h-[500px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-white text-black border border-gray-300 p-8 font-sans">
         <h1 className="text-3xl font-bold uppercase tracking-tight text-black mb-1">{title}</h1>
         <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-6 pb-2 border-b-2 border-black">{dateStr}</div>
         <div className="flex-1 flex flex-col">
            {renderContent({
               card: 'border-b border-gray-200 rounded-none bg-transparent',
               label: 'text-gray-500',
               value: 'text-black',
               border: 'border-gray-200',
               borderDashed: 'border-gray-200'
            })}
         </div>
         {watermark}
      </div>
    );
  }

  // 10 Compact Story
  if (template === 'compact story') {
    return (
      <div className="w-[480px] min-h-[640px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-gradient-to-b from-[#181a1f] to-[#07080a] border border-[#22252a] text-white p-6 font-sans">
         <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-primary-action/20 to-transparent"></div>
         <div className="relative z-10 flex flex-col h-full pt-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none text-primary-action mb-2 text-center">{title}</h1>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-10 text-center">{dateStr}</div>
            
            <div className="bg-[#121316]/80 rounded-xl border border-[#22252a] p-6 flex-1 flex flex-col backdrop-blur-sm">
               {renderContent({
                  card: 'border-b border-[#22252a] bg-transparent',
                  label: 'text-secondary-lime',
                  value: 'text-white',
                  border: 'border-[#22252a]',
                  borderDashed: 'border-[#22252a]/50'
               })}
            </div>
            {watermark}
         </div>
      </div>
    );
  }

  return null;
}
