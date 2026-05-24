"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";
import { updateProjectOrder, deleteProject } from "@/lib/firebase-client";
import { recalculateOrder } from "@/lib/tag-utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { showToast } from "./Toast";

interface AdminTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onRefresh: () => void;
}

function SortableRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colors = CATEGORY_COLORS[project.category];

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 ${isDragging ? "bg-red-50" : "hover:bg-gray-50"}`}
    >
      <td className="py-2.5 px-2">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing px-1"
        >
          ☰
        </button>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{project.icon}</span>
          <div>
            <div className="font-semibold text-sm text-gray-900">{project.title}</div>
            <div className="text-[10px] text-gray-400">{project.slug}</div>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <span
          className="px-2 py-0.5 rounded text-[10px] font-medium text-white"
          style={{ backgroundColor: colors.bar }}
        >
          {project.category}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex gap-1 flex-wrap">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            project.status === "live"
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {project.status === "live" ? "✓ Live" : "⚠ Draft"}
        </span>
      </td>
      <td className="py-2.5 px-3 whitespace-nowrap">
        <button
          onClick={onEdit}
          className="px-2.5 py-1 border border-gray-200 rounded text-[11px] text-gray-600
                   hover:bg-gray-50 transition-colors mr-1"
        >
          ✏️ Edit
        </button>
        <button
          onClick={onDelete}
          className="px-2.5 py-1 border border-red-200 rounded text-[11px] text-red-600
                   hover:bg-red-50 transition-colors"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}

export default function AdminTable({ projects, onEdit, onRefresh }: AdminTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.slug === active.id);
    const newIndex = projects.findIndex((p) => p.slug === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    setReordering(true);
    try {
      const updates = recalculateOrder(projects, oldIndex, newIndex);
      await updateProjectOrder(updates);
      await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
      showToast("success", "Order saved");
      onRefresh();
    } catch {
      showToast("error", "Failed to save order. Try again.");
    } finally {
      setReordering(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.slug);
      await fetch("/api/revalidate", { method: "POST" }).catch(() => {});
      showToast("success", `Deleted "${deleteTarget.title}"`);
      setDeleteTarget(null);
      onRefresh();
    } catch {
      showToast("error", "Failed to delete. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.slug)} strategy={verticalListSortingStrategy}>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 text-left">
                  <th className="py-3 px-2 w-8"></th>
                  <th className="py-3 px-3 text-[10px] text-gray-400 font-semibold uppercase">
                    Project
                  </th>
                  <th className="py-3 px-3 text-[10px] text-gray-400 font-semibold uppercase">
                    Category
                  </th>
                  <th className="py-3 px-3 text-[10px] text-gray-400 font-semibold uppercase">
                    Tags
                  </th>
                  <th className="py-3 px-3 text-[10px] text-gray-400 font-semibold uppercase">
                    Status
                  </th>
                  <th className="py-3 px-3 text-[10px] text-gray-400 font-semibold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <SortableRow
                    key={project.slug}
                    project={project}
                    onEdit={() => onEdit(project)}
                    onDelete={() => setDeleteTarget(project)}
                  />
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                      No projects yet. Click &ldquo;+ Add Project&rdquo; to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SortableContext>
      </DndContext>

      {deleteTarget && (
        <DeleteConfirmModal
          projectName={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
