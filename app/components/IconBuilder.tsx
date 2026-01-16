'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Search, Copy, Check, X, GripVertical, Trash2, ArrowUpRight, Settings, Moon, Sun, LayoutGrid, Github, Linkedin } from 'lucide-react';
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

interface IconBuilderProps {
    allIcons: SimpleIcon[];
}

export default function IconBuilder({ allIcons }: IconBuilderProps) {
    const [selectedIcons, setSelectedIcons] = useState<SimpleIcon[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Customization State
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [iconSize, setIconSize] = useState(48);
    const [iconsPerLine, setIconsPerLine] = useState(15);
    const [alignment, setAlignment] = useState<'center' | 'left' | 'right'>('center');

    useEffect(() => {
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

    const addIcon = (icon: SimpleIcon) => {
        if (!selectedIcons.find((i) => i.slug === icon.slug)) {
            setSelectedIcons([...selectedIcons, icon]);
        }
        setSearchQuery('');
    };

    const removeIcon = (slug: string) => {
        setSelectedIcons(selectedIcons.filter((i) => i.slug !== slug));
    };

    // Generate URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const iconSlugs = selectedIcons.map((i) => i.slug).join(',');

    const params = new URLSearchParams();
    if (iconSlugs) params.set('i', iconSlugs);
    if (theme !== 'dark') params.set('t', theme);
    if (iconSize !== 48) params.set('size', iconSize.toString());
    if (iconsPerLine !== 15) params.set('perline', iconsPerLine.toString());
    if (alignment !== 'center') params.set('align', alignment);

    const queryString = params.toString();
    const previewUrl = iconSlugs ? `/api/icons?${queryString}` : null;
    const absoluteUrl = iconSlugs ? `${baseUrl}/api/icons?${queryString}` : '';

    let markdownCode = `[![My Skills](${absoluteUrl})](${baseUrl})`;
    if (alignment === 'center') {
        markdownCode = `<p align="center">\n  ${markdownCode}\n</p>`;
    } else if (alignment === 'right') {
        markdownCode = `<p align="right">\n  ${markdownCode}\n</p>`;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isClient) return <div className="h-screen bg-black"></div>;

    return (
        <div className="h-screen flex flex-col overflow-hidden text-zinc-200">
            {/* App Header - Fixed */}


            {/* Main Content - Independent Scrolling Columns */}
            <div className="flex-1 overflow-hidden relative">
                <div className="h-full grid grid-cols-1 lg:grid-cols-12 max-w-[1800px] mx-auto w-full">

                    {/* Left Column: Search & List (Scrollable) */}
                    <div className="lg:col-span-7 h-full flex flex-col bg-black/20 backdrop-blur-xl border-r border-white/10 relative">
                        {/* Mobile/Desktop Header optimized for sidebar feeling */}
                        <div className="flex items-center gap-4 mb-6 flex-none px-6 md:px-8 lg:px-12 pt-6 md:pt-8 lg:pt-12">
                            <div className="w-12 h-12 relative flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.webp"
                                    alt="Logo"
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">
                                    Readme Skill Icons
                                </h1>
                                <p className="text-zinc-400 text-base">Make your GitHub README stand out with this easy & quick icon tool.</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-8 px-6 md:px-8 lg:px-12 pb-20 custom-scrollbar">
                            {/* Search Box */}
                            <div className="relative z-50">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search technologies (e.g. React, Next.js, Docker)..."
                                        className="w-full pl-12 pr-4 py-4 md:py-5 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl focus:bg-zinc-900/60 focus:border-white/20 outline-none transition-all duration-300 text-lg placeholder:text-zinc-600 focus:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Dropdown Results */}
                                <AnimatePresence>
                                    {searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute w-full mt-4 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl max-h-[400px] overflow-y-auto overflow-x-hidden thin-scrollbar z-50"
                                        >
                                            {filteredIcons.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
                                                    {filteredIcons.map((icon) => (
                                                        <button
                                                            key={icon.slug}
                                                            onClick={() => addIcon(icon)}
                                                            className="flex items-center gap-3 w-full p-3 hover:bg-zinc-800/80 rounded-xl transition-all group text-left"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 border border-zinc-700 group-hover:border-zinc-600 transition-colors">
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    className="w-4 h-4"
                                                                    fill={`#${icon.hex}`}
                                                                >
                                                                    <path d={icon.path} />
                                                                </svg>
                                                            </div>
                                                            <span className="text-zinc-300 group-hover:text-white truncate font-medium">{icon.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center text-zinc-500">
                                                    No icons found matching &quot;{searchQuery}&quot;
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Selected List with Drag & Drop */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl font-semibold text-zinc-300">Selected Stack</h3>
                                    <span className="text-sm text-zinc-500">{selectedIcons.length} items</span>
                                </div>

                                {selectedIcons.length === 0 ? (
                                    <div className="glass border-dashed border-zinc-800 h-48 rounded-3xl flex flex-col items-center justify-center text-zinc-600 gap-3">
                                        <Search className="w-8 h-8 opacity-20" />
                                        <p>Search and add icons to build your stack</p>
                                    </div>
                                ) : (
                                    <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                        <Reorder.Group
                                            axis="y"
                                            values={selectedIcons}
                                            onReorder={setSelectedIcons}
                                            className="space-y-3 pb-10"
                                        >
                                            <AnimatePresence mode="popLayout">
                                                {selectedIcons.map((icon) => (
                                                    <Reorder.Item
                                                        key={icon.slug}
                                                        value={icon}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        whileDrag={{ scale: 1.02, zIndex: 50 }}
                                                        className="glass glass-hover p-3 md:p-4 rounded-2xl flex items-center justify-between group cursor-grab active:cursor-grabbing relative"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <GripVertical className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                                                            <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    className="w-5 h-5"
                                                                    fill={`#${icon.hex}`}
                                                                >
                                                                    <path d={icon.path} />
                                                                </svg>
                                                            </div>
                                                            <span className="text-zinc-200 font-medium text-lg">{icon.title}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeIcon(icon.slug)}
                                                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </Reorder.Item>
                                                ))}
                                            </AnimatePresence>
                                        </Reorder.Group>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Preview & Configuration (Floating Cards) */}
                    <div className="lg:col-span-5 h-full overflow-y-auto p-4 md:p-6 lg:p-8 relative">
                        {/* Static Spotlights (Monochrome) */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-800/10 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-screen" />

                        <div className="max-w-xl mx-auto space-y-4 pb-20">
                            {/* Configuration Panel */}
                            <div className="glass rounded-3xl p-5 space-y-4">
                                <div className="flex items-center gap-2 text-zinc-300 font-semibold border-b border-white/5 pb-3">
                                    <Settings className="w-5 h-5" />
                                    <h3>Configuration</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Theme Toggle */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Theme</label>
                                        <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={cn(
                                                    "flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                                                    theme === 'dark' ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                <Moon className="w-4 h-4" /> Dark
                                            </button>
                                            <button
                                                onClick={() => setTheme('light')}
                                                className={cn(
                                                    "flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
                                                    theme === 'light' ? "bg-zinc-200 text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                                )}
                                            >
                                                <Sun className="w-4 h-4" /> Light
                                            </button>
                                        </div>
                                    </div>

                                    {/* Alignment */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Alignment</label>
                                        <div className="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl">
                                            {(['left', 'center', 'right'] as const).map((align) => (
                                                <button
                                                    key={align}
                                                    onClick={() => setAlignment(align)}
                                                    className={cn(
                                                        "flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all capitalize",
                                                        alignment === align ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                                    )}
                                                >
                                                    {align}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Icons Per Line */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Icons Per Line</label>
                                            <span className="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded">{iconsPerLine}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={iconsPerLine}
                                            onChange={(e) => setIconsPerLine(parseInt(e.target.value))}
                                            className="w-full accent-blue-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Icon Size */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Icon Size (px)</label>
                                            <span className="text-xs text-zinc-400 bg-white/5 px-2 py-1 rounded">{iconSize}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="32"
                                            max="128"
                                            step="8"
                                            value={iconSize}
                                            onChange={(e) => setIconSize(parseInt(e.target.value))}
                                            className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview & Code Card */}
                            <div className="glass rounded-3xl overflow-hidden relative group p-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                {/* Header */}
                                <div className="p-4 border-b border-white/5 flex items-center justify-between relative z-10">
                                    <h3 className="font-semibold text-zinc-300 flex items-center gap-2">Preview</h3>
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    </div>
                                </div>

                                {/* Preview Area */}
                                <div className={cn(
                                    "p-8 min-h-[160px] flex items-center bg-black/40 relative z-10 rounded-xl mx-2 mt-2 border border-white/5",
                                    alignment === 'left' && "justify-start",
                                    alignment === 'center' && "justify-center",
                                    alignment === 'right' && "justify-end"
                                )}>
                                    {previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={previewUrl}
                                            alt="Stack Preview"
                                            className="max-w-full h-auto drop-shadow-2xl"
                                        />
                                    ) : (
                                        <span className="text-zinc-700 text-sm">Preview will appear here</span>
                                    )}
                                </div>

                                {/* Markdown Code Section */}
                                {selectedIcons.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 relative z-10 space-y-3"
                                    >
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
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Centered Footer */}
            <footer className="flex-none py-6 border-t border-white/5 bg-transparent backdrop-blur-md z-30">
                <div className="flex items-center justify-center gap-6 text-zinc-400">
                    <span className="text-sm">MIT License © Anthony Benier</span>
                    <div className="w-px h-4 bg-zinc-800" />
                    <div className="flex gap-4">
                        <a href="https://github.com/anthonybenier" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com/in/anthonybenier" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
