import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold uppercase tracking-tighter text-text-primary mb-6">
          RunCard Studio
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-text-muted mb-12">
          Create beautiful sports cards in seconds. No login. No database. Just export and share.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/studio?type=run-receipt"
            className="px-8 py-4 bg-primary-action text-white font-semibold uppercase tracking-wide rounded hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary-action focus:outline-none active:scale-[0.98]"
          >
            Create A Card <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#templates"
            className="px-8 py-4 bg-surface border border-brand-border text-text-primary font-semibold uppercase tracking-wide rounded hover:bg-surface-high transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-secondary-lime focus:outline-none active:scale-[0.98]"
          >
            <LayoutTemplate className="w-5 h-5" /> View Templates
          </a>
        </div>

        {/* Trust Strip */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 border-y border-brand-border py-6 w-full max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-mono uppercase text-secondary-lime">
            <span className="w-2 h-2 rounded-full bg-secondary-lime"></span> No Account
          </div>
          <div className="flex items-center gap-2 text-sm font-mono uppercase text-secondary-lime">
            <span className="w-2 h-2 rounded-full bg-secondary-lime"></span> No Database
          </div>
          <div className="flex items-center gap-2 text-sm font-mono uppercase text-secondary-lime">
            <span className="w-2 h-2 rounded-full bg-secondary-lime"></span> No Tracking
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section id="templates" className="max-w-[1280px] mx-auto px-4 md:px-8 pb-24 scroll-mt-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-text-primary">Performance Templates</h2>
          <p className="text-text-muted">Select a card type to start creating.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 01 Run Receipt */}
          <Link href="/studio?type=run-receipt" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">01</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Run Receipt</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Turn your run into a shareable receipt.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                {/* Abstract wireframe */}
                <div className="w-24 h-32 border border-brand-border bg-surface-low rounded flex flex-col p-2 space-y-2">
                   <div className="w-full h-2 bg-brand-border rounded-full"></div>
                   <div className="flex justify-between">
                     <div className="w-8 h-1 bg-brand-border rounded-full"></div>
                     <div className="w-8 h-1 bg-brand-border rounded-full"></div>
                   </div>
                   <div className="w-full h-6 border border-brand-border mt-auto rounded"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* 02 Race Recap */}
          <Link href="/studio?type=race-recap" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">02</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Race Recap</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Create a clean race result card.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-24 border border-brand-border bg-surface-low rounded flex p-2 gap-2 text-center">
                    <div className="flex-1 border border-brand-border flex items-center justify-center font-mono text-xs text-brand-border rounded">T</div>
                    <div className="flex-1 flex flex-col gap-2">
                       <div className="flex-1 border border-brand-border rounded"></div>
                       <div className="flex-1 border border-brand-border rounded"></div>
                    </div>
                </div>
              </div>
            </div>
          </Link>

          {/* 03 Workout Card */}
          <Link href="/studio?type=workout-card" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">03</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Workout Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Share structured sessions with your team.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-24 bg-surface-low rounded flex flex-col p-2 space-y-2 border border-brand-border">
                   <div className="w-full h-4 border border-brand-border rounded"></div>
                   <div className="w-3/4 h-3 border border-brand-border rounded"></div>
                   <div className="w-5/6 h-3 border border-brand-border rounded"></div>
                   <div className="w-full h-3 border border-brand-border rounded mt-auto"></div>
                </div>
              </div>
            </div>
          </Link>
          
          {/* 04 Race Split */}
          <Link href="/studio?type=race-split" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">04</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Race Split</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Plan your target splits visually.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-24 bg-surface-low border border-brand-border rounded grid grid-cols-3 grid-rows-3 text-center p-1 gap-1">
                    {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="border border-brand-border rounded-sm"></div>)}
                </div>
              </div>
            </div>
          </Link>

          {/* 05 Pace Band */}
          <Link href="/studio?type=pace-band" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">05</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Pace Band</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Build printable pacing bands.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-32 bg-surface-low border border-brand-border flex flex-col justify-between p-1 rounded-sm">
                   {[1,2,3,4].map(i => <div key={i} className="w-full h-2 bg-brand-border rounded-full"></div>)}
                </div>
              </div>
            </div>
          </Link>

          {/* 06 Damage Report */}
          <Link href="/studio?type=damage-report" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">06</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Damage Report</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Turn a hard session into a funny recovery report.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-32 border border-brand-border bg-surface-low rounded-full flex items-center justify-center relative overflow-hidden">
                   <div className="w-full h-1 bg-brand-border rotate-45 transform origin-center absolute"></div>
                   <div className="w-full h-1 bg-brand-border -rotate-45 transform origin-center absolute"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* 07 Race Bib */}
          <Link href="/studio?type=race-bib" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">07</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Race Bib</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Create a custom race bib mockup.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-40 h-28 border border-brand-border bg-surface-low rounded flex flex-col items-center justify-center p-2 relative">
                   <div className="w-4 h-4 rounded-full border border-brand-border absolute top-2 left-2"></div>
                   <div className="w-4 h-4 rounded-full border border-brand-border absolute top-2 right-2"></div>
                   <div className="w-4 h-4 rounded-full border border-brand-border absolute bottom-2 left-2"></div>
                   <div className="w-4 h-4 rounded-full border border-brand-border absolute bottom-2 right-2"></div>
                   <div className="w-full h-6 border-b border-brand-border absolute top-8"></div>
                   <div className="text-3xl font-black font-mono text-brand-border">314</div>
                </div>
              </div>
            </div>
          </Link>

          {/* 08 Race Checklist */}
          <Link href="/studio?type=race-checklist" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">08</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Race Checklist</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Build a race-day packing checklist.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-24 h-32 border border-brand-border bg-surface-low rounded flex flex-col p-4 gap-3 justify-center">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="w-4 h-4 border border-brand-border rounded-sm"></div>
                        <div className="w-full h-2 border border-brand-border rounded-sm"></div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Link>

          {/* 09 Sports Certificate */}
          <Link href="/studio?type=sports-certificate" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">09</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Sports Certificate</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Create a finish or survival certificate.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-40 h-28 border border-brand-border bg-surface-low rounded flex flex-col items-center p-3 relative">
                   <div className="w-full h-full border border-brand-border p-2 flex flex-col items-center gap-2">
                     <div className="w-12 h-12 border border-brand-border rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border border-brand-border rounded-full"></div>
                     </div>
                     <div className="w-20 h-2 border border-brand-border rounded-sm"></div>
                   </div>
                </div>
              </div>
            </div>
          </Link>

          {/* 10 Personal Best Card */}
          <Link href="/studio?type=personal-best" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">10</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Personal Best Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Celebrate a new PB with a clean stat card.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-28 h-32 border border-brand-border bg-surface-low rounded flex flex-col items-center justify-center p-4 gap-2">
                    <div className="text-2xl font-black font-mono text-brand-border">PB!</div>
                    <div className="w-full h-2 border border-brand-border rounded-sm"></div>
                    <div className="w-2/3 h-2 border border-brand-border rounded-sm"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* 11 Training Week Card */}
          <Link href="/studio?type=training-week" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">11</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Training Week Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Summarize a weekly training block manually.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-40 h-28 border border-brand-border bg-surface-low rounded grid grid-cols-7 gap-1 p-2 items-end">
                    {[2, 4, 3, 6, 2, 8, 10].map((h, i) => (
                      <div key={i} className="border border-brand-border w-full rounded-sm" style={{ height: `${h * 10}%` }}></div>
                    ))}
                </div>
              </div>
            </div>
          </Link>

          {/* 12 Goal Card */}
          <Link href="/studio?type=goal-card" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">12</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Goal Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Create a visual card for your next target.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-32 border border-brand-border bg-surface-low rounded-full flex flex-col items-center justify-center border-dashed">
                    <div className="w-16 h-16 border border-brand-border rounded-full flex items-center justify-center">
                       <div className="w-8 h-8 border border-brand-border rounded-full bg-brand-border"></div>
                    </div>
                </div>
              </div>
            </div>
          </Link>

          {/* 13 Challenge Card */}
          <Link href="/studio?type=challenge-card" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">13</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Challenge Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Create a solo or community challenge card.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-32 h-24 border border-brand-border bg-surface-low rounded flex items-end relative overflow-hidden">
                   <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-brand-border absolute bottom-0 left-4"></div>
                   <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-brand-border absolute bottom-0 right-2"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* 14 Fueling Plan Card */}
          <Link href="/studio?type=fueling-plan" className="group block h-full focus:outline-none">
             <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">14</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Fueling Plan Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Plan carbs, fluid, and sodium manually.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="w-24 h-32 border border-brand-border bg-surface-low rounded flex flex-col gap-4 p-4 justify-center">
                   <div className="flex gap-2 items-center">
                     <div className="min-w-4 h-4 border border-brand-border rounded-xl"></div>
                     <div className="w-full h-2 border border-brand-border rounded"></div>
                   </div>
                   <div className="flex gap-2 items-center">
                     <div className="min-w-4 h-4 border border-brand-border rounded-xl"></div>
                     <div className="w-full h-2 border border-brand-border rounded"></div>
                   </div>
                   <div className="flex gap-2 items-center">
                     <div className="min-w-4 h-4 border border-brand-border rounded-xl"></div>
                     <div className="w-full h-2 border border-brand-border rounded"></div>
                   </div>
                </div>
              </div>
            </div>
          </Link>

          {/* 15 Shoe Rotation Card */}
          <Link href="/studio?type=shoe-rotation" className="group block h-full focus:outline-none">
            <div className="h-full border border-brand-border bg-surface rounded p-6 group-hover:border-primary-action group-hover:bg-surface-high group-focus-visible:border-primary-action group-focus-visible:ring-1 group-focus-visible:ring-primary-action transition-all duration-200 flex flex-col active:scale-[0.98]">
              <div className="font-mono text-xs text-secondary-lime mb-2">15</div>
              <h3 className="font-bold uppercase tracking-wide text-lg mb-2 text-text-primary group-hover:text-primary-action transition-colors">Shoe Rotation Card</h3>
              <p className="text-text-muted text-sm mb-6 flex-1">Track shoe usage manually in a visual card.</p>
              <div className="w-full h-40 bg-surface-lowest border border-brand-border rounded flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity overflow-hidden">
                <div className="w-32 h-20 border border-brand-border bg-surface-low rounded-xl relative overflow-hidden flex flex-col justify-end">
                    <div className="w-[120%] h-4 bg-brand-border transform -rotate-6 translate-y-2 origin-bottom-left"></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
