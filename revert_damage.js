const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // We need to revert the damage done by the exact string: `)}\n            </div>\n`
  // Because I wrote: `content.replace(regex, ')}\n            </div>\n');`
  
  // Actually, wait! The regex was: `/<\/div>\s*\)\}\s*/g`
  // It matched `</div>` followed by whitespace, then `)}`, then whitespace.
  // And replaced it with `)}\n            </div>\n`.
  
  // So any place where there was `</div>` THEN `)}` became `)}\n            </div>\n`.
  // Wait, I inverted them!
  // So now the file has `)}\n            </div>\n` instead of whatever spacing it had before.
  // To revert, I must find `)}\n            </div>\n` and replace it with `            </div>\n              )}`. (Spacing doesn't matter for syntax).
  
  // BUT WAIT! The *legitimate* `)}\n            </div>` that was there ORIGINALLY...
  // Was it `</div>` then `)}`?
  // NO! The legitimate one was `)}` then `</div>`!
  // Look at `PaceBandGenerator`'s original end:
  //                 </div>
  //              )}
  //            </div>
  //
  // Here, `</div>` is followed by `)}` !! 
  // Wait! Yes! `</div>\n              )}` !!
  // And my regex `/<\/div>\s*\)\}\s*/g` MATCHED IT!
  // AND it replaced it with `)}\n            </div>\n`!
  // WHICH IS THE SAME ORDER!!! `)}` THEN `</div>`!
  
  // Wait, if it matched `</div>` then `)}`, and replaced it with `)}` then `</div>`, then it REVERSED the order!!!
  // Wait, `</div>\n              )}` means the div closed, and THEN the template closed.
  // This is CORRECT! Because the template OPENED a div! `{template === 'phone' && (  <div ...> ... </div> )}`.
  // So `</div>` THEN `)}` is the CORRECT order!
  // And my regex replaced it with `)}` THEN `</div>`!!!
  // WHICH IS INCORRECT!  Because it closes the template BEFORE closing the div!
  
  // So ALL I HAVE TO DO to fix the syntax is to swap them BACK!
  // I replaced them with the EXACT sequence: `)}\n            </div>\n`
  // I need to change `)}\n            </div>\n` BACK to `            </div>\n              )}\n`.
  
  // Let's replace ALL `)}\n            </div>\n` with `            </div>\n              )}\n`
  // Including the one at the end of previewRef! Because that one was ALSO `</div>` then `)}`!
  // Wait, was the end of previewRef `</div>` then `)}`?
  // YES! The end of previewRef was `</div>` then `)}`! Wait, no!
  // The previewRef itself is a `<div>`!
  // So after the LAST template's `)}`, there is the `</div>` that closes the previewRef!
  // I.e. `)}\n            </div>`.
  // Wait! If the original file had `)}\n            </div>` (template closes, THEN previewRef closes),
  // Did my regex `/<\/div>\s*\)\}\s*/g` match it?
  // NO! Because my regex looks for `</div>` THEN `)}`.
  // My regex ONLY matched when a template wrapped a div: `<div> ... </div>)}`.
  // So my regex ONLY corrupted the templates, not the previewRef closing!
  // But because it replaced it with `)}\n            </div>\n`, now I have `)}\n            </div>\n` for ALL corrupted templates.
  
  content = content.replace(/\)\}\n            <\/div>\n/g, '            </div>\n              )}\n');
  
  fs.writeFileSync('app/studio/components/' + file, content);
}
console.log('Reverted damage');
