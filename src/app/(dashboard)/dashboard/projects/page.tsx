"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
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
    Columns4
} from "lucide-react";
import { useGetWebProjects } from "@/features/web-projects/api/use-get-web-projects";
import { useUpdateWebProject } from "@/features/web-projects/api/use-update-web-project";
import { useDeleteWebProject } from "@/features/web-projects/api/use-delete-web-project";

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

export default function ProjectsPage() {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this project.",
    );
    const router = useRouter();

    const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
    const [gridColumns, setGridColumns] = React.useState<2 | 3 | 4>(3);

    // Persist view options in localStorage
    React.useEffect(() => {
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

    const updateWebProjectMutation = useUpdateWebProject(""); // Temporary ID, we'll pass it in mutate

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

    return (
        <div className="space-y-12 max-w-screen-xl mx-auto pb-10">
            <ConfirmDialog />

            {/* View Options Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => toggleViewMode("grid")}
                                >
                                    <LayoutGrid className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Grid View</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => toggleViewMode("list")}
                                >
                                    <List className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>List View</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />

                    {viewMode === "grid" && (
                        <div className="flex items-center gap-x-1">
                            <span className="text-xs font-medium text-muted-foreground mr-2 hidden md:inline">Columns:</span>
                            <Button
                                variant={gridColumns === 2 ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => updateGridColumns(2)}
                                className="h-8 w-8 p-0"
                            >
                                <Columns2 className="size-4" />
                            </Button>
                            <Button
                                variant={gridColumns === 3 ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => updateGridColumns(3)}
                                className="h-8 w-8 p-0"
                            >
                                <Columns3 className="size-4" />
                            </Button>
                            <Button
                                variant={gridColumns === 4 ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => updateGridColumns(4)}
                                className="h-8 w-8 p-0"
                            >
                                <Columns4 className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                    Manage your creative projects
                </div>
            </div>

            {/* Web Projects Section */}
            <div className="space-y-4">
                <h2 className="font-bold text-2xl">
                    Web Projects
                </h2>

                {viewMode === "list" ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead className="hidden md:table-cell">Template</TableHead>
                                <TableHead className="hidden md:table-cell">Public Link</TableHead>
                                <TableHead className="hidden md:table-cell">Updated At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {webProjects?.map((project: any) => (
                                <TableRow key={project.id}>
                                    <TableCell
                                        onClick={() => router.push(`/web/birthday/girlfriend/${project.templateId}?id=${project.id}`)}
                                        className="font-medium flex items-center gap-x-2 cursor-pointer"
                                    >
                                        <Globe className="size-6 text-indigo-500" />
                                        {project.name}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {project.templateId}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <a
                                            href={`/p/${project.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:underline"
                                        >
                                            /p/{project.slug}
                                        </a>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {formatDistanceToNow(new Date(project.updatedAt), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell className="flex items-center justify-end">
                                        <WebProjectActions project={project} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className={cn("grid gap-6", gridColsClass)}>
                        {webProjects?.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
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
    const updateMutation = useUpdateWebProject(project.id);
    const deleteMutation = useDeleteWebProject();

    const handleEdit = () => {
        // Check if this is an HTML template (from creator panel)
        if (project.templateId?.startsWith("html-")) {
            // Use the templateId as-is since it already has the 'html-' prefix
            router.push(`/templates/html/edit/${project.templateId}`);
        } else {
            // JSX/TSX template - use existing path
            const templatePath = getTemplatePath(project.templateId);
            router.push(`${templatePath}?id=${project.id}`);
        }
    };

    const handleChangeRoute = () => {
        const newSlug = window.prompt("Enter new slug for your published site:", project.slug || "");
        if (newSlug && newSlug !== project.slug) {
            // When updating slug, also publish the project
            updateMutation.mutate({ slug: newSlug, isPublished: true });
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteMutation.mutate({ id: project.id });
        }
    };

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg border-indigo-100 bg-indigo-50/5">
            <CardHeader className="p-4">
                <div className="aspect-video bg-gradient-to-br from-indigo-50 to-pink-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden relative">
                    <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-500 text-white shadow-sm">
                            Web
                        </span>
                    </div>
                    {project.thumbnailUrl ? (
                        <img
                            src={project.thumbnailUrl}
                            alt={project.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Globe className="size-20 text-indigo-200" />
                    )}
                    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
                </div>
                <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3 pt-0 text-sm text-muted-foreground">
                <div className="flex flex-col gap-y-2">
                    <a
                        href={`/p/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-indigo-600 font-medium hover:underline"
                    >
                        🌐 /p/{project.slug}
                    </a>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500">
                        <span>{project.templateId}</span>
                        <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-3 border-t bg-gradient-to-br from-indigo-50/50 to-pink-50/30 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                    <button
                        onClick={handleEdit}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                        className="flex-1 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Edit3 className="size-4" />
                        Edit
                    </button>
                    <button
                        onClick={handleChangeRoute}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                        className="flex-1 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Globe className="size-4" />
                        Route
                    </button>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                    className="w-full px-3 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash className="size-4" />
                    Delete
                </button>
            </CardFooter>
        </Card>
    );
}

import { useState } from "react";
import { PublishDialog } from "@/features/web-projects/components/publish-dialog";

function WebProjectActions({ project }: { project: any }) {
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
                                window.location.href = `/templates/html/edit/${project.templateId}`;
                            } else {
                                // JSX/TSX template - use existing path
                                const templatePath = getTemplatePath(project.templateId);
                                window.location.href = `${templatePath}?id=${project.id}`;
                            }
                        }}
                        disabled={updateMutation.isPending || deleteMutation.isPending}
                    >
                        <Edit3 className="size-4 mr-2" />
                        Edit Template
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
