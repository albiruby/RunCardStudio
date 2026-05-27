const fs = require('fs');

// We will overwrite the five files with a freshly generated script that
// reads them, rips out everything from `<div ref={containerRef}` downwards,
// and replaces it with a clean, perfectly structured tail that includes
// the exact `template === ...` handlers for the original templates.
// WAIT - I can't easily recreate the template layouts since they were long!
