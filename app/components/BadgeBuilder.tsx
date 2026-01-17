'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Copy, Check, Palette, Type } from 'lucide-react';
import Link from 'next/link';
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

    // Default icon (react)
    const defaultIcon = allIcons.find(icon => icon.slug === 'react');

    // Badge State
    const [selectedIcon, setSelectedIcon] = useState<SimpleIcon | null>(defaultIcon || null);
    const [label, setLabel] = useState(defaultIcon?.title || 'Label');
    const [message, setMessage] = useState('Message');
    const [color, setColor] = useState(defaultIcon?.hex || 'blue');
    const [logoColor, setLogoColor] = useState('white');
    const [style, setStyle] = useState<'flat' | 'flat-square' | 'for-the-badge' | 'plastic' | 'social'>('for-the-badge');

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
        // Format: https://img.shields.io/badge/Label-Message-Color?style=Style&logo=Logo&logoColor=LogoColor

        // Enhance: Shields.io uses special escaping for dashes and underscores
        // Dash (-) -> --
        // Underscore (_) -> __
        // Space ( ) -> _
        const escape = (str: string) => str.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_');

        const safeLabel = escape(label || '');
        const safeMessage = escape(message || '');

        // If no label, the format is just Message-Color
        const path = safeLabel ? `${safeLabel}-${safeMessage}` : safeMessage;
        const colorPart = color ? `-${color}` : '';

        const url = new URL(`https://img.shields.io/badge/${path}${colorPart}`);
        url.searchParams.set('style', style);
        if (selectedIcon) {
            url.searchParams.set('logo', selectedIcon.slug);
        }
        if (logoColor) {
            url.searchParams.set('logoColor', logoColor);
        }

        return url.toString();
    };

    const previewUrl = generateUrl();
    const markdownCode = `![${label} ${message}](${previewUrl})`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isClient) return <div className="h-screen bg-black"></div>;

    return (
        <div className="h-screen flex flex-col overflow-hidden text-zinc-200">
            {/* Main Content */}
            <div className="flex-1 overflow-hidden relative">
                <div className="h-full grid grid-cols-1 lg:grid-cols-12 w-full">

                    {/* Left Column: Configuration */}
                    <div className="lg:col-span-5 h-full overflow-y-auto p-4 md:p-6 lg:p-8 relative border-r border-white/5 bg-zinc-950/50">
                        <div className="max-w-xl mx-auto space-y-8 pb-20">

                            {/* Header & Nav */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 relative flex items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Readme Icons</h2>
                                </div>

                                <div className="flex gap-4 border-b border-white/5 mb-8">
                                    <Link href="/" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
                                        Skill Icons
                                    </Link>
                                    <Link href="/badges" className="px-4 py-2 text-sm font-medium text-white border-b-2 border-blue-500">
                                        Badge Builder
                                    </Link>
                                </div>
                            </div>

                            {/* 1. Select Tech */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <Search className="w-4 h-4" /> 1. Select Technology
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Search icon (e.g. Next.js)..."
                                        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
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
                                                className="absolute w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-h-[300px] overflow-y-auto z-50"
                                            >
                                                {filteredIcons.map((icon) => (
                                                    <button
                                                        key={icon.slug}
                                                        onClick={() => selectIcon(icon)}
                                                        className="flex items-center gap-3 w-full p-3 hover:bg-zinc-800 transition-colors text-left"
                                                    >
                                                        <div className="w-6 h-6 p-1 rounded bg-zinc-800">
                                                            <svg viewBox="0 0 24 24" fill={`#${icon.hex}`}><path d={icon.path} /></svg>
                                                        </div>
                                                        <span className="text-zinc-200">{icon.title}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* 2. Text Content */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <Type className="w-4 h-4" /> 2. Content
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-xs text-zinc-500">Label (Left)</span>
                                        <input
                                            type="text"
                                            value={label}
                                            onChange={(e) => setLabel(e.target.value)}
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs text-zinc-500">Message (Right)</span>
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Style & Color */}
                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <Palette className="w-4 h-4" /> 3. Style & Color
                                </label>

                                <div className="space-y-2">
                                    <span className="text-xs text-zinc-500">Badge Style</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['flat', 'flat-square', 'for-the-badge', 'plastic', 'social'] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setStyle(s)}
                                                className={cn(
                                                    "px-2 py-2 text-xs rounded-lg border transition-all truncate",
                                                    style === s
                                                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                                        : "bg-zinc-900 border-zinc-700 hover:border-zinc-500 text-zinc-400"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-xs text-zinc-500">Color (Hex or Name)</span>
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 rounded-lg border border-white/10 shrink-0" style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }} />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg outline-none focus:border-blue-500/50 font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-xs text-zinc-500">Logo Color</span>
                                        <select
                                            value={logoColor}
                                            onChange={(e) => setLogoColor(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg outline-none focus:border-blue-500/50 text-sm"
                                        >
                                            <option value="white">White</option>
                                            <option value="black">Black</option>
                                            {selectedIcon && <option value={selectedIcon.hex}>Brand ({selectedIcon.hex})</option>}
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="lg:col-span-7 h-full flex items-center justify-center p-8 bg-[#0D1117] relative">
                        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                        <div className="w-full max-w-2xl space-y-8 relative z-10">

                            {/* Visual Preview */}
                            <div className="flex flex-col items-center justify-center gap-8 min-h-[200px]">
                                <motion.img
                                    key={previewUrl} // Trigger animation on URL change
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={previewUrl}
                                    alt="Badge Preview"
                                    className="h-auto max-w-full drop-shadow-2xl"
                                />
                            </div>

                            {/* Markdown Code */}
                            <div className="glass rounded-xl p-1 border border-white/10 bg-black/40">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                                    <span className="text-xs font-semibold text-zinc-500 uppercase">Markdown</span>
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
                                <div className="p-4 overflow-x-auto">
                                    <code className="text-sm font-mono text-zinc-300 whitespace-nowrap">
                                        {markdownCode}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
