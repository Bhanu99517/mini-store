import AppShowcase from './components/AppShowcase';

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Styled according to the Sleek Interface */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm transition-transform duration-300 hover:scale-105 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=80&auto=format&fit=crop&q=80" 
              alt="mini store" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-slate-700 font-sans">
              Mini Store
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div id="landing-container" className="relative min-h-screen bg-slate-50/50 flex flex-col font-sans select-none antialiased overflow-x-hidden">
      {/* Dynamic Ambient Background Elements confined to container bounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 right-1/4 h-96 bg-radial from-blue-500/4 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-[800px] left-10 h-72 w-72 bg-emerald-500/[0.02] rounded-full blur-2xl" />
      </div>

      {/* Modern Header Component */}
      <Header />

      {/* Main Single Page Scopes Container */}
      <main className="flex-grow">
        
        {/* Dynamic App Specs & Live Mock Step Tour */}
        <section className="relative overflow-hidden py-1">
          <AppShowcase />
        </section>

      </main>

      {/* Elegant, Minimalist Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-xs text-slate-400 font-sans mx-auto text-center">
              &copy; {new Date().getFullYear()} Mini Store. All rights reserved. Play Protect Verified.
            </p>
          </div>
        </div>
      </footer>


    </div>
  );
}
