/**
 * Template Converter Engine - Advanced Edition
 * 
 * Transforms raw JSX (React) code into browser-renderable "Infected" HTML.
 * - Handles multi-component files (picks the complex UI)
 * - Flattens variable props for visual preview
 * - Unrolls multi-step logic (&&, ternary)
 */

export function transformTemplateCode(rawCode: string): string {
    let code = rawCode;

    // 1. PICK THE MAIN UI COMPONENT (Enhanced Extraction)
    // We look for any return statement followed by ( ... ) or <... />
    const returnRegex = /return\s*(?:\(\s*([\s\S]*?)\s*\)|(<[a-z0-9]+[\s\S]*?\/?>))\s*;?/gi;
    let match;
    let bestJSX = "";
    let maxTags = -1;

    while ((match = returnRegex.exec(code)) !== null) {
        const body = match[1] || match[2];
        if (!body) continue;
        const tagCount = (body.match(/<[a-z]+/gi) || []).length;
        if (tagCount > maxTags) {
            maxTags = tagCount;
            bestJSX = body;
        }
    }

    if (bestJSX) {
        code = bestJSX;
    } else {
        // Fallback: find first major tag and try to find its matching pair or just grab a chunk
        const tagIndex = code.search(/<(div|section|main|header|footer|motion\.)/i);
        if (tagIndex !== -1) {
            const lastTagIndex = code.lastIndexOf('>');
            code = code.substring(tagIndex, lastTagIndex + 1);
        }
    }

    // 2. POLYFILL JSX STYLE OBJECTS (Handle nested braces)
    code = code.replace(/style=\{\{([\s\S]*?)\}\}/gi, (match, styleBody) => {
        try {
            const styleRules = styleBody.split(/,(?![^{]*})/).map((rule: string) => {
                const parts = rule.split(':');
                if (parts.length < 2) return '';
                const prop = parts[0].trim();
                const val = parts.slice(1).join(':').trim();
                const kebabProp = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
                const cleanVal = val.replace(/['"]/g, '').replace(/;$/, '');
                return `${kebabProp}: ${cleanVal};`;
            }).filter(Boolean).join(' ');
            return `style="${styleRules}"`;
        } catch (e) { return 'style=""'; }
    });

    // 3. CLEAN UP REACT WRAPPERS
    code = code.replace(/<(AnimatePresence|Suspense|Provider|Confetti|T)[\s\S]*?>/gi, '');
    code = code.replace(/<\/(AnimatePresence|Suspense|Provider|Confetti|T)>/gi, '');
    code = code.replace(/<Confetti[\s\S]*?\/>/gi, '');

    // 4. PROTECT LOGIC BLOCKS (Recursive Brace Aware)
    const placeholders: string[] = [];
    let i = 0;
    while (i < code.length) {
        if (code[i] === '{') {
            let start = i;
            let count = 1;
            let j = i + 1;
            while (j < code.length && count > 0) {
                if (code[j] === '{') count++;
                if (code[j] === '}') count--;
                j++;
            }
            if (count === 0) {
                const content = code.substring(start, j);
                placeholders.push(content);
                const placeholder = `__LOGIC_PLACEHOLDER_${placeholders.length - 1}__`;
                code = code.substring(0, start) + placeholder + code.substring(j);
                i = start + placeholder.length;
                continue;
            }
        }
        i++;
    }

    // 5. REPLACE LUCIDE ICONS
    const iconMap: Record<string, string> = {
        'Heart': '❤️', 'Star': '⭐', 'Sparkles': '✨', 'Lock': '🔒', 'Gift': '🎁', 'Eye': '👁️', 'X': '❌'
    };
    Object.entries(iconMap).forEach(([icon, emoji]) => {
        const regex = new RegExp(`<${icon}([^>]*?)\\/>`, 'gi');
        code = code.replace(regex, `<span className="icon-emoji">${emoji}</span>`);
    });

    // 6. FLATTEN MOTION COMPONENTS
    code = code.replace(/<(motion\.)(div|h1|h2|h3|h4|h5|h6|p|span|section|img|button)([^>]*?)>/gi, (match, prefix, tag, attrs) => {
        const cleanAttrs = attrs
            .replace(/(initial|animate|exit|whileHover|whileTap|transition|variants)=__LOGIC_PLACEHOLDER_\d+__/gi, '')
            .replace(/layout(Id)?(=__LOGIC_PLACEHOLDER_\d+__)?/gi, '');
        return `<${tag}${cleanAttrs}>`;
    });
    code = code.replace(/<\/motion\.(.*?)>/gi, '</$1>');

    let transformed = code;

    // 7. INFECT TEXT & IMAGE TAGS
    const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button'];
    textTags.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi');
        transformed = transformed.replace(regex, (match, attributes, content) => {
            if (content.includes('<') || content.includes('__LOGIC_')) return match;
            const trimmed = content.trim();
            if (!trimmed || trimmed.length < 1) return match;
            const id = `text_${Math.random().toString(36).substring(2, 7)}`;
            const className = getAttr(attributes, 'className') || getAttr(attributes, 'class') || '';
            const asTag = tag;
            return `<EditableText id="${id}" value="${trimmed.replace(/"/g, '&quot;')}" className="${className}" as="${asTag}" />`;
        });
    });

    // Infect <img> tags
    transformed = transformed.replace(/<img([^>]*)\/?>/gi, (match, attributes) => {
        const src = getAttr(attributes, 'src') || '';
        const alt = getAttr(attributes, 'alt') || '';
        const className = getAttr(attributes, 'className') || getAttr(attributes, 'class') || '';
        if (!src) return match;
        const id = `img_${Math.random().toString(36).substring(2, 7)}`;
        return `<EditableImage id="${id}" src="${src}" alt="${alt}" className="${className}" />`;
    });

    // 8. RESTORE PROTECTED LOGIC & UNROLL
    placeholders.forEach((val, i) => {
        let content = val.substring(1, val.length - 1); // remove outer {}

        // Unroll logic {condition && (...) }
        if (content.includes('&&') || content.includes('?')) {
            const parts = content.split(/&&|\?|:/);
            // Try to find the one that looks like JSX
            const jsxPart = parts.find(p => p.includes('<') || p.includes('__LOGIC_PLACEHOLDER_'));
            if (jsxPart) content = jsxPart.trim();
        }

        transformed = transformed.replace(`__LOGIC_PLACEHOLDER_${i}__`, content);
    });

    // Final cleanup: Remove any remaining curly braces from props if they surround simple values
    transformed = transformed.replace(/= \{ (["'].*?["']) \}/gi, '=$1');
    transformed = transformed.replace(/= \{ ([\d.]+) \}/gi, '=$1');

    return transformed.trim();
}

function getAttr(attributes: string, name: string): string | null {
    const patterns = [
        new RegExp(`${name}=(?:["'])(.*?)(?:["'])`, 'i'),
        new RegExp(`${name}=\\{?["']?(.*?)["']?\}?`, 'i')
    ];
    for (const pattern of patterns) {
        const match = attributes.match(pattern);
        if (match) return match[1];
    }
    return null;
}
