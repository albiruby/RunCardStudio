const fs = require('fs');

let files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // 1. Fix the previewRef closing div mixup.
  // We know the file ends with:
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  //
  // BUT the previewRef's `</div>` got pushed UP before the last `)}`!
  // So it usually looks like:
  //      </div>
  //   )}
  //   </div>
  // </div>
  // 
  // Let's just fix it by string math!
  // Find the LAST `useState` or whatever? No, just match the very end!
  content = content.replace(/<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/g, ')}\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n} \n');
  content = content.replace(/<\/>\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/g, '</>\n              )}\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n} \n');

  // Let's also fix DamageReport manually because I messed it up badly
  if (file === 'DamageReportGenerator.tsx') {
     // The end of DamageReport is scrambled:
     // {formData.notes && ( ... &quot;</div>)}</div>)}
     // Let's restore the end of DamageReport!
     // We can just wipe out everything after Final Verdict and rebuild it clean!
     const beforeVerdict = content.indexOf('{formData.finalVerdict && (');
     if (beforeVerdict !== -1) {
        let rebuild = content.substring(0, beforeVerdict);
        rebuild += `{formData.finalVerdict && (
                      <div className="mb-2">
                        <span className={\`font-mono text-[10px] uppercase block mb-1 \${template === 'neon' ? 'text-[#ff0055]' : 'text-primary-coral'}\`}>Final Verdict</span>
                        <span className="font-black text-xl uppercase tracking-wide">{formData.finalVerdict}</span>
                      </div>
                    )}
                    {formData.notes && (
                      <div className={\`text-sm italic font-serif \${template === 'receipt' ? 'text-gray-600' : 'text-gray-400'}\`}>&quot;{formData.notes}&quot;</div>
                    )}
                  </div>
                  <div className={\`text-center font-mono text-[9px] tracking-[0.25em] uppercase mt-auto pt-4 border-t \${template === 'receipt' ? 'border-dashed border-gray-400 text-gray-400' : (template === 'neon' ? 'border-[#ff0055]/20 text-[#ff0055]/50' : 'border-dashed border-[#22252a] opacity-40')}\`}>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}</div>
                )}
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="DamageReportGenerator"  />
           )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;
        content = rebuild;
     }
  }

  fs.writeFileSync('app/studio/components/' + file, content);
}
console.log('Fixed bottoms');
