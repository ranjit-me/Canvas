"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { EditableText } from "@/app/(dashboard)/web/features/components/EditableText";
import { EditableImage } from "@/app/(dashboard)/web/features/components/EditableImage";

interface PortalTemplateLoaderProps {
    code: string;
    data?: Record<string, string>;
    config?: Record<string, any>;
}

export const PortalTemplateLoader = ({ code, data = {}, config = {} }: PortalTemplateLoaderProps) => {
    const [mounted, setMounted] = useState(false);
    const [localData, setLocalData] = useState<Record<string, string>>(data);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // injectConfig helper
    const injectConfig = (str: string) => {
        let res = str;
        Object.entries(config).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\s*config\\.${key}\\s*\\}`, 'g');
            res = res.replace(regex, String(value));
        });
        return res;
    };

    // Parse code to separate HTML and component metadata
    const { processedHtml, components } = useMemo(() => {
        const componentRegex = /<(EditableText|EditableImage)\s+([^>]+?)\/>/gi;
        const comps: Array<{
            id: string;
            type: "EditableText" | "EditableImage";
            attributes: Record<string, string>;
            originalMatch: string;
        }> = [];

        // Replace components with portal markers
        const html = code.replace(componentRegex, (match, tagName, attributesStr) => {
            const attributes = parseAttributes(attributesStr);
            // Generate a stable ID if none provided, but we need strictly unique IDs for portals
            // Using index approach might be risky if replace order changes, but replace runs sequentially.
            // Better: generate a random ID or use provided ID.
            const id = attributes.id || `el_${comps.length}_${Math.random().toString(36).substr(2, 9)}`;

            // Ensure ID is in attributes for the component usage
            attributes.id = id;

            comps.push({
                id,
                type: tagName as any,
                attributes,
                originalMatch: match
            });

            // Use display: contents to minimize layout impact, 
            // but note that the portal content will be *inside* this div.
            return `<div id="portal-target-${id}" style="display: contents"></div>`;
        });

        return { processedHtml: injectConfig(html), components: comps };
    }, [code, config]); // config dependency if we wanted to inject config into HTML structure too

    useEffect(() => {
        setMounted(true);
    }, []);

    // Create portals
    const portals = useMemo(() => {
        if (!mounted) return null;

        return components.map((comp) => {
            const container = document.getElementById(`portal-target-${comp.id}`);
            if (!container) return null;

            const { id, attributes } = comp;
            const commonProps = {
                key: id,
                elementId: id,
                isSelected: selectedId === id,
                onSelect: () => setSelectedId(id),
                className: attributes.className,
            };

            if (comp.type === "EditableText") {
                return createPortal(
                    <EditableText
                        {...commonProps}
                        value={localData[id] || injectConfig(attributes.value || "")}
                        onChange={(val) => setLocalData(prev => ({ ...prev, [id]: val }))}
                        as={attributes.as as any || "span"}
                    />,
                    container
                );
            } else if (comp.type === "EditableImage") {
                return createPortal(
                    <EditableImage
                        {...commonProps}
                        src={localData[id] || injectConfig(attributes.src || "")}
                        onChange={(val) => setLocalData(prev => ({ ...prev, [id]: val }))}
                        alt={attributes.alt}
                    />,
                    container
                );
            }
            return null;
        });
    }, [mounted, components, localData, selectedId, config]);

    return (
        <div className="portal-template-container w-full h-full relative">
            <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
            {portals}
        </div>
    );
};

function parseAttributes(str: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const regex = /([a-z0-9]+)=\{?["']?(.*?)["']?\}?/gi;
    let match;
    while ((match = regex.exec(str)) !== null) {
        attrs[match[1]] = match[2];
    }
    return attrs;
}
