import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, XCircle, HardDrive, FileText, Database, ShieldAlert, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12 w-full animate-fade-in pb-24 text-text-primary">
      {/* Back Button */}
      <div className="mb-8">
        <Link 
          href="/studio" 
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-text-muted hover:text-primary-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10 text-center md:text-left border-b border-brand-border pb-8">
        <div className="inline-flex p-3 bg-surface border border-brand-border rounded-full mb-4">
          <Shield className="w-8 h-8 text-secondary-lime" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-3">
          Privacy & Data Handling
        </h1>
        <p className="text-text-muted text-sm font-mono uppercase tracking-wide">
          LOCAL-FIRST // 100% PRIVATE // CLIENT-SIDE GENERATION
        </p>
      </div>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-text-muted">
        {/* Core Description */}
        <section className="bg-surface p-6 border border-brand-border rounded-lg">
          <p className="text-text-primary text-base mb-4 font-bold">
            RunCard Studio is a local-first application designed with absolute privacy at its core. 
            There are no backend servers, no remote databases, and no tracking APIs. Everything you do on 
            this site stays exclusively within memory and local storage of your web browser.
          </p>
          <p>
            You can verify this at any time by inspecting your browser&apos;s network requests or running the application fully offline.
          </p>
        </section>

        {/* Section 1: What we do */}
        <section id="what-runcard-does" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-secondary-lime shrink-0" />
            1. What RunCard Studio Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface p-4 border border-brand-border-muted rounded-md font-mono text-xs">
              <span className="text-white font-bold uppercase block mb-1">LOCAL-FIRST CALCULATIONS</span>
              Form inputs, pace-splits, and damage multipliers are calculated in real-time within your active browser tab.
            </div>
            <div className="bg-surface p-4 border border-brand-border-muted rounded-md font-mono text-xs">
              <span className="text-white font-bold uppercase block mb-1">MANUAL DATA INPUT</span>
              You have complete control. You enter your stats manually—no scraping or background account linking is used.
            </div>
            <div className="bg-surface p-4 border border-brand-border-muted rounded-md font-mono text-xs">
              <span className="text-white font-bold uppercase block mb-1">CLIENT-SIDE RENDERING</span>
              Your PNG images and PDFs are rendered directly inside your machine utilizing stable HTML canvas translation packages.
            </div>
            <div className="bg-surface p-4 border border-brand-border-muted rounded-md font-mono text-xs">
              <span className="text-white font-bold uppercase block mb-1">OPTIONAL SAFE DRAFTS</span>
              If requested, drafts can be saved to dry local storage without transmitting telemetry.
            </div>
          </div>
        </section>

        {/* Section 2: What we do not do */}
        <section id="what-runcard-does-not-do" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-primary-coral shrink-0" />
            2. What RunCard Studio Does Not Do
          </h2>
          <ul className="list-none space-y-3 pl-1 font-mono text-xs">
            <li className="flex items-start gap-2">
              <span className="text-primary-coral font-bold select-none">[✘]</span>
              <span><strong>No Login / Authentication:</strong> There are no user accounts, memberships, or sessions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral font-bold select-none">[✘]</span>
              <span><strong>No Database / Cloud Backend:</strong> We do not store or sync credentials or stats on any virtual machines.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral font-bold select-none">[✘]</span>
              <span><strong>No File Uplinking:</strong> Your pictures, routes, and GPX tracklogs are never uploaded or parsed by a web server.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral font-bold select-none">[✘]</span>
              <span><strong>No AI Processing:</strong> Core features are deterministic—no AI models process your inputs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral font-bold select-none">[✘]</span>
              <span><strong>No Garmin/Strava Sync:</strong> To protect athletic accounts, we construct cards without fragile direct OAuth sync flows.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-coral font-bold select-none">[✘]</span>
              <span><strong>No Tracking or Analytics:</strong> No cookies, no trackers, and no ad network packages are present in this code.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Local Data */}
        <section id="local-data" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-3 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-text-muted shrink-0" />
            3. Local Data
          </h2>
          <p className="mb-3">
            All user preferences (theme selection, watermark toggle, current generator state, session favorites, and session recents) 
            are stored inside the client browser. 
          </p>
          <p className="font-mono text-xs bg-surface-lowest p-3 border border-brand-border rounded">
            - Theme color variable: runcard-theme<br />
            - Default export size: runcard-default-export-size<br />
            - Selected watermarks status: runcard-watermark<br />
            - Active accent coloring: runcard-template-accent
          </p>
        </section>

        {/* Section 4: GPX Files */}
        <section id="gpx-files" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-text-muted shrink-0" />
            4. GPX Files
          </h2>
          <p className="mb-3">
            When you select a local `.gpx` file to render in the **Route Poster**, are your GPS coordinates sent over the wire? 
            <strong> Absolutely not.</strong>
          </p>
          <p className="mb-3">
            The GPX parsing engine operates completely serverless inside your browser tab using the DOMParser XML engine. It 
            reads the coordinate track points out of the secure schema, standardizes the latitude/longitude bounds, maps them to canvas 
            vectors, and yields an inline SVG line. 
          </p>
          <p>
            No data is cached on disk, and the GPX File object is never preserved in JSON states or drafts.
          </p>
        </section>

        {/* Section 5: Drafts */}
        <section id="drafts" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-text-muted shrink-0" />
            5. Drafts
          </h2>
          <p className="mb-3">
            When you manually select **Save Draft**, the application serializes only plain primitive attributes (Strings, Numbers, 
            Booleans, or simple arrays of metrics) into standard, safe browser LocalStorage under the key `runcard-drafts`.
          </p>
          <p className="mb-3">
            Our codebase runs active protective safeguards to detect and reject unsafe objects, circular events, DOM node elements, 
            or memory reference flags before they hit JSON strings.
          </p>
          <p>
            This ensures that your browser remains extremely fast, memory is managed pristine, and state errors never occur since 
            complex functional structures are never stored.
          </p>
        </section>

        {/* Section 6: Exported Files */}
        <section id="exported-files" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-text-muted shrink-0" />
            6. Exported Files
          </h2>
          <p>
            Whenever you export your card to a PNG image or generate a PDF race-split booklet, the file generation is 100% local. 
            The browser captures the DOM element container, creates a virtual canvas layer, applies standard visual rendering, and 
            triggers a silent download pointer. Nothing ever leaves your computer.
          </p>
        </section>

        {/* Section 7: Clear Local Data */}
        <section id="clear-local-data" className="border-t border-brand-border pt-6">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-3 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-primary-coral shrink-0" />
            7. Clear Local Data
          </h2>
          <p className="mb-4">
            Want to erase every scrap of your presence? You have total control. You do not need to submit a &quot;Delete Account Request&quot; 
            to an administrator. You can clear all drafts and reset all configurations instantly from our settings panel:
          </p>
          <div className="flex gap-4">
            <Link 
              id="privacy-clear-link"
              href="/settings" 
              className="px-4 py-2 border border-primary-action hover:bg-primary-action/10 text-primary-action text-xs font-mono font-bold uppercase rounded transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Erase Cache & Settings
            </Link>
            <Link 
              id="privacy-drafts-link"
              href="/drafts" 
              className="px-4 py-2 border border-brand-border hover:bg-surface text-white text-xs font-mono font-bold uppercase rounded transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" /> Manage Drafts
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
