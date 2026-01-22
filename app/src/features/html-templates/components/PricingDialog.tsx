
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_COUNTRIES } from "@/lib/pricing";

interface PricingDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    pricing: Record<string, number>;
    onChange: (countryCode: string, price: number) => void;
}

export function PricingDialog({ isOpen, onOpenChange, pricing, onChange }: PricingDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-50/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Global Pricing Configuration
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {Object.entries(PRICING_COUNTRIES).map(([code, country]) => (
                        <div
                            key={code}
                            className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-inner">
                                {getFlagEmoji(code)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{country.name}</h4>
                                <span className="text-xs text-gray-500 font-mono tracking-wider">{country.currency}</span>
                            </div>
                            <div className="flex items-center gap-2 relative group">
                                <span className="text-gray-400 font-medium absolute left-3 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                                    {country.symbol}
                                </span>
                                <Input
                                    type="number"
                                    min="0"
                                    value={pricing[code] || ''}
                                    onChange={(e) => onChange(code, Number(e.target.value))}
                                    className="w-32 pl-8 text-right font-mono font-bold border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all rounded-lg"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <Button onClick={() => onOpenChange(false)} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6">
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper to get flag emoji
function getFlagEmoji(countryCode: string) {
    if (countryCode === 'OTHER') return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
