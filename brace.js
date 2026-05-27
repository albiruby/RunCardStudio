const fs = require('fs');

function forceClose(file) {
    let text = fs.readFileSync(file, 'utf8');
    
    // Check if the file's final SharedTemplates block is missing its predecessor's `)}`
    // Wait, let's just count `{` and `}` in the whole file!
    let openBraces = 0;
    let inString = false;
    let stringChar = '';
    let inComment = false;
    // A full JSX brace counter is hard.
    
    // Instead, what if we just prepend `)}` before SharedTemplates?
    // If the template before it was missing `)}`, this will close it!
    // But wait, what if that template was also missing `</div>`? 
    // If we just replace `           {['carbon grid'` with `               )}\n           {['carbon grid'` ?
    
    if (text.includes(")}") && !text.includes(")}\n           {['carbon grid'")) {
        // we might need to close the previous template.
    }
}
