import { useState, useEffect } from 'react';
import { 
  Check, 
  QrCode, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface BuildMetaData {
  version: string;
  buildNumber: number;
  fileSize: string;
  releaseDate: string;
  sha256: string;
  minAndroidVersion: string;
  targetAndroidVersion: string;
}

const CURRENT_BUILD: BuildMetaData = {
  version: '2.4.12',
  buildNumber: 10421,
  fileSize: '18.4 MB',
  releaseDate: 'June 3, 2026',
  sha256: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
  minAndroidVersion: 'Android 8.0 (Oreo, API 26)',
  targetAndroidVersion: 'Android 14.0 (Upside Down Cake, API 34)'
};

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

function ImageWithFallback({ src, alt, className, fallbackText = 'App' }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const initials = fallbackText.trim().slice(0, 2).toUpperCase();

  if (hasError || !src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-[#01875f] font-extrabold select-none ${className}`}>
        <span className="text-center tracking-tighter text-xs sm:text-sm leading-none">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

function ScreenshotWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-200/50 rounded-xl p-4 text-center aspect-[9/16] ${className}`}>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preview Hidden</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

const ALL_APPS = [
  {
    id: 'PSS Trust',
    name: 'PSS Trust APK',
    publisher: 'bhanutechlab.',
    publisherUrl: 'https://bhanutechlab.vercel.app/projects',
    logoUrl: "https://rdnrbgocszptdiljdcvw.supabase.co/storage/v1/object/public/shared-files/7173b553-2c48-4f0a-9338-6c5ee1e3814d/e5f97db3-aa68-45bf-b781-70b6ea48a9a3.jpg",
    downloads: '50+',
    size: '4.8 MB',
    apkUrl: 'https://rdnrbgocszptdiljdcvw.supabase.co/storage/v1/object/public/shared-files/7173b553-2c48-4f0a-9338-6c5ee1e3814d/3d231777-2aa7-47e6-a04c-d7aa1634ac3d.apk',
    qrCodeUrl: 'https://rdnrbgocszptdiljdcvw.supabase.co/storage/v1/object/public/shared-files/7173b553-2c48-4f0a-9338-6c5ee1e3814d/9f4debf0-3a28-4334-a6cb-6e5de9ff5d25.png',
    description: 'Aurora Stream is alternative open staging software offering fast audio video playback, responsive download staging layers, and local cryptographic verification. Seamlessly stream multimedia packages without account requirements.',
    slides: [
      { id: 1, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80" },
      { id: 2, img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&auto=format&fit=crop&q=80" },
      { id: 3, img: "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?w=500&auto=format&fit=crop&q=80" },
      { id: 4, img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80" }
    ]
  }
];

export default function AppShowcase() {
  const [activeAppId, setActiveAppId] = useState<string>('PSS Trust');
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  
  // High fidelity download tracking states
  const [downloadProgress, setDownloadProgress] = useState<'idle' | 'downloading' | 'installing' | 'success' | 'error'>('idle');
  const [downloadPercent, setDownloadPercent] = useState<number>(0);
  
  const [qrModal, setQrModal] = useState<boolean>(false);
  const [aboutModal, setAboutModal] = useState<boolean>(false);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Synchronize state with URL query parameters for dynamic browser transitions
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const appFromUrl = params.get('app');
      if (appFromUrl && ALL_APPS.some(app => app.id === appFromUrl)) {
        setActiveAppId(appFromUrl);
        setIsCardOpen(true);
        setIsAppLoading(true);
        setTimeout(() => {
          setIsAppLoading(false);
        }, 500);
      } else {
        setIsCardOpen(false);
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const selectAppAndChangeUrl = (appId: string) => {
    setIsAppLoading(true);
    setActiveAppId(appId);
    setIsCardOpen(true);
    setDownloadProgress('idle');
    setDownloadPercent(0);
    
    // Smooth custom route update for professional URL tracking
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('app', appId);
    window.history.pushState({ app: appId }, '', newUrl.pathname + newUrl.search + newUrl.hash);

    // Scroll smoothly to the top of the viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsAppLoading(false);
    }, 500);
  };

  const closeCardAndGoBack = () => {
    setIsCardOpen(false);
    
    // Smooth navigation back to root of app catalog
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('app');
    window.history.pushState({}, '', newUrl.pathname + newUrl.search + newUrl.hash);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeApp = ALL_APPS.find((app) => app.id === activeAppId) || ALL_APPS[0];

  // Hook into keyboard events when the popup is open
  useEffect(() => {
    if (popupIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPopupIndex((prev) => (prev !== null ? (prev - 1 + activeApp.slides.length) % activeApp.slides.length : null));
      } else if (e.key === 'ArrowRight') {
        setPopupIndex((prev) => (prev !== null ? (prev + 1) % activeApp.slides.length : null));
      } else if (e.key === 'Escape') {
        setPopupIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [popupIndex, activeApp]);

  const getEffectiveApkUrl = (appId: string, customApkParam: string | null) => {
    if (customApkParam) return customApkParam;
    const foundApp = ALL_APPS.find(app => app.id === appId || app.name === appId);
    if (foundApp && foundApp.apkUrl) {
      return foundApp.apkUrl;
    }
    return `https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/${appId}-placeholder.apk`;
  };

  const triggerDownloadAction = (appIdToInstall?: string) => {
    if (downloadProgress !== 'idle' && downloadProgress !== 'error') return;
    
    setDownloadProgress('downloading');
    setDownloadPercent(0);
    
    let currentPercent = 0;
    const interval = setInterval(() => {
      // simulated speed increments for smooth feedback
      const increment = Math.floor(Math.random() * 14) + 9;
      currentPercent = Math.min(currentPercent + increment, 100);
      setDownloadPercent(currentPercent);
      
      if (currentPercent >= 100) {
        clearInterval(interval);
        setDownloadProgress('installing');
        
        setTimeout(() => {
          setDownloadProgress('success');
          
          const targetId = appIdToInstall || activeAppId;
          const params = new URLSearchParams(window.location.search);
          const urlApk = params.get('apk');
          const effectiveApk = getEffectiveApkUrl(targetId, urlApk);
          const targetUrl = effectiveApk || '/app-release.apk';
          
          try {
            window.open(targetUrl, '_blank');
            showToast('Started APK staging installer download successfully!', 'success');
          } catch (err) {
            console.error('window.open blocked, fallback trigger running', err);
            try {
              const anchor = document.createElement('a');
              anchor.href = targetUrl;
              anchor.target = '_blank';
              document.body.appendChild(anchor);
              anchor.click();
              document.body.removeChild(anchor);
              showToast('Download started via manual element fallback anchor.', 'success');
            } catch (fallbackErr) {
              showToast('Security block model active. Re-enable direct permissions.', 'error');
              setDownloadProgress('error');
              return;
            }
          }
          
          // Cool down state back to idle
          setTimeout(() => {
            setDownloadProgress('idle');
            setDownloadPercent(0);
          }, 3500);

        }, 1200);
      }
    }, 120);
  };

  // Generate QR Address preserving active state and URL query options
  const getQrAddress = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('app', activeAppId);
    return currentUrl.toString();
  };
  const qrAddress = getQrAddress();

  return (
    <div id="downloads-card" className="mx-auto max-w-4xl md:max-w-full w-full px-0 sm:px-6 md:px-12 pt-0 pb-1 mt-0">
      
      {/* Dynamic Toast Alert Notifications */}
      {toast && (
        <div className="fixed top-20 right-4 sm:right-6 md:right-8 z-50 animate-fade-in pointer-events-none max-w-sm w-full">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border pointer-events-auto bg-white ${
            toast.type === 'success' 
              ? 'border-emerald-100 text-slate-800' 
              : toast.type === 'error'
              ? 'border-rose-100 text-slate-850'
              : 'border-slate-100 text-slate-800'
          }`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'success' 
                ? 'bg-emerald-50 text-emerald-600' 
                : toast.type === 'error'
                ? 'bg-rose-50 text-rose-600' 
                : 'bg-blue-50 text-blue-600'
            }`}>
              {toast.type === 'success' ? (
                <Check className="h-4.5 w-4.5 stroke-[3]" />
              ) : toast.type === 'error' ? (
                <span className="font-extrabold text-sm font-mono">!</span>
              ) : (
                <Info className="h-4.5 w-4.5" />
              )}
            </div>
            <p className="text-xs font-bold leading-normal font-sans">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      {!isCardOpen ? (
        /* Google Play styled App Index/Catalog List - matches the user's mockup precisely */
        <div 
          className="w-full sm:max-w-lg md:max-w-none md:w-full mx-auto bg-white text-slate-800 rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/80 p-6 sm:p-8 md:p-12 shadow-none sm:shadow-[0_16px_48px_rgba(0,0,0,0.04)] select-none animate-fade-in"
          style={{ paddingLeft: '24px', paddingTop: '24px', marginLeft: '0px', marginTop: '-15px' }}
        >
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-sans text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Recommended for you
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 divide-y divide-slate-100/70 md:divide-y-0">
            {ALL_APPS.map((app) => (
              <div 
                key={app.id}
                onClick={() => selectAppAndChangeUrl(app.id)}
                className="flex items-center gap-4 py-3.5 cursor-pointer group hover:bg-slate-50/60 md:hover:bg-slate-50 border border-transparent md:hover:border-slate-100/85 md:hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-all duration-300 px-3 md:px-4 rounded-2xl"
              >
                {/* Scaled App Frame container */}
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[14px] overflow-hidden border border-slate-200/50 bg-slate-100 select-none shrink-0 shadow-xs group-hover:scale-[1.03] transition-all duration-300 flex">
                  <ImageWithFallback 
                    src={app.logoUrl} 
                    alt={`${app.name} APK`} 
                    fallbackText={app.name}
                    className="w-full h-full object-cover aspect-square" 
                  />
                </div>

                {/* Info summary layout */}
                <div className="flex-grow min-w-0 text-left">
                  <h3 className="font-sans font-bold text-sm sm:text-[15px] text-slate-900 leading-snug group-hover:text-[#01875f] transition-colors duration-200 truncate">
                    {app.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {app.publisher}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Google Play Styled Unified Single Card Container - Pristine White Theme */
        <div 
          key={activeAppId} // Triggers a smooth layout refresh transition when active app switches
          className="w-full bg-white text-slate-800 rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/80 p-6 sm:p-8 md:p-12 shadow-none sm:shadow-[0_16px_48px_rgba(0,0,0,0.04)] select-none animate-fade-in"
          style={{ paddingLeft: '24px', paddingTop: '24px', marginLeft: '0px', marginTop: '-15px' }}
        >
          {/* Back button layer */}
          <div className="mb-6 flex justify-between items-center text-left">
            <button 
              onClick={closeCardAndGoBack}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#01875f] hover:text-[#01704f] transition-colors cursor-pointer select-none"
            >
              <ChevronLeft className="h-4 w-4 stroke-[3]" />
              <span>Back to All Apps</span>
            </button>
          </div>
          
          {isAppLoading ? (
            /* Play Store Style Beautiful Skeleton Loading Shimmer + Center Spinner */
            <div className="animate-pulse space-y-8 select-none text-left">
              {/* Header Skeleton */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-3.5 sm:gap-5 w-full md:w-auto">
                  {/* Icon Skeleton */}
                  <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-[16px] sm:rounded-[22px] bg-slate-100 border border-slate-200/50 flex-shrink-0 flex items-center justify-center relative">
                    <div className="h-8 w-8 rounded-full border-[3px] border-[#01875f] border-t-transparent animate-spin" />
                  </div>
                  {/* Text Line Skeletons */}
                  <div className="flex-grow space-y-3">
                    <div className="h-6 sm:h-8 bg-slate-100 rounded-lg w-48 sm:w-56" />
                    <div className="h-6 bg-slate-100 rounded-md w-36" />
                  </div>
                </div>
                {/* Button Skeleton */}
                <div className="h-12 w-full md:w-32 bg-slate-100 rounded-xl" />
              </div>

              {/* Screenshots Carousel Skeleton */}
              <div className="py-2 flex gap-5 overflow-x-hidden">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-[210px] sm:w-[245px] shrink-0 bg-slate-50 border border-slate-200/40 rounded-2xl p-3 space-y-2">
                    <div className="aspect-[9/16] w-full rounded-xl bg-slate-200/30" />
                  </div>
                ))}
              </div>

              {/* About Skeleton */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="h-5 bg-slate-100 rounded w-28" />
                <div className="h-4 bg-slate-100/80 rounded w-full" />
                <div className="h-4 bg-slate-100/80 rounded w-5/6" />
              </div>
            </div>
          ) : (
            <>
              {/* SECTION 1: HEADER BLOCK (App Icon, Titles, Install Panel) */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                
                {/* Brand block (left) */}
                <div className="flex items-center gap-3.5 sm:gap-5 w-full md:w-auto">
                  {/* Play-Store squircle app logo icon of the active "present" app */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-[16px] sm:rounded-[22px] shadow-[0_12px_32px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 border border-slate-200/60 overflow-hidden bg-slate-100">
                    <ImageWithFallback 
                      src={activeApp.logoUrl} 
                      alt={`${activeApp.name} APK`} 
                      fallbackText={activeApp.name}
                      className="w-full h-full object-cover aspect-square font-extrabold" 
                    />
                  </div>
                  <div className="flex-grow min-w-0 text-left">
                    <h1 className="font-sans text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                      {activeApp.name}
                    </h1>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500 text-xs sm:text-sm font-semibold font-sans">
                      <a 
                        href={activeApp.publisherUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#01875f] hover:underline cursor-pointer"
                      >
                        {activeApp.publisher}
                      </a>
                    </div>
                  </div>
                </div>
       
                {/* Action and Download Control Block (right) */}
                <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3.5 shrink-0">
                  <div className="flex items-center gap-2.5 w-full md:w-max">
                    
                    {/* Primary Install Button using the iconic Google Play Store Green color (#01875f) with percentage animation */}
                    <button
                      onClick={() => triggerDownloadAction()}
                      disabled={downloadProgress !== 'idle' && downloadProgress !== 'error'}
                      className={`relative overflow-hidden flex-grow md:flex-grow-0 inline-flex items-center justify-center gap-2.5 rounded-[12px] px-8 py-3.5 text-sm font-bold shadow-xs transition-all duration-300 hover:brightness-105 active:scale-[0.98] select-none cursor-pointer disabled:cursor-not-allowed ${
                        downloadProgress === 'success' 
                          ? 'bg-emerald-600 text-white shadow-emerald-600/10' 
                          : downloadProgress === 'downloading'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : downloadProgress === 'installing'
                          ? 'bg-blue-600 text-white shadow-blue-600/10'
                          : downloadProgress === 'error'
                          ? 'bg-rose-600 text-white shadow-rose-600/10'
                          : 'bg-[#01875f] text-white hover:bg-[#01704f] shadow-lg shadow-emerald-800/10'
                      }`}
                    >
                      {downloadProgress === 'downloading' && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-[#01875f]/15 transition-all duration-300 ease-out" 
                          style={{ width: `${downloadPercent}%` }}
                        />
                      )}

                      {downloadProgress === 'downloading' ? (
                        <span className="z-10 flex items-center gap-1.5 text-slate-850">
                          <span className="h-2 w-2 rounded-full bg-[#01875f] animate-ping" />
                          <span>Downloading {downloadPercent}%</span>
                        </span>
                      ) : downloadProgress === 'installing' ? (
                        <span className="z-10 flex items-center gap-1.5 text-white animate-pulse">
                          <span>Installing Package...</span>
                        </span>
                      ) : downloadProgress === 'success' ? (
                        <>
                          <Check className="h-4.5 w-4.5 text-white stroke-[3] animate-bounce" />
                          <span>Triggering Launcher</span>
                        </>
                      ) : downloadProgress === 'error' ? (
                        <span>Failed. Retry?</span>
                      ) : (
                        <span>Install</span>
                      )}
                    </button>
       
                    {/* QR Sidebar Code Trigger Button */}
                    <button
                      onClick={() => setQrModal(true)}
                      title="Synchronize via QR link"
                      className="px-4 py-3.5 rounded-[12px] bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Play store specs indicator block below the install button */}
                  <div className="mt-1.5 flex items-center justify-between md:justify-end gap-4 sm:gap-6 border-t border-b border-slate-100 py-3 w-full max-w-md md:max-w-none">
                    <div className="text-center group pr-4 sm:pr-6 border-r border-slate-150">
                      <div className="text-sm sm:text-base font-black text-slate-900 font-mono tracking-tight">{activeApp.size}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Required Space</div>
                    </div>
                    <div className="text-center group pr-4 sm:pr-6 border-r border-slate-150 md:pl-2">
                      <div className="text-sm sm:text-base font-black text-slate-900 font-mono tracking-tight">{activeApp.downloads}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Downloads</div>
                    </div>
                    <div className="text-center group md:pl-2">
                      <div className="text-sm sm:text-base font-black text-emerald-600 font-mono tracking-tight flex items-center justify-center gap-1">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Verified</span>
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">Play Protect</div>
                    </div>
                  </div>
                </div>
       
              </div>
       
              {/* SECTION 3: HORIZONTAL SCREEN SHOT PLAYGROUND CAROUSEL */}
              <div className="py-8 relative text-left">
                
                {/* Carousel View Container with beautiful aspect ratio */}
                <div 
                  className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
                  style={{ scrollbarWidth: 'none' }}
                >
                  
                  {activeApp.slides.map((slide, index) => (
                    <div 
                      key={slide.id} 
                      onClick={() => setPopupIndex(index)}
                      className="w-[210px] sm:w-[245px] shrink-0 snap-start bg-slate-50 rounded-2xl border border-slate-200/75 p-3 flex flex-col cursor-pointer hover:border-[#01875f] shadow-xs"
                      title="Click to zoom screenshot"
                    >
                      <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-900 shadow-xs border border-slate-200/50 flex">
                        <ScreenshotWithFallback 
                          src={slide.img} 
                          alt="Smartphone App Preview screenshot"
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                      </div>
                    </div>
                  ))}
       
                </div>
       
              </div>
       
              {/* SECTION 4: ABOUT THIS APP (Expandable Play store guidelines & Pil badges) */}
              <div className="pt-6 border-t border-slate-100 text-left select-none">
                
                <div className="flex items-center justify-between mb-4">
                  <h2 
                    onClick={() => setAboutModal(true)}
                    className="font-sans text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 cursor-pointer hover:text-[#01875f] transition-colors"
                  >
                    About this app
                    <Info className="h-4 w-4 text-slate-400 group-hover:text-[#01875f]" />
                  </h2>
                  
                  {/* Play store style circular interactive arrow link button */}
                  <button 
                    onClick={() => setAboutModal(true)}
                    className="h-8 w-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-950 transition flex items-center justify-center cursor-pointer"
                    title="View beautiful details about this app"
                  >
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </div>
       
                <p 
                  onClick={() => setAboutModal(true)}
                  className="text-sm text-slate-600 leading-relaxed max-w-2xl mb-6 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  {activeApp.description}
                </p>
       
              </div>
       
              {/* SECTION 5: RECOMMENDED FAST DELIVERY APPS (Replica layout of user reference) */}
              <div className="pt-8 mt-6 border-t border-slate-100 text-left select-none">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-sans text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                      Fast Delivery & Top Apps
                      <Sparkles className="h-4 w-4 text-[#01875f]" />
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Tap any app card below to swap the staging deck and launch instant installer.</p>
                  </div>
                </div>
       
                {/* Elegant active list representation */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-5 h-full">
                  {ALL_APPS.filter((app) => app.id !== activeAppId).map((app) => {
                    return (
                      <div 
                        key={app.id}
                        onClick={() => selectAppAndChangeUrl(app.id)}
                        className="group cursor-pointer flex flex-col items-start transition-all duration-300 p-2 rounded-2xl border border-transparent hover:bg-slate-50"
                        title={`Select ${app.name} App`}
                      >
                        {/* Aspect ratio squircle app logo container */}
                        <div className="w-full aspect-square rounded-[26px] sm:rounded-[32px] bg-slate-100 flex items-center justify-center shadow-xs border border-slate-200/50 overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-sm relative">
                          <ImageWithFallback 
                            src={app.logoUrl} 
                            alt={`${app.name} Icon`} 
                            fallbackText={app.name}
                            className="w-full h-full object-cover aspect-square" 
                          />
                        </div>
                        
                        {/* Labels styling matching user's reference image */}
                        <p className="text-[11px] sm:text-xs text-slate-700 font-extrabold tracking-tight mt-2.5 leading-snug group-hover:text-slate-950 text-left w-full truncate">
                          {app.name}
                        </p>
                        <p className="text-[9px] text-[#01875f]/90 font-bold uppercase tracking-wider mt-0.5">
                          • Select App
                        </p>
                      </div>
                    );
                  })}
                </div>
       
              </div>
            </>
          )}
   
        </div>
      )}
 
      {/* QR MODAL DIALOG PREVIEW OVERLAY DRAWER */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up text-left">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-sans text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#01875f]" /> Install via Phone QR
              </h4>
              <button
                onClick={() => setQrModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold px-2.5 py-1 rounded bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Scan this QR code with your phone camera to download the APK installer package directly onto your phone dashboard storage file folder.
            </p>
 
            <div className="flex justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-6 font-semibold select-none">
              {activeApp.qrCodeUrl ? (
                <img 
                  src={activeApp.qrCodeUrl} 
                  alt="QR Code" 
                  className="h-44 w-44 object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <svg className="h-44 w-44" viewBox="0 0 100 100" shapeRendering="crispEdges">
                  <rect width="100%" height="100%" fill="#f9fafb" />
                  <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" fill="#0f172a" />
                  <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" fill="#0f172a" />
                  <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M80,80 h10 v10 h-10 z" fill="#0f172a" />
                  <path d="M40,10 h5 v5 h-5 z M50,5 h5 v10 h-5 z M60,15 h10 v5 h-10 z M35,25 h15 v5 h-15 z M55,25 h5 v5 h-5 z" fill="#0f172a" />
                  <path d="M40,40 h10 v10 h-10 z M60,40 h15 v5 h-15 z M45,55 h5 v15 h-5 z M55,50 h15 v5 h-15 z M35,60 h5 v5 h-5 z" fill="#0f172a" />
                  <path d="M5,40 h10 v5 h-10 z M20,45 h10 v15 h-10 z M0,60 h5 v5 h-5 z M75,60 h10 v10 h-10 z M90,55 h10 v5 h-10 z" fill="#0f172a" />
                  <path d="M40,80 h5 v15 h-5 z M50,90 h15 v5 h-15 z M70,85 h5 v5 h-5 z M75,90 h10 v5 h-10 z M90,85 h10 v10 h-10 z" fill="#0f172a" />
                </svg>
              )}
            </div>
 
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-[10px] font-mono text-slate-500 overflow-hidden text-center truncate">
              {qrAddress}
            </div>
          </div>
        </div>
      )}
 
      {/* ABOUT THIS APP MODAL DETAIL OVERLAY */}
      {aboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl animate-scale-up text-left scrollbar-thin">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex">
                  <ImageWithFallback 
                    src={activeApp.logoUrl} 
                    alt={`${activeApp.name} Logo`} 
                    fallbackText={activeApp.name}
                    className="w-full h-full object-cover aspect-square font-extrabold"
                  />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-black text-slate-900 tracking-tight">
                    {activeApp.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{activeApp.publisher}</p>
                </div>
              </div>
              <button
                onClick={() => setAboutModal(false)}
                className="text-slate-500 hover:text-slate-900 font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Description Details Section */}
            <div className="space-y-6">
              <div>
                <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Full Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {activeApp.description} Compiled and verified under modern Google Play Protect security standards, this package provides dynamic offline support, lightweight resource footprints, and local system responsiveness.
                </p>
              </div>

              {/* What's new */}
              <div>
                <h4 className="font-sans text-xs font-bold text-[#01875f] uppercase tracking-widest mb-2">
                  What's New in v{CURRENT_BUILD.version}
                </h4>
                <div className="bg-emerald-50/40 border border-emerald-500/10 rounded-2xl p-4 text-xs text-slate-700 space-y-2 font-sans font-semibold">
                  <div className="flex items-start gap-2">
                    <span className="text-[#01875f] font-bold">•</span>
                    <span>Enhanced local caching mechanics to allow instant menu rendering.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#01875f] font-bold">•</span>
                    <span>Fully compatible package integrity with Android Oreo (API 26) through Android 14.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#01875f] font-bold">•</span>
                    <span>Optimized layout rendering, squircle bounds, and high-DPI image assets.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#01875f] font-bold">•</span>
                    <span>Play Protect compliance verified with cryptographically secure staging anchors.</span>
                  </div>
                </div>
              </div>

              {/* App Info Metadata Table */}
              <div>
                <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  App Information
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-medium">Version</p>
                    <p className="text-slate-800 font-bold font-mono">{CURRENT_BUILD.version}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-medium">Updated on</p>
                    <p className="text-slate-800 font-bold">{CURRENT_BUILD.releaseDate}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-medium">Downloads</p>
                    <p className="text-slate-800 font-bold">{activeApp.downloads}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-400 font-medium">Download Size</p>
                    <p className="text-slate-800 font-bold font-mono">{activeApp.size || CURRENT_BUILD.fileSize}</p>
                  </div>
                  <div className="space-y-0.5 col-span-2 pt-2 border-t border-slate-100">
                    <p className="text-slate-400 font-medium">Minimum Operating System</p>
                    <p className="text-slate-800 font-bold text-[11px]">{CURRENT_BUILD.minAndroidVersion}</p>
                  </div>
                  <div className="space-y-0.5 col-span-2">
                    <p className="text-slate-400 font-medium">Developer Offered By</p>
                    <p className="text-[#01875f] font-bold">{activeApp.publisher}</p>
                  </div>
                </div>
              </div>

              {/* Data Safety Info */}
              <div className="pt-2">
                <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Data Safety
                </h4>
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-blue-500/10 bg-blue-50/20 text-xs text-slate-700">
                  <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-sans font-bold text-slate-900">No Data Shared or Collected</p>
                    <p className="text-slate-500 leading-relaxed font-sans">
                      The publisher declares that this app does not collect, harvest, or share any personal data with third-party servers. All transactions or activities operate fully local on your secure device.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
 
      {/* SCREENSHOT POPUP MODAL DIALOG */}
      {popupIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fade-in cursor-pointer select-none"
          onClick={() => setPopupIndex(null)}
        >
          <div 
            className="relative max-w-xs sm:max-w-sm w-full aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl animate-scale-up border border-slate-800 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <ScreenshotWithFallback 
              src={activeApp.slides[popupIndex].img} 
              alt="Fullscreen App Preview screenshot popup" 
              className="w-full h-full object-cover select-none"
            />
            
            {/* Left navigation arrow button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPopupIndex((prev) => (prev !== null ? (prev - 1 + activeApp.slides.length) % activeApp.slides.length : null));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white hover:bg-[#01875f] hover:text-white transition-all duration-200 flex items-center justify-center shadow-lg border border-white/10 cursor-pointer"
              title="Previous Screenshot"
            >
              <ChevronLeft className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
 
            {/* Right navigation arrow button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPopupIndex((prev) => (prev !== null ? (prev + 1) % activeApp.slides.length : null));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/60 text-white hover:bg-[#01875f] hover:text-white transition-all duration-200 flex items-center justify-center shadow-lg border border-white/10 cursor-pointer"
              title="Next Screenshot"
            >
              <ChevronRight className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
 
            {/* Top Close button overlay */}
            <button
              onClick={() => setPopupIndex(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-all duration-200 flex items-center justify-center shadow-lg border border-white/10 cursor-pointer text-[11px] font-black"
              title="Close image popup"
            >
              ✕
            </button>
 
            {/* Index position Indicator badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-bold font-mono tracking-wider text-slate-200 border border-white/10 shadow-md">
              {popupIndex + 1} / {activeApp.slides.length}
            </div>
          </div>
        </div>
      )}
 
    </div>
  );
}
