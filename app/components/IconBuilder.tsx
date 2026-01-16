'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Search, Copy, Check, X, GripVertical, Trash2, ArrowUpRight, Settings, Moon, Sun, LayoutGrid } from 'lucide-react';
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

    const queryString = params.toString();
    const previewUrl = iconSlugs ? `/api/icons?${queryString}` : null;
    const absoluteUrl = iconSlugs ? `${baseUrl}/api/icons?${queryString}` : '';

    const markdownCode = `[![My Skills](${absoluteUrl})](${baseUrl})`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isClient) return <div className="min-h-screen"></div>;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 md:space-y-12">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 pt-8 md:pt-16"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 text-glow">
                    Readme Skill Icons
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Curate your tech stack. Generate a dynamic SVG for your GitHub profile.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">

                {/* Left Column: Search & List (7 cols) */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Search Box */}
                    <div className="relative z-50">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search technologies (e.g. React, Next.js, AWS)..."
                                className="w-full pl-12 pr-4 py-4 md:py-5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-lg shadow-2xl"
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
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-800 border border-zinc-700 group-hover:border-zinc-600 transition-colors"
                                                    >
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
                            <Reorder.Group
                                axis="y"
                                values={selectedIcons}
                                onReorder={setSelectedIcons}
                                className="space-y-3"
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
                        )}
                    </div>
                </div>

                {/* Right Column: Preview & Configuration (5 cols) */}
                <div className="lg:col-span-5 relative">
                    <div className="lg:sticky lg:top-8 space-y-6">

                        {/* Configuration Panel */}
                        <div className="glass rounded-3xl p-6 space-y-6">
                            <div className="flex items-center gap-2 text-zinc-300 font-semibold border-b border-white/5 pb-4">
                                <Settings className="w-5 h-5" />
                                <h3>Configuration</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Theme Toggle */}
                                <div className="space-y-3">
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

                                {/* Icons Per Line */}
                                <div className="space-y-3">
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
                                <div className="space-y-3">
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

                        {/* Preview Card */}
                        <div className="glass rounded-3xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-semibold text-zinc-300 flex items-center gap-2">
                                    Preview
                                </h3>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                            </div>

                            <div className="p-8 md:p-12 min-h-[200px] flex items-center justify-center bg-black/40">
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
                        </div>

                        {/* Markdown Code */}
                        {selectedIcons.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass rounded-3xl p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Markdown Snippet</h3>
                                    <button
                                        onClick={copyToClipboard}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                            copied
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-white/5 hover:bg-white/10 text-white"
                                        )}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>

                                <div className="bg-black/50 rounded-xl p-4 border border-white/5 overflow-hidden relative">
                                    <code className="text-sm text-zinc-400 font-mono break-all leading-relaxed">
                                        {markdownCode}
                                    </code>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
