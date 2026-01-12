"use client";

import { useGetCreatorDetails } from "../api/use-get-creator-details";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, DollarSign, Package, TrendingUp, MapPin, Globe, CreditCard, ExternalLink, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CreatorDetailsModalProps {
    creatorId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CreatorDetailsModal({ creatorId, isOpen, onClose }: CreatorDetailsModalProps) {
    const { data, isLoading } = useGetCreatorDetails(creatorId || "");

    if (!isOpen) return null;

    const creator = data?.creator;
    const stats = data?.stats;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 bg-gray-50 flex flex-col">
                <ScrollArea className="h-full">
                    {isLoading ? (
                        <div className="h-[60vh] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : creator && stats ? (
                        <div className="p-6 space-y-6">
                            {/* Creator Header Profile */}
                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-md flex-shrink-0">
                                    {creator.profilePhotoUrl ? (
                                        <img src={creator.profilePhotoUrl || ""} alt={creator.name || ""} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        creator.name?.charAt(0)
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
                                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                                {creator.email}
                                                <Badge variant="secondary" className="ml-2 font-normal">
                                                    {creator.specialization || "General Creator"}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-sm text-gray-400">Creator ID</div>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">{creator.id}</code>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPin className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400">Location</p>
                                                <p className="font-medium">{creator.state ? `${creator.state}, ` : ""}{creator.country}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400">Total Earnings</p>
                                                <p className="font-medium text-green-700">₹{stats.totalEarnings.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Package className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400">Total Templates</p>
                                                <p className="font-medium">{stats.totalTemplates}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><TrendingUp className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400">Total Sales</p>
                                                <p className="font-medium">{stats.totalSales}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio / About */}
                            {creator.bio && (
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">About Creator</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">{creator.bio}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Analytics Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Col - Earnings by Location */}
                                <Card className="lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Earnings by Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {Object.entries(stats.earningsByCountry).map(([country, amount]: [string, any]) => (
                                                <div key={country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl">🌍</span>
                                                        <span className="font-medium text-sm">{country}</span>
                                                    </div>
                                                    <span className="font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {Object.keys(stats.earningsByCountry).length === 0 && (
                                                <p className="text-sm text-center text-gray-400 py-4">No location data available yet</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Right Col - State wise breakout (if available) */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Earnings by State/Region
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(stats.earningsByState).map(([state, amount]: [string, any]) => (
                                                <div key={state} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                                    <span className="font-medium text-sm text-gray-700">{state}</span>
                                                    <span className="font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {Object.keys(stats.earningsByState).length === 0 && (
                                                <p className="text-sm text-center text-gray-400 py-4 w-full md:col-span-2">No regional data available yet</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Templates Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Templates Performance</span>
                                        <span className="text-sm font-normal text-gray-500">{stats.templates.length} templates found</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Template Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Sales</TableHead>
                                                <TableHead className="text-right">Earnings</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stats.templates.map((template: any) => (
                                                <TableRow key={template.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                                {template.thumbnail ? (
                                                                    <img src={template.thumbnail} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                        <Package className="w-4 h-4" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 line-clamp-1">{template.name}</p>
                                                                <div className="flex items-center gap-1">
                                                                    <Badge variant="outline" className="text-[10px] h-4 px-1">{template.type.toUpperCase()}</Badge>
                                                                    <a
                                                                        href={template.type === 'html' ? `/html-preview/${template.id}` : `/preview/${template.id}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-xs text-blue-500 hover:underline flex items-center gap-0.5 ml-1"
                                                                    >
                                                                        Preview <ExternalLink className="w-2 h-2" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-500">{template.category}</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {template.price ? `₹${template.price}` : "Free"}
                                                    </TableCell>
                                                    <TableCell className="text-right">{template.sales}</TableCell>
                                                    <TableCell className="text-right font-bold text-green-700">
                                                        ₹{template.earnings.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={cn(
                                                            "inline-block w-2 H-2 rounded-full",
                                                            template.isActive ? "bg-green-500" : "bg-gray-300"
                                                        )} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            Creator data not found.
                        </div>
                    )}
                </ScrollArea>
                <div className="p-4 border-t bg-white flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Utility class name helper
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}
