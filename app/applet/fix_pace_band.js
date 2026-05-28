const fs = require('fs');
const path = require('path');

const filePath = 'app/studio/components/PaceBandGenerator.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix template IDs
content = content.replace(/'phone lockscreen'/g, "'phone-lockscreen'");
content = content.replace(/'printable a4'/g, "'printable-a4'");
content = content.replace(/"phone lockscreen"/g, '"phone-lockscreen"');
content = content.replace(/"printable a4"/g, '"printable-a4"');


// 2. Fix Validation Logic
const oldValidation = `  // Validation
  const hrVal = parseInt(formData.hr);
  const minVal = parseInt(formData.min);
  const secVal = parseInt(formData.sec);
  const isTimeInvalid = isNaN(hrVal) || isNaN(minVal) || isNaN(secVal) || hrVal < 0 || minVal < 0 || minVal >= 60 || secVal < 0 || secVal >= 60;`;

const newValidation = `  // Validation
  const hrVal = parseInt(formData.hr, 10);
  const minVal = parseInt(formData.min, 10);
  const secVal = parseInt(formData.sec, 10);
  const hasEmptyTime = formData.hr === "" || formData.min === "" || formData.sec === "";
  const isTimeFormatInvalid = !hasEmptyTime && (isNaN(hrVal) || isNaN(minVal) || isNaN(secVal) || hrVal < 0 || minVal < 0 || minVal >= 60 || secVal < 0 || secVal >= 60);
  const isTimeZero = !hasEmptyTime && !isTimeFormatInvalid && hrVal === 0 && minVal === 0 && secVal === 0;
  const isTimeInvalid = isTimeFormatInvalid || isTimeZero;`;

content = content.replace(oldValidation, newValidation);

// 3. Fix Validation UI Message
const oldValMsg = `<p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                 <AlertCircle className="w-3.5 h-3.5" /> Please check MM/SS constraints (00-59)
 </p>`;
const newValMsg = `<p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                 <AlertCircle className="w-3.5 h-3.5" /> {isTimeZero ? "Time must be greater than 0" : "Please check MM/SS constraints (00-59)"}
 </p>`;
content = content.replace(oldValMsg, newValMsg);

// 4. Update Copy text
const oldHandleCopy = `  const handleCopy = () => {
    const lines = [];
    if (formData.distanceChoice !== undefined && formData.distanceChoice !== null && (formData.distanceChoice as any) !== false && (formData.distanceChoice as any) !== "—" && (formData.distanceChoice as any) !== "Input required" && String(formData.distanceChoice).trim() !== "") {
      const val = typeof formData.distanceChoice === 'boolean' ? 'Yes' : formData.distanceChoice;
      lines.push("Distance Choice: " + val);
    }
    if (formData.customDistance !== undefined && formData.customDistance !== null && (formData.customDistance as any) !== false && (formData.customDistance as any) !== "—" && (formData.customDistance as any) !== "Input required" && String(formData.customDistance).trim() !== "") {
      const val = typeof formData.customDistance === 'boolean' ? 'Yes' : formData.customDistance;
      lines.push("Custom Distance: " + val);
    }
    if (formData.hr !== undefined && formData.hr !== null && (formData.hr as any) !== false && (formData.hr as any) !== "—" && (formData.hr as any) !== "Input required" && String(formData.hr).trim() !== "") {
      const val = typeof formData.hr === 'boolean' ? 'Yes' : formData.hr;
      lines.push("Hr: " + val);
    }
    if (formData.min !== undefined && formData.min !== null && (formData.min as any) !== false && (formData.min as any) !== "—" && (formData.min as any) !== "Input required" && String(formData.min).trim() !== "") {
      const val = typeof formData.min === 'boolean' ? 'Yes' : formData.min;
      lines.push("Min: " + val);
    }
    if (formData.sec !== undefined && formData.sec !== null && (formData.sec as any) !== false && (formData.sec as any) !== "—" && (formData.sec as any) !== "Input required" && String(formData.sec).trim() !== "") {
      const val = typeof formData.sec === 'boolean' ? 'Yes' : formData.sec;
      lines.push("Sec: " + val);
    }
    if (formData.interval !== undefined && formData.interval !== null && (formData.interval as any) !== false && (formData.interval as any) !== "—" && (formData.interval as any) !== "Input required" && String(formData.interval).trim() !== "") {
      const val = typeof formData.interval === 'boolean' ? 'Yes' : formData.interval;
      lines.push("Interval: " + val);
    }
    lines.push("");
    lines.push("Made with RunCard Studio");
    const textToCopy = lines.join("\\n");`;

