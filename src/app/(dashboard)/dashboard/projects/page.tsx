"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, addMonths, isPast, differenceInSeconds } from "date-fns";
import {
    AlertTriangle,
    CopyIcon,
    FileIcon,
    Loader,
    MoreHorizontal,
    Globe,
    Edit3,
    Trash,
    LayoutGrid,
    List,
    Columns2,
    Columns3,
    Columns4,
    Search,
    Filter,
    ArrowRight,
    FolderClock,
    Clock,
    Eye,
    EyeOff,
    Lock,
    Unlock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetWebProjects } from "@/features/web-projects/api/use-get-web-projects";
import {
    DropdownMenuContent,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useUpdateWebProject } from "@/features/web-projects/api/use-update-web-project";
import { useDeleteWebProject } from "@/features/web-projects/api/use-delete-web-project";
import { PublishDialog } from "@/features/web-projects/components/publish-dialog";

function ProjectStatusBadge({ createdAt, purchasedAt, showCountdown = true }: { createdAt: string | Date, purchasedAt?: string | Date | null, showCountdown?: boolean }) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(purchasedAt || createdAt);
            const expiry = addMonths(start, 6);
            const now = new Date();

            if (isPast(expiry)) {
                setIsExpired(true);
                setTimeLeft("Expired");
                return;
            }

            const diff = differenceInSeconds(expiry, now);
            const days = Math.floor(diff / (24 * 3600));
            const hours = Math.floor((diff % (24 * 3600)) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m`);
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 60000); // update every minute

        return () => clearInterval(timer);
    }, [createdAt]);

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300",
            isExpired
                ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm shadow-emerald-100/50 dark:shadow-none"
        )}>
            <div className={cn(
                "size-1.5 rounded-full",
                isExpired ? "bg-red-500" : "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            )} />
            <span className="flex items-center gap-1">
                {isExpired ? "INACTIVE" : "ACTIVE"}
                {!isExpired && showCountdown && (
                    <span className="flex items-center gap-1 opacity-80 border-l border-emerald-200 dark:border-emerald-800/50 ml-1 pl-2">
                        <Clock className="size-2.5" />
                        {timeLeft}
                    </span>
                )}
            </span>
        </div>
    );
}

export default function ProjectsPage() {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this project.",
    );
    const router = useRouter();

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
    const [searchQuery, setSearchQuery] = useState("");
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    // Persist view options in localStorage
    useEffect(() => {
        const savedViewMode = localStorage.getItem("project-view-mode") as "grid" | "list" | null;
        const savedGridColumns = localStorage.getItem("project-grid-columns");

        if (savedViewMode) {
            setViewMode(savedViewMode);
        }
        if (savedGridColumns) {
            setGridColumns(parseInt(savedGridColumns, 10) as 2 | 3 | 4);
        }
    }, []);

    const toggleViewMode = (mode: "grid" | "list") => {
        setViewMode(mode);
        localStorage.setItem("project-view-mode", mode);
    };

    const updateGridColumns = (cols: 2 | 3 | 4) => {
        setGridColumns(cols);
        localStorage.setItem("project-grid-columns", cols.toString());
    };

    const {
        data: webProjects,
        status: webStatus,
    } = useGetWebProjects();


    if (webStatus === "pending") {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-2xl">
                        All Projects
                    </h2>
                </div>
                <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                    <Loader className="size-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    const gridColsClass = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    }[gridColumns];

    const filteredProjects = webProjects?.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 pb-20">
            <ConfirmDialog />

            {/* Premium Header Banner */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10" />
                <div className="max-w-screen-xl mx-auto px-6 py-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <FolderClock className="size-6 text-white" />
                                </div>
                                <span className="text-sm font-black tracking-widest text-indigo-600 uppercase">Manage Work</span>
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
                                My <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Projects</span>
                            </h1>
                            <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                                View and edit your creative collection. All your saved websites and designs in one professional dashboard.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-1 mx-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => setViewMode("grid")}
                                                className={cn(
                                                    "p-2.5 rounded-2xl transition-all",
                                                    viewMode === "grid"
                                                        ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600"
                                                        : "text-gray-400 hover:text-gray-600"
                                                )}
                                            >
                                                <LayoutGrid className="size-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>Grid View</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => setViewMode("list")}
                                                className={cn(
                                                    "p-2.5 rounded-2xl transition-all",
                                                    viewMode === "list"
                                                        ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600"
                                                        : "text-gray-400 hover:text-gray-600"
                                                )}
                                            >
                                                <List className="size-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>List View</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Separator orientation="vertical" className="h-8 bg-gray-200 dark:bg-gray-700" />
                            <div className="flex items-center gap-2 px-2">
                                <Search className="size-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none focus:ring-0 text-sm font-medium w-40 md:w-64 placeholder:text-gray-400"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6">
                {/* Projects Content */}
                <AnimatePresence mode="wait">
                    {filteredProjects && filteredProjects.length > 0 ? (
                        <motion.div
                            key={viewMode}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {viewMode === "list" ? (
                                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                            <TableRow className="border-none hover:bg-transparent">
                                                <TableHead className="px-8 py-5 text-[10px] font-black tracking-widest uppercase text-gray-400">Project</TableHead>
                                                <TableHead className="hidden md:table-cell text-[10px] font-black tracking-widest uppercase text-gray-400">Status</TableHead>
                                                <TableHead className="hidden md:table-cell text-[10px] font-black tracking-widest uppercase text-gray-400">Visibility</TableHead>
                                                <TableHead className="hidden md:table-cell text-[10px] font-black tracking-widest uppercase text-gray-400">Type</TableHead>
                                                <TableHead className="hidden md:table-cell text-[10px] font-black tracking-widest uppercase text-gray-400">Live URL</TableHead>
                                                <TableHead className="hidden md:table-cell text-[10px] font-black tracking-widest uppercase text-gray-400">Last Modified</TableHead>
                                                <TableHead className="text-right px-8 text-[10px] font-black tracking-widest uppercase text-gray-400">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProjects.map((project: any) => (
                                                <TableRow key={project.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                                    <TableCell
                                                        onClick={() => router.push(`/p/${project.slug}`)}
                                                        className="px-8 py-4 cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200/50">
                                                                {project.thumbnailUrl ? (
                                                                    <img src={project.thumbnailUrl} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Globe className="size-5 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.name}</div>
                                                                <div className="text-xs text-gray-400 font-medium">#{project.id.slice(0, 8)}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <ProjectStatusBadge
                                                            createdAt={project.createdAt}
                                                            purchasedAt={project.purchasedAt}
                                                            showCountdown={false}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <div className={cn(
                                                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300",
                                                            project.isPublished
                                                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 shadow-sm shadow-indigo-100/10"
                                                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                                                        )}>
                                                            {project.isPublished ? <Globe className="size-3" /> : <Lock className="size-3" />}
                                                            {project.isPublished ? "Public" : "Private"}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                            {project.templateId?.startsWith("html-") ? "HTML TEMPLATE" : "REACT TEMPLATE"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <a
                                                            href={`${baseUrl}/p/${project.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
                                                        >
                                                            {baseUrl.replace(/^https?:\/\//, '')}/p/{project.slug}
                                                            <ArrowRight className="size-3" />
                                                        </a>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-xs text-gray-500 font-medium">
                                                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                                    </TableCell>
                                                    <TableCell className="text-right px-8">
                                                        <WebProjectActions project={project} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className={cn("grid gap-8", gridColsClass)}>
                                    {filteredProjects.map((project: any) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="size-20 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700">
                                <FileIcon className="size-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No projects found</h3>
                            <p className="text-gray-500 font-medium max-w-sm">
                                {searchQuery ? "No projects match your search criteria." : "Start your creative journey by designing your first website today!"}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="mt-8 px-8 py-6 rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold"
                                >
                                    Explore Templates
                                </Button>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helper function to get template path based on templateId
function getTemplatePath(templateId: string): string {
    const templatePaths: Record<string, string> = {
        'rose-birthday': '/web/birthday/girlfriend/rose-birthday',
        'dreamy-pink-paradise': '/web/birthday/girlfriend/dreamy-pink-paradise',
        'midnight-promise-girlfriend': '/web/templates/midnight-promise-girlfriend',
        'midnight-promise-boyfriend': '/web/templates/midnight-promise-boyfriend',
        'romantic-anniversary': '/web/anniversary/romantic/romantic-anniversary',
    };

    return templatePaths[templateId] || `/web/birthday/girlfriend/${templateId}`;
}

function ProjectCard({ project }: { project: any }) {
    const router = useRouter();
    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const updateMutation = useUpdateWebProject(project.id);
    const deleteMutation = useDeleteWebProject();

    const handleToggleVisibility = () => {
        const newStatus = !project.isPublished;
        updateMutation.mutate({ isPublished: newStatus });
    };

    const handleEdit = () => {
        if (project.templateId?.startsWith("html-")) {
            router.push(`/templates/html/edit/${project.templateId}`);
        } else {
            const templatePath = getTemplatePath(project.templateId);
            router.push(`${templatePath}?id=${project.id}`);
        }
    };

    const handleChangeRoute = () => {
        const newSlug = window.prompt("Enter new slug for your published site:", project.slug || "");
        if (newSlug && newSlug !== project.slug) {
            updateMutation.mutate({ slug: newSlug, isPublished: true });
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteMutation.mutate({ id: project.id });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden h-full flex flex-col">
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border border-white/20">
                            {project.templateId?.startsWith("html-") ? (
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HTML TEMPLATE</span>
                            ) : (
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">REACT TEMPLATE</span>
                            )}
                        </div>
                    </div>

                    {/* Image or Placeholder */}
                    {project.thumbnailUrl ? (
                        <img
                            src={project.thumbnailUrl}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-950/20 dark:to-pink-950/20 flex items-center justify-center">
                            <Globe className="size-16 text-indigo-200 dark:text-indigo-900/30 animate-pulse" />
                        </div>
                    )}

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center backdrop-blur-sm">
                        <button
                            onClick={() => window.open(`${baseUrl}/p/${project.slug}`, '_blank')}
                            className="p-3 bg-white rounded-full hover:scale-110 transition-transform shadow-xl"
                        >
                            <Globe className="size-5 text-gray-900" />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h3>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                        <ProjectStatusBadge
                            createdAt={project.createdAt}
                            purchasedAt={project.purchasedAt}
                        />
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300",
                            project.isPublished
                                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm shadow-indigo-100/50 dark:shadow-none"
                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20"
                        )}>
                            {project.isPublished ? (
                                <span className="flex items-center gap-1">
                                    <Globe className="size-3" /> PUBLIC
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <Lock className="size-3" /> PRIVATE
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 max-w-full overflow-hidden">
                                <span className="text-[10px] font-mono font-medium text-gray-500 whitespace-nowrap">
                                    {baseUrl.replace(/^https?:\/\//, '')}/p/{project.slug}
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium ml-1">
                            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </span>
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="flex gap-3">
                            <button
                                onClick={handleEdit}
                                disabled={updateMutation.isPending || deleteMutation.isPending}
                                className="flex-1 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 dark:shadow-none"
                            >
                                <Edit3 className="size-4" />
                                Edit Design
                            </button>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => !project.isPublished && handleToggleVisibility()}
                                    className={cn(
                                        "px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-1.5",
                                        project.isPublished
                                            ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <Globe className="size-3" /> Public
                                </button>
                                <button
                                    onClick={() => project.isPublished && handleToggleVisibility()}
                                    className={cn(
                                        "px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-1.5",
                                        !project.isPublished
                                            ? "bg-white dark:bg-gray-700 text-amber-600 shadow-sm"
                                            : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    <Lock className="size-3" /> Private
                                </button>
                            </div>
                            <button
                                onClick={handleChangeRoute}
                                disabled={updateMutation.isPending || deleteMutation.isPending}
                                className="px-3.5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center shrink-0"
                                title="Change Slug"
                            >
                                <Globe className="size-4" />
                            </button>
                        </div>

                        <button
                            onClick={handleDelete}
                            disabled={updateMutation.isPending || deleteMutation.isPending}
                            className="w-full px-4 py-3 text-red-500 hover:text-white hover:bg-red-500 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-600"
                        >
                            <Trash className="size-4" />
                            Delete Project
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// WebProjectActions remains below

function WebProjectActions({ project }: { project: any }) {
    const router = useRouter();
    const updateMutation = useUpdateWebProject(project.id);
    const deleteMutation = useDeleteWebProject();
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

    const onPublish = (slug: string) => {
        updateMutation.mutate({ slug, isPublished: true }, {
            onSuccess: () => {
                // Success is handled by the mutation or we can add a toast here if needed
            }
        });
    };

    const onDelete = async () => {
        if (window.confirm("Are you sure you want to delete this web project?")) {
            deleteMutation.mutate({ id: project.id });
        }
    };

    return (
        <>
            <PublishDialog
                isOpen={isPublishDialogOpen}
                onClose={() => setIsPublishDialogOpen(false)}
                onPublish={onPublish}
                defaultSlug={project.slug || ""}
                templateName={project.name || "Your Template"}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                        size="icon"
                        variant="ghost"
                    >
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuItem
                        className="h-10 cursor-pointer"
                        onClick={() => {
                            // Check if this is an HTML template (from creator panel)
                            if (project.templateId?.startsWith("html-")) {
                                // Use the templateId as-is since it already has the 'html-' prefix
                                router.push(`/templates/html/edit/${project.templateId}`);
                            } else {
                                // JSX/TSX template - use existing path
                                const templatePath = getTemplatePath(project.templateId);
                                router.push(`${templatePath}?id=${project.id}`);
                            }
                        }}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                    >
                        <Edit3 className="size-4 mr-2" />
                        Edit Template
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="h-10 cursor-pointer"
                        onClick={() => updateMutation.mutate({ isPublished: !project.isPublished })}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                    >
                        {project.isPublished ? (
                            <>
                                <EyeOff className="size-4 mr-2" />
                                Make Private
                            </>
                        ) : (
                            <>
                                <Eye className="size-4 mr-2" />
                                Make Public
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="h-10 cursor-pointer"
                        onClick={() => setIsPublishDialogOpen(true)}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                    >
                        <Globe className="size-4 mr-2" />
                        Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="h-10 cursor-pointer text-red-600 focus:text-red-600"
                        onClick={onDelete}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                    >
                        <Trash className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
