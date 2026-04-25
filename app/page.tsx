'use client';

import React, { useState, useEffect } from 'react';
import CandlestickChart from './components/CandlestickChart';

// Add Telegram window type definition safely
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        close: () => void;
        sendData: (data: string) => void;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

const CheckIcon = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${checked ? 'bg-white' : 'border border-gray-600'
      }`}
  >
    {checked && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path
          d="M1 4L3.5 6.5L9 1"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </div>
);

const signalPlans = [
  {
    id: 'signal_scalper_x',
    name: 'VIP Signal 2.0',
    price: '$50.00',
    period: '/month',
    tagline: 'For high-frequency, low-latency traders',
    features: [
      { label: '1-click MT4/MT5 deployment', checked: true },
      { label: 'Tick-level execution (under 50ms)', checked: true },
      { label: '5 currency pairs (major & minors)', checked: true },
      { label: 'Built-in spread & slippage guard', checked: true },
    ],
  },
  {
    id: 'signal_scalper_pro',
    name: 'Scalper Pro',
    price: '$95.00',
    period: '/month',
    tagline: 'For professional traders & institutions',
    features: [
      { label: '1-click MT4/MT5 deployment', checked: true },
      { label: 'Tick-level execution (under 50ms)', checked: true },
      { label: '5 currency pairs (major & minors)', checked: true },
      { label: 'Built-in spread & slippage guard', checked: true },
    ],
  },
];

const mentorshipPlans = [
  {
    id: 'mentor_basic',
    name: 'AG Trades beginners',
    price: '$200.00',
    period: '/month',
    tagline: 'Learn the core strategies directly from top analysts.',
    features: [
      { label: 'Weekly group Q&A calls', checked: true },
      { label: 'Access to educational vault', checked: true },
      { label: 'Trade breakdown & reviews', checked: true },
      { label: '1-on-1 strategy coaching', checked: false },
    ],
  },
  {
    id: 'mentor_pro',
    name: 'Ag Trades Pro',
    price: '$300.00',
    period: '/month',
    tagline: 'Direct 1-on-1 access and personalized strategy routing.',
    features: [
      { label: 'Weekly group Q&A calls', checked: true },
      { label: 'Access to educational vault', checked: true },
      { label: 'Trade breakdown & reviews', checked: true },
      { label: '1-on-1 strategy coaching', checked: true },
    ],
  },
];

const coursePlans = [
  {
    id: 'course_beginner',
    name: 'Ag Trades Recorded sessions',
    price: '$150.00',
    period: ' one-time',
    tagline: 'A complete A-to-Z for Forex beginners.',
    features: [
      { label: '50+ Video Lessons', checked: true },
      { label: 'Technical Analysis Basics', checked: true },
      { label: 'Risk Management formulas', checked: true },
      { label: 'Advanced SMC Concepts', checked: false },
    ],
  },
  {
    id: 'course_advanced',
    name: 'Masterclass Course',
    price: '$499.00',
    period: ' one-time',
    tagline: 'Deep dive into Institutional Trading & SMC.',
    features: [
      { label: '50+ Video Lessons', checked: true },
      { label: 'Technical Analysis Basics', checked: true },
      { label: 'Risk Management formulas', checked: true },
      { label: 'Advanced SMC Concepts', checked: true },
    ],
  },
];

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 14C4 11.2386 6.23858 9 9 9C10.7483 9 12.2871 9.9 13.0645 11.232C13.886 10.463 15.0006 10 16.2 10V10C18.851 10 21 12.149 21 14.8V14.8C21 17.5614 18.7614 19.8 16 19.8H4" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 14L8 10L12 14L21 5" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'chart',
    label: '',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="2" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" />
        <path d="M8 16V10" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 16V12" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 16V8" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'signal',
    label: '',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 6C17.3137 6 20 8.68629 20 12" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 2L14 3L11.5 5.5L9 3V2" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10.5 9.5C11.8807 9.5 13 10.6193 13 12C13 13.3807 11.8807 14.5 10.5 14.5C9.11929 14.5 8 13.3807 8 12C8 10.6193 9.11929 9.5 10.5 9.5Z" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" />
        <path d="M10.5 14.5V22" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7.5 22H13.5" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: '',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" />
        <path d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" stroke={active ? '#ffffff' : '#888888'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  // State for dynamic Telegram user data
  const [tgUser, setTgUser] = useState<{ id: string | number; firstName: string }>({
    id: 'id_2320hs03h203h', // Fallback ID
    firstName: 'Dottaa',    // Fallback Name
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();

      // Fetch user data from Telegram context
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setTgUser({
          id: user.id.toString(),
          firstName: user.first_name || user.username || 'User',
        });
      }
    }
  }, []);

  const handleGetStarted = (planId: string) => {
    // Determine the base command depending on what category is currently viewed
    let commandType = '/signal';
    if (activeTab === 'chart') commandType = '/mentorship';
    if (activeTab === 'signal') commandType = '/course';

    // The user strictly requested ONLY the base command without the plan name
    const commandPayload = commandType;

    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {

      try {
        // NOTE ON SEND_DATA:
        // `sendData` ONLY works if the user opened the Mini App from a standard floating Keyboard Menu Button.
        // If they opened the Mini App from an INLINE button attached to a message, `sendData` fails silently.

        // sendData ALREADY CLOSES THE APP AUTOMATICALLY. Calling .close() immediately after breaks the event loop 
        // and causes the payload to be lost before it reaches Telegram servers.
        window.Telegram.WebApp.sendData(commandPayload);
      } catch (err) {
        console.error("sendData blocked by Telegram (likely opened via Inline Button).", err);
        // Fallback for Inline Button launches: Deep Link into your Bot
        // Uncomment the line below and replace YOUR_BOT_USERNAME with your actual bot handle:
        // window.Telegram.WebApp.openTelegramLink(`https://t.me/YOUR_BOT_USERNAME?start=${planId}`);
      }

    } else {
      // Fallback for local browser debugging
      console.log(`[TMA hook triggered] Command sent: ${commandPayload}`);
      alert(`Telegram WebApp hook simulated. Payload sent: ${commandPayload}`);
    }
  };

  const renderDashboard = () => {
    // Determine which plans to show based on the active tab
    const isMentorshipView = activeTab === 'chart';
    const isCoursesView = activeTab === 'signal';

    let activePlans = signalPlans;
    let sectionTitle = 'Signal';

    if (isMentorshipView) {
      activePlans = mentorshipPlans;
      sectionTitle = 'Mentorship';
    } else if (isCoursesView) {
      activePlans = coursePlans;
      sectionTitle = 'Courses';
    }

    return (
      <>
        <div
          className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 100% 0%, rgba(20,50,60,0.3) 0%, transparent 50%), radial-gradient(circle at 0% 50%, rgba(10,30,40,0.2) 0%, transparent 50%)',
          }}
        />

        <div className="relative flex items-center justify-between px-8 pt-12 pb-2">
          <div>
            <h1 className="text-white text-2xl font-medium tracking-tight">Welcome {tgUser.firstName} !</h1>
            <p className="text-[#888888] text-[13px] font-normal mt-1">User ID {tgUser.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#242c33]/50 border border-white/5">
                <div className="w-4 h-5 bg-white rounded-t-full relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] bg-[#06b6d4] text-[10px] font-bold rounded-full flex items-center justify-center text-black border-2 border-[#0a0a0c]">
                4
              </div>
            </div>
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-[#242c33]/50 border border-white/5">
              <div className="flex flex-col gap-[3px]">
                <div className="w-4 h-[1.5px] bg-[#888888]" />
                <div className="w-4 h-[1.5px] bg-[#888888]" />
                <div className="w-4 h-[1.5px] bg-[#888888]" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative px-8 mt-8">
          <p className="text-[#888888] text-sm font-normal">Today&apos;s pips</p>
          <div className="flex items-end justify-between mt-0.5">
            <div className="flex items-baseline gap-1">
              <span className="font-light text-white" style={{ fontSize: '64px', letterSpacing: '-2px', lineHeight: 1 }}>
                +45
              </span>
              <span className="text-[#888888] text-base font-normal mb-1.5">pips</span>
            </div>
            <button className="flex items-center gap-1.5 text-[#aaaaaa] text-[13px] pb-3">
              <span>Weekly Performance</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#10b981] font-medium text-sm">68%</span>
            <span className="text-white text-[13px] font-normal tracking-wide">win rate <span className="font-bold">4 weeks</span></span>
          </div>
        </div>

        <div className="mt-8 relative -mx-2 h-[200px]">
          <CandlestickChart />
        </div>

        {/* Dynamic section indicator */}
        <div className="flex items-center justify-center gap-3 mt-6 animate-fade-in-up">
          <div
            className="flex items-center gap-2 px-[18px] py-[6px] rounded-full text-[13px] text-white font-medium shadow-[0_0_15px_rgba(30,100,140,0.4)]"
            style={{
              background: isCoursesView
                ? 'linear-gradient(90deg, #302010 0%, #402b15 100%)' // Orange/Gold for Courses
                : isMentorshipView
                  ? 'linear-gradient(90deg, #3b1830 0%, #401a30 100%)'
                  : 'linear-gradient(90deg, #182830 0%, #1a3040 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isCoursesView ? 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]' :
              isMentorshipView ? 'bg-[#d81b60] shadow-[0_0_8px_#d81b60]' : 'bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]'}`} />
            {sectionTitle}
            <div className={`w-1.5 h-1.5 rounded-full ${isCoursesView ? 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]' :
              isMentorshipView ? 'bg-[#d81b60] shadow-[0_0_8px_#d81b60]' : 'bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]'}`} />
          </div>
        </div>

        {/* Subscription cards — horizontal scrollable */}
        <div
          key={activeTab} // Force re-mount for animation transition
          className="mt-8 flex gap-4 overflow-x-auto animate-fade-in-up"
          style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px', scrollbarWidth: 'none' }}
        >
          {activePlans.map((plan, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={plan.id}
                className="flex-shrink-0"
                style={{
                  width: 'calc(100vw - 48px)',
                  maxWidth: '340px',
                  background: isFeatured ? '#15151a' : '#15151a',
                  borderRadius: '24px',
                  border: isFeatured ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.1)',
                  padding: '28px',
                }}
              >
                <p className={`font-normal text-lg ${isFeatured ? 'text-white' : 'text-white'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-3">
                  <span
                    className={`font-semibold ${isFeatured ? 'text-white' : 'text-white'}`}
                    style={{ fontSize: '42px', letterSpacing: '-1px' }}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-[15px] font-normal ${isFeatured ? 'text-[#888888]' : 'text-[#888888]'}`}>{plan.period}</span>
                </div>
                <p className={`text-[13px] mt-2 mb-8 ${isFeatured ? 'text-[#aaaaaa]' : 'text-[#aaaaaa]'}`}>{plan.tagline}</p>
                <div className="flex flex-col gap-[18px]">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-4">
                      <CheckIcon checked={isFeatured ? f.checked : false} />
                      <span className={`text-[14px] leading-snug ${isFeatured ? (f.checked ? 'text-white' : 'text-[#aaaaaa]') : (f.checked ? 'text-white' : 'text-[#aaaaaa]')}`}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleGetStarted(plan.id)}
                  className="w-full h-[52px] rounded-full font-medium text-white text-[15px] mt-10 active:scale-95 transition-transform"
                  style={{
                    background: isFeatured
                      ? (isCoursesView ? 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)'
                        : isMentorshipView ? 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)'
                          : 'linear-gradient(180deg, #38bdf8 0%, #0369a1 100%)')
                      : '#1a1a1a',
                    boxShadow: isFeatured
                      ? (isCoursesView ? '0 10px 25px -5px rgba(245, 158, 11, 0.4)'
                        : isMentorshipView ? '0 10px 25px -5px rgba(219, 39, 119, 0.4)'
                          : '0 10px 25px -5px rgba(2, 132, 199, 0.4)')
                      : 'none',
                  }}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderProfilePage = () => {
    return (
      <div className="animate-fade-in-up flex flex-col h-full pt-16 px-8">
        <h1 className="text-white text-3xl font-semibold tracking-tight mt-6">My Profile</h1>
        <div className="mt-8 rounded-[24px] p-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #182028 0%, #0a0e14 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-4">
            <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center bg-[#242c33]/50 border border-white/5 shadow-xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#ffffff" strokeWidth="2" />
                <path d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-white text-xl font-medium">{tgUser.firstName}</p>
              <p className="text-[#888888] text-sm mt-0.5">ID: {tgUser.id}</p>
            </div>
          </div>
        </div>
        <h2 className="text-white text-lg font-medium mt-10 mb-4 px-2">Active Subscriptions</h2>
        <div className="flex flex-col gap-4">
          <div className="rounded-[20px] p-5 flex items-center justify-between" style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
              </div>
              <div>
                <p className="text-white font-medium text-base">Scalper X</p>
                <p className="text-[#64748b] text-[13px] mt-0.5">Signal Service</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[#10b981] text-xs font-semibold px-3 py-1.5 rounded-full bg-[#10b981]/10">Active</span>
            </div>
          </div>
          <div className="rounded-[20px] p-5 flex items-center justify-between" style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(216, 27, 96, 0.05)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-[#64748b]/50" />
              </div>
              <div>
                <p className="text-[#888888] font-medium text-base">Mentorship</p>
                <p className="text-[#64748b] text-[13px] mt-0.5">No active plan</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[#64748b] text-xs font-semibold px-3 py-1.5 rounded-full bg-[#2a2a35]/50 border border-white/5">Upgrade</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-col w-full min-h-screen overflow-hidden text-white"
      style={{
        background: '#0a0a0c',
        fontFamily: "var(--font-poppins), sans-serif",
      }}
    >
      <div className="flex-1 overflow-y-auto pb-32" style={{ scrollbarWidth: 'none' }}>
        {activeTab === 'profile' ? renderProfilePage() : renderDashboard()}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 pointer-events-none flex justify-center w-full z-50">
        <div
          className="pointer-events-auto flex items-center justify-between px-2 h-[64px] rounded-[32px]"
          style={{
            background: 'rgba(25, 30, 35, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: '320px',
            width: '100%',
            maxWidth: '380px'
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'overview' && activeTab === 'overview');
            const showOverviewPill = item.id === 'overview' && isActive;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex items-center justify-center p-2"
                style={{
                  width: showOverviewPill ? 'auto' : '52px',
                  height: '52px'
                }}
              >
                {item.id === 'overview' ? (
                  <div
                    className="flex items-center gap-[6px] pl-3 pr-4 h-[44px] rounded-full"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                    }}
                  >
                    {item.icon(isActive)}
                    {isActive && (
                      <span className="text-white text-[13px] font-medium tracking-wide">Overview</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full opacity-80 hover:opacity-100 transition-opacity">
                    {item.icon(activeTab === item.id)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Home Bar Indicator */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/80 rounded-full z-50"></div>
    </div>
  );
}