const newHandleCopy = `  const handleCopy = () => {
    const lines = [];
    lines.push("PACE BAND");
    
    const hStr = isNaN(hrVal) ? '00' : hrVal.toString().padStart(2, '0');
    const mStr = isNaN(minVal) ? '00' : minVal.toString().padStart(2, '0');
    const sStr = isNaN(secVal) ? '00' : secVal.toString().padStart(2, '0');
    const formattedTarget = \`\${hStr}:\${mStr}:\${sStr}\`;
    
    if (dist > 0 && rawSecs > 0) {
      lines.push(\`Event: \${dist} \${unit.toUpperCase()}\`);
      lines.push(\`Target: \${formattedTarget}\`);
      lines.push(\`Pace: \${formatPace(avgPaceSecs)}/\${unit}\`);
      lines.push("");
      lines.push("Splits:");
      splits.forEach((s, idx) => {
        const isFinal = idx === splits.length - 1;
        const markerStr = isFinal ? "Final" : s.marker + unit.toUpperCase();
        lines.push(\`\${markerStr} - \${formatTime(s.cumTime)}\`);
      });
    } else {
      lines.push("No valid pace band data.");
    }
    lines.push("");
    lines.push("Made with RunCard Studio");
    const textToCopy = lines.join("\\n");`;

content = content.replace(oldHandleCopy, newHandleCopy);

// 5. Build dynamic preview 
const oldPreviewStart = `{template === 'wristband' && (`;
const oldPreviewEnd = `)}

            {['wristband', 'phone-lockscreen', 'printable-a4'].includes(template) ? (
               <div className="absolute bottom-2 left-0 right-0 text-center font-mono text-[9px] tracking-[0.25em] uppercase opacity-40 text-gray-400">
                {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
              </div>
            ) : (
              <SharedTemplates template={template} formData={formData} componentName="PaceBandGenerator" extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }} />
            )}`;

