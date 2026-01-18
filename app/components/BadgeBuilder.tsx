'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, Palette, Type, Info } from 'lucide-react';
import Link from 'next/link';
import Footer from './Footer';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilities
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type SimpleIcon = {
    title: string;
    slug: string;
    hex: string;
    path: string;
};

interface BadgeBuilderProps {
    allIcons: SimpleIcon[];
}

export default function BadgeBuilder({ allIcons }: BadgeBuilderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [copied, setCopied] = useState(false);

    // Badge State
    const [mode, setMode] = useState<'custom' | 'github'>('custom');
    const [selectedIcon, setSelectedIcon] = useState<SimpleIcon | null>(null);

    // Custom Mode State
    const [label, setLabel] = useState('Label');
    const [message, setMessage] = useState('Message');

    // GitHub Mode State
    const [ghUser, setGhUser] = useState('anthonybenier');
    const [ghRepo, setGhRepo] = useState('readme-icons');
    const [ghType, setGhType] = useState('stars');

    // Shared State
    const [color, setColor] = useState('blue');
    const [logoColor, setLogoColor] = useState('white');
    const [style, setStyle] = useState<'flat' | 'flat-square' | 'for-the-badge' | 'plastic' | 'social'>('for-the-badge');
    const [customLink, setCustomLink] = useState('');
    const [failedUrl, setFailedUrl] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsClient(true);
    }, []);

    // Filter icons based on search query
    const filteredIcons = useMemo(() => {
        if (!searchQuery) return [];
        const lowerQuery = searchQuery.toLowerCase();
        return allIcons
            .filter((icon) => icon.title.toLowerCase().includes(lowerQuery) || icon.slug.includes(lowerQuery))
            .slice(0, 50);
    }, [searchQuery, allIcons]);

    const selectIcon = (icon: SimpleIcon) => {
        setSelectedIcon(icon);
        setLabel(icon.title);
        setColor(icon.hex);
        setSearchQuery('');
    };

    // Generate Shields.io URL
    const generateUrl = () => {
        // Shared Parameters
        const params = new URLSearchParams();
        params.set('style', style);

        // Enhance: Shields.io uses special escaping for dashes and underscores
        const escape = (str: string) => str.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_');
        const cleanColor = (hex: string) => hex.replace(/^#/, '');

        const safeColor = cleanColor(color);
        const safeLogoColor = cleanColor(logoColor);

        if (selectedIcon) {
            params.set('logo', selectedIcon.slug);
        }

        if (safeLogoColor && safeLogoColor !== 'white') {
            params.set('logoColor', safeLogoColor);
        } else if (safeLogoColor === 'white') {
            params.set('logoColor', 'white');
        }

        // Logic split based on mode
        let baseUrl = 'https://img.shields.io';

        if (mode === 'github') {
            // GitHub Mode: https://img.shields.io/github/stars/user/repo
            // Supported types: stars, forks, watchers, issues, issues-pr, last-commit, license, etc.
            baseUrl += `/github/${ghType}/${ghUser}/${ghRepo}`;

            // GitHub badges automatically handle label/message usually, but we can override label or color
            if (safeColor && safeColor !== 'blue') {
                // Color is complex for GitHub badges as they often have default colors (like green for passing)
                // But for social/stats, we can often override.
                // Actually, standard shields can override color with ?color=.... let's try standard param.
                params.set('color', safeColor);
            }
            // Fix: Do not override label in GitHub mode by default. relying on Shields.io default (e.g. "stars", "forks")
            // If we wanted to support override, we'd need a separate/optional input.
        } else {
            // Custom Mode: https://img.shields.io/badge/Label-Message-Color
            const safeLabel = escape(label || '');
            const safeMessage = escape(message || '');

            const encodedLabel = encodeURIComponent(safeLabel);
            const encodedMessage = encodeURIComponent(safeMessage);

            const path = encodedLabel ? `${encodedLabel}-${encodedMessage}` : encodedMessage;
            const colorPart = safeColor ? `-${safeColor}` : '';

            baseUrl += `/badge/${path}${colorPart}`;
        }

        return `${baseUrl}?${params.toString()}`;
    };

    const previewUrl = generateUrl();
    const isImgError = failedUrl === previewUrl;

    const altText = mode === 'github' ? `${ghType} - ${ghUser}/${ghRepo}` : `${label} ${message}`;
    const imageMarkdown = `![${altText}](${previewUrl})`;
    const markdownCode = customLink ? `[${imageMarkdown}](${customLink})` : imageMarkdown;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isClient) return <div className="h-screen bg-black"></div>;

    return (
        <div className="min-h-screen lg:h-screen flex flex-col lg:overflow-hidden text-zinc-200">
            {/* Main Content */}
            <div className="flex-1 lg:overflow-hidden relative">
                <div className="lg:h-full grid grid-cols-1 lg:grid-cols-12 w-full">

                    {/* Left Column: Search & Content (7 cols) */}
                    <div className="lg:col-span-7 lg:h-full flex flex-col relative min-h-0">
                        {/* Vertical Separator */}
                        <div className="hidden lg:block absolute right-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />

                        {/* Header */}
                        <div className="flex flex-col gap-6 mb-6 flex-none px-6 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 relative flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-white">Readme Icons</h1>
                                    <p className="text-zinc-400 text-base">Make your GitHub README stand out.</p>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex gap-4 border-b border-white/5">
                                <Link href="/" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                                    Skill Icons
                                </Link>
                                <Link href="/badges" className="px-4 py-2 text-sm font-medium text-white border-b-2 border-blue-500">
                                    Badge Builder
                                </Link>
                            </div>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="lg:flex-1 lg:overflow-y-auto min-h-0 space-y-8 px-6 md:px-8 lg:px-12 pb-10 lg:pb-20 custom-scrollbar">

                            {/* 1. Select Tech */}
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search an icon (e.g. Next.js, Docker, Python)..."
                                        className="w-full pl-12 pr-4 py-4 md:py-5 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl focus:bg-zinc-900 focus:border-zinc-700 outline-none transition-all duration-300 text-lg placeholder:text-zinc-600 focus:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />

                                    {/* Search Results Dropdown */}
                                    <AnimatePresence>
                                        {searchQuery && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute w-full mt-4 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto z-50 p-2"
                                            >
                                                {filteredIcons.map((icon) => (
                                                    <button
                                                        key={icon.slug}
                                                        onClick={() => selectIcon(icon)}
                                                        className="flex items-center gap-3 w-full p-3 hover:bg-zinc-800/80 rounded-xl transition-all text-left group"
                                                    >
                                                        <div className="w-8 h-8 p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 group-hover:border-zinc-600">
                                                            <svg viewBox="0 0 24 24" fill={`#${icon.hex}`}><path d={icon.path} /></svg>
                                                        </div>
                                                        <span className="text-zinc-300 group-hover:text-white font-medium">{icon.title}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Selected Icon Display */}
                                <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 p-4 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {selectedIcon ? (
                                            <>
                                                <div className="w-10 h-10 p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                                                    <svg viewBox="0 0 24 24" fill={`#${selectedIcon.hex}`} className="w-full h-full"><path d={selectedIcon.path} /></svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-zinc-200">{selectedIcon.title}</div>
                                                    <div className="text-xs text-zinc-500 font-mono">#{selectedIcon.hex}</div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-zinc-500 text-sm italic">No logo selected</div>
                                        )}
                                    </div>
                                    {selectedIcon && (
                                        <button
                                            onClick={() => setSelectedIcon(null)}
                                            className="text-xs bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-red-500/30 transition-all font-medium"
                                        >
                                            Remove Logo
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* 2. Content Configuration */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-zinc-300 flex items-center gap-2">
                                        <Type className="w-5 h-5 text-zinc-500" /> Content
                                    </h3>

                                    {/* Mode Toggle */}
                                    <div className="flex bg-black/20 p-1 rounded-lg">
                                        <button
                                            onClick={() => setMode('custom')}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                                mode === 'custom' ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-zinc-300"
                                            )}
                                        >
                                            Custom
                                        </button>
                                        <button
                                            onClick={() => setMode('github')}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                                mode === 'github' ? "bg-zinc-800 text-white shadow" : "text-zinc-500 hover:text-zinc-300"
                                            )}
                                        >
                                            GitHub
                                        </button>
                                    </div>
                                </div>

                                {mode === 'custom' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Label (Left)</label>
                                            <input
                                                type="text"
                                                value={label}
                                                onChange={(e) => setLabel(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 transition-colors text-zinc-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Message (Right)</label>
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 transition-colors text-zinc-300"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">GitHub User</label>
                                            <input
                                                type="text"
                                                value={ghUser}
                                                onChange={(e) => setGhUser(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 transition-colors text-zinc-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Repository</label>
                                            <input
                                                type="text"
                                                value={ghRepo}
                                                onChange={(e) => setGhRepo(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 transition-colors text-zinc-300"
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Badge Type</label>
                                            <select
                                                value={ghType}
                                                onChange={(e) => setGhType(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 text-zinc-300 appearance-none"
                                            >
                                                <option value="stars">Stars</option>
                                                <option value="forks">Forks</option>
                                                <option value="watchers">Watchers</option>
                                                <option value="issues">Issues</option>
                                                <option value="issues-pr">Pull Requests</option>
                                                <option value="last-commit">Last Commit</option>
                                                <option value="license">License</option>
                                                <option value="v/release">Latest Release</option>
                                                <option value="v/tag">Latest Tag</option>
                                                <option value="contributors">Contributors</option>
                                                <option value="commit-activity/m">Commit Activity (Monthly)</option>
                                                <option value="commit-activity/y">Commit Activity (Yearly)</option>
                                                <option value="discussions">Discussions</option>
                                                <option value="followers">Followers</option>
                                                <option value="size">Repo Size</option>
                                                <option value="languages/top">Top Language</option>
                                            </select>
                                        </div>
                                    </div>
                                )}


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Color</label>
                                        <div className="flex gap-3">
                                            <div className="relative w-12 h-12 rounded-xl border border-white/10 shrink-0 shadow-lg overflow-hidden group">
                                                <div className="absolute inset-0 transition-colors" style={{ backgroundColor: /^[0-9a-fA-F]{3,8}$/.test(color.trim()) && !color.startsWith('#') ? `#${color}` : color }} />
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => setColor(e.target.value.toUpperCase())}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 transition-colors font-mono text-sm uppercase text-zinc-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Logo Color</label>
                                        <select
                                            value={logoColor}
                                            onChange={(e) => setLogoColor(e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 appearance-none text-zinc-300"
                                        >
                                            <option value="white">White</option>
                                            <option value="black">Black</option>
                                            {selectedIcon && <option value={selectedIcon.hex}>Brand ({selectedIcon.hex})</option>}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-white/5">
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-2">
                                        Target URL <span className="text-zinc-600 lowercase font-normal">(optional)</span>
                                        <div className="group relative">
                                            <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-xs text-zinc-300 w-48 text-center shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 normal-case tracking-normal">
                                                Makes the badge clickable, redirecting users to this URL.
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-900" />
                                            </div>
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://your-project.com"
                                        value={customLink}
                                        onChange={(e) => setCustomLink(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:border-white/20 transition-colors text-zinc-300 placeholder:text-zinc-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Preview (5 cols) */}
                    <div className="lg:col-span-5 lg:h-full lg:overflow-y-auto min-h-0 p-4 md:p-6 lg:p-8 relative">
                        <div className="max-w-xl mx-auto space-y-4">

                            {/* Settings Panel */}
                            <div className="glass rounded-3xl p-5 space-y-4">
                                <div className="flex items-center gap-2 text-zinc-300 font-semibold border-b border-white/5 pb-3">
                                    <Palette className="w-5 h-5" />
                                    <h3>Style Configuration</h3>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Badge Style</label>
                                    <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
                                        {(['flat', 'flat-square', 'for-the-badge', 'plastic', 'social'] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStyle(s)}
                                                className={cn(
                                                    "px-3 py-2 text-sm rounded-lg transition-all truncate font-medium capitalize",
                                                    style === s
                                                        ? "bg-zinc-800 text-white shadow-lg"
                                                        : "text-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                {s.replace(/-/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Card */}
                            <div className="glass rounded-3xl overflow-hidden relative group p-1">
                                <div className="p-4 border-b border-white/5 flex items-center justify-between relative z-10">
                                    <h3 className="font-semibold text-zinc-300 flex items-center gap-2">Preview</h3>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    </div>
                                </div>

                                <div className="p-8 min-h-[160px] flex items-center justify-center bg-black/40 relative z-10 rounded-xl mx-2 mt-2 border border-white/5">
                                    <motion.img
                                        key={previewUrl}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        src={previewUrl}
                                        alt="Badge Preview"
                                        className={cn("max-w-full h-auto drop-shadow-2xl", isImgError ? "hidden" : "block")}
                                        onError={() => setFailedUrl(previewUrl)}
                                    />
                                    {isImgError && (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-medium text-sm">
                                            Preview unavailable
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 relative z-10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Markdown</h3>
                                        <button
                                            onClick={copyToClipboard}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                copied ? "bg-green-500/20 text-green-400" : "bg-white/5 hover:bg-white/10 text-zinc-300"
                                            )}
                                        >
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <div className="bg-black/50 rounded-xl p-3 border border-white/5 overflow-hidden relative cursor-text group/code" onClick={copyToClipboard}>
                                        <code className="text-xs text-zinc-400 font-mono break-all leading-relaxed group-hover/code:text-zinc-300 transition-colors">
                                            {markdownCode}
                                        </code>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div >
    );
}
