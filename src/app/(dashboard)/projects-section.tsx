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
  Search,
  Trash
} from "lucide-react";

// TODO: Fix these imports - using web-projects instead of projects feature
// import { useGetProjects } from "@/features/projects/api/use-get-projects";
// import { useDeleteProject } from "@/features/projects/api/use-delete-project";
// import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";

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
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

// TODO: This component requires the projects feature which doesn't exist yet
// It should be refactored to use web-projects or removed if not needed
export const ProjectsSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">
        Recent projects
      </h3>
      <div className="flex flex-col gap-y-4 items-center justify-center h-32">
        <p className="text-muted-foreground text-sm">
          Feature temporarily disabled
        </p>
      </div>
    </div>
  );
};