const startIdx = content.indexOf(oldPreviewStart);
if (startIdx !== -1) {
  const endIdx = content.indexOf(')}', content.indexOf('SharedTemplates template={template}')) + 2;
  const beforePreview = content.substring(0, startIdx);
  const afterPreview = content.substring(endIdx);
  
  const newPreviewRenderer = `{(() => {
                const isInputMissing = dist <= 0 || rawSecs <= 0 || isNaN(hrVal) || isNaN(minVal) || isNaN(secVal);
                const isDarkTemplate = template === 'phone-lockscreen';
                
                if (isInputMissing) {
                   return (
                     <div className="flex flex-col items-center justify-center w-full h-full text-center gap-3 p-8 pt-12 min-h-[300px]">
                        <AlertCircle className={\`w-10 h-10 \${isDarkTemplate ? 'text-gray-700' : 'text-gray-300'}\`} />
                        <div className={\`font-mono text-[10px] uppercase tracking-widest \${isDarkTemplate ? 'text-gray-500' : 'text-gray-400'}\`}>Check target time and distance</div>
                     </div>
                   );
                }

                return (
                  <>
                    {template === 'wristband' && (
                      <div className="w-full h-full flex flex-col font-mono text-[10px] uppercase bg-white text-black min-h-full">
                         <div className="bg-black text-white text-center py-4 px-2 pb-3">
                           <div className="uppercase font-bold mb-1 opacity-80 text-[8px] tracking-widest">{formData.distanceChoice === 'Custom' ? 'Custom Dist' : formData.distanceChoice}</div>
                           <div className="text-xl font-black mb-1.5 leading-none">{(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}</div>
                           <div className="text-[8.5px] text-secondary-lime font-black tracking-widest">PACE {formatPace(avgPaceSecs)}</div>
                         </div>
                         <div className="flex border-b border-black text-center font-bold bg-gray-100 font-mono text-[9px] py-1.5">
                           <div className="w-1/3 border-r border-black">{unit.toUpperCase()}</div>
                           <div className="w-2/3">CUM TIME</div>
                         </div>
                         <div className="flex flex-col pb-4 h-full">
                           {splits.map((s, i) => (
                             <div key={i} className="flex border-b border-gray-200 text-center font-mono py-1.5">
                               <div className="w-1/3 border-r border-gray-200 font-black flex items-center justify-center text-gray-800">
                                 {s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}
                               </div>
                               <div className={\`w-2/3 flex items-center justify-center text-black font-semibold \${i === splits.length - 1 ? 'text-primary-coral font-black' : ''}\`}>
                                 {formatTime(s.cumTime)}
                               </div>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                    
                    {template === 'phone-lockscreen' && (
                      <div className="w-full flex flex-col font-mono uppercase bg-[#0a0b0d] text-white p-6 pb-12 h-full">
                        <div className="flex flex-col items-center mt-8 mb-8 text-center">
                           <div className="text-secondary-lime text-[10px] font-bold tracking-[0.3em] mb-3">PACE BAND</div>
                           <div className="text-5xl font-black tracking-tighter mb-2">{(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}</div>
                           <div className="flex items-center gap-3">
                             <div className="text-[10px] text-gray-400 tracking-widest bg-white/10 px-2 py-0.5 rounded">{formData.distanceChoice === 'Custom' ? (\`\${dist}\${unit}\`) : formData.distanceChoice}</div>
                             <div className="text-[10px] text-primary-coral font-bold tracking-widest">{formatPace(avgPaceSecs)}/{unit}</div>
                           </div>
                        </div>
                        
                        <div className="flex flex-col w-full px-2 gap-2 mt-auto pb-4">
                          {splits.map((s, i) => {
                            const isFinal = i === splits.length - 1;
                            const isKeySplit = s.marker % 5 === 0 || isFinal || s.marker === 10 || s.marker === 21.1 || s.marker === 42.2;
                            // For phone, if interval is 1km and marathon, there are 42 splits. We must filter.
                            if (splits.length > 15 && !isKeySplit) return null;
                            
                            return (
                             <div key={i} className={\`flex justify-between items-center py-2.5 border-b \${isFinal ? 'border-primary-coral/50 text-white font-bold' : 'border-gray-800 text-gray-300'}\`}>
                               <div className="font-mono text-sm tracking-widest">{s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}<span className="text-[9px] text-gray-500 ml-0.5">{unit}</span></div>
                               <div className={\`font-mono text-lg \${isFinal ? 'text-primary-coral font-black' : 'font-medium'}\`}>{formatTime(s.cumTime)}</div>
                             </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {template === 'printable-a4' && (
                      <div className="w-full flex flex-col font-sans bg-white text-black p-8 pb-16 h-full min-h-[842px]">
                        <div className="w-full flex items-end justify-between border-b-4 border-black pb-4 mb-8">
                           <div>
                             <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Pace Band</h1>
                             <div className="text-base text-gray-500 font-mono tracking-widest uppercase">Print Sheet &bull; {formData.interval}{unit} Splits</div>
                           </div>
                           <div className="text-right">
                             <div className="text-sm text-gray-500 font-mono uppercase tracking-widest mb-1">{formData.distanceChoice === 'Custom' ? (\`\${dist} \${unit}\`) : formData.distanceChoice}</div>
                             <div className="text-3xl font-black font-mono">{(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}</div>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 text-black w-full h-full">
                          <div className="flex flex-col">
                            <div className="flex border-b-2 border-black font-mono font-bold text-xs uppercase tracking-widest py-2">
                              <div className="w-1/2">Distance</div>
                              <div className="w-1/2 text-right">Cumulative</div>
                            </div>
                            {splits.slice(0, Math.ceil(splits.length / 2)).map((s, i) => (
                              <div key={i} className="flex border-b border-gray-200 font-mono text-sm py-2.5">
                                <div className="w-1/2 text-gray-600 font-bold">{s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}<span className="text-[10px] ml-0.5">{unit}</span></div>
                                <div className="w-1/2 text-right font-black text-lg">{formatTime(s.cumTime)}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex border-b-2 border-black font-mono font-bold text-xs uppercase tracking-widest py-2">
                              <div className="w-1/2">Distance</div>
                              <div className="w-1/2 text-right">Cumulative</div>
                            </div>
                            {splits.slice(Math.ceil(splits.length / 2)).map((s, i) => {
                               const isFinal = i === splits.slice(Math.ceil(splits.length / 2)).length - 1;
                               return (
                              <div key={i} className={\`flex border-b \${isFinal ? 'border-primary-action' : 'border-gray-200'} font-mono text-sm py-2.5\`}>
                                <div className={\`w-1/2 \${isFinal ? 'text-primary-action font-black' : 'text-gray-600 font-bold'}\`}>{s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}<span className="text-[10px] ml-0.5">{unit}</span></div>
                                <div className={\`w-1/2 text-right text-lg \${isFinal ? 'text-primary-action font-black' : 'text-black font-black'}\`}>{formatTime(s.cumTime)}</div>
                              </div>
                            )})}
                          </div>
                        </div>
                        
                        <div className="mt-8 border-t border-dashed border-gray-400 pt-6">
                           <div className="font-mono text-xs uppercase text-gray-400 tracking-widest flex justify-between items-center">
                             <span>Average Pace: {formatPace(avgPaceSecs)}/{unit}</span>
                             <span>Fold or cut along lines to carry</span>
                           </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={\`absolute bottom-3 left-0 right-0 text-center font-mono text-[9px] tracking-[0.25em] uppercase opacity-40 \${template === 'phone-lockscreen' ? 'text-gray-400' : 'text-gray-500'}\`}>
                      {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
                    </div>
                  </>
                );
             })()}`;
  
  content = beforePreview + newPreviewRenderer + afterPreview;
  
  // also update width classes for preview 
  //                ${template === 'wristband' ? 'w-[140px] bg-white text-black min-h-[350px] border border-gray-300 rounded' : ''}
  content = content.replace("w-[140px] bg-white text-black min-h-[350px] border border-gray-300 rounded", "w-[150px] bg-white text-black min-h-[450px] border border-gray-300 rounded");
  content = content.replace("w-[320px] h-[640px] bg-[#090b0e] text-white border-4 border-[#22252a] rounded-[2.5rem]", "w-[360px] h-[640px] bg-[#0a0b0d] text-white border-4 border-[#22252a] rounded-[2.5rem] overflow-hidden");
  content = content.replace("w-[595px] min-h-[800px] bg-white text-black p-8 border border-gray-350", "w-[595px] min-h-[842px] bg-white text-black border border-gray-300");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('PaceBand updated successfully');
