"use client";

import { useState, useMemo, useCallback } from "react";
import type { Project, ProjectFormData, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { titleToSlug } from "@/lib/slug-utils";
import { saveProject } from "@/lib/firebase-client";
import TagInput from "./TagInput";
import LivePreview from "./LivePreview";

interface ProjectFormProps {
  project?: Project | null;
  allTags: string[];
  onSave: () => void;
  onCancel: () => void;
}

const EMPTY_FORM: ProjectFormData = {
  title: "",
  description: "",
  icon: "",
  category: "tools",
  tags: [],
  liveUrl: "",
  repoUrl: "",
  status: "draft",
  body: `## What it does

Explain what this project is and why it matters.

## How to use

1. **Step one** — describe the first step
2. **Step two** — describe the second step
3. **Step three** — describe the third step`,
};

export default function ProjectForm({ project, allTags, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(() => {
    if (project) {
      return {
        title: project.title,
        description: project.description,
        icon: project.icon,
        category: project.category,
        tags: project.tags,
        liveUrl: project.liveUrl,
        repoUrl: project.repoUrl || "",
        status: project.status,
        body: project.body,
      };
    }
    return { ...EMPTY_FORM };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const slug = useMemo(() => titleToSlug(form.title), [form.title]);

  const previewData = useMemo(
    () => ({
      title: form.title,
      description: form.description,
      icon: form.icon,
      category: form.category,
      tags: form.tags,
      body: form.body,
    }),
    [form.title, form.description, form.icon, form.category, form.tags, form.body]
  );

  const validate = useCallback((): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Project name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.icon.trim()) errs.icon = "Icon is required";
    if (!form.liveUrl.trim()) {
      errs.liveUrl = "Live URL is required";
    } else if (!form.liveUrl.startsWith("https://")) {
      errs.liveUrl = "Must be a valid URL starting with https://";
    }
    if (form.repoUrl && !form.repoUrl.startsWith("https://")) {
      errs.repoUrl = "Must be a valid URL starting with https://";
    }
    if (form.tags.length === 0) errs.tags = "Add at least one tag";
    if (!form.body.trim()) errs.body = "Project details are required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSaveError("");

    try {
      await saveProject(
        project?.slug || slug,
        form,
        project?.order
      );

      await fetch("/api/revalidate", { method: "POST" }).catch(() => {});

      onSave();
    } catch (err: any) {
      setSaveError(err.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {project ? "Edit Project" : "Add Project"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
          <div className="w-3/5 overflow-y-auto p-6 space-y-4 border-r border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                  ${errors.title ? "border-red-400" : "border-gray-200"} focus:border-[#dc2626]`}
                placeholder="Exam Seating Plan Generator"
              />
              {slug && (
                <p className="text-[10px] text-gray-400 mt-1">
                  URL: /<strong>{slug}</strong>
                </p>
              )}
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Icon (emoji) *
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => updateField("icon", e.target.value)}
                  maxLength={4}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                    ${errors.icon ? "border-red-400" : "border-gray-200"} focus:border-[#dc2626]`}
                  placeholder="🎓"
                />
                {errors.icon && <p className="text-xs text-red-600 mt-1">{errors.icon}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value as Category)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none
                           focus:border-[#dc2626] bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">Tags *</label>
              <TagInput
                tags={form.tags}
                onChange={(tags) => updateField("tags", tags)}
                allExistingTags={allTags}
                error={errors.tags}
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Type a tag name and press Enter to add
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Short Description *
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                maxLength={150}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                  ${errors.description ? "border-red-400" : "border-gray-200"} focus:border-[#dc2626]`}
                placeholder="Generate randomized 6x5 seating plans for exam halls"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Live URL *
                </label>
                <input
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => updateField("liveUrl", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                    ${errors.liveUrl ? "border-red-400" : "border-gray-200"} focus:border-[#dc2626]`}
                  placeholder="https://..."
                />
                {errors.liveUrl && <p className="text-xs text-red-600 mt-1">{errors.liveUrl}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Source Code URL
                </label>
                <input
                  type="url"
                  value={form.repoUrl}
                  onChange={(e) => updateField("repoUrl", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none
                    ${errors.repoUrl ? "border-red-400" : "border-gray-200"} focus:border-[#dc2626]`}
                  placeholder="https://github.com/..."
                />
                {errors.repoUrl && <p className="text-xs text-red-600 mt-1">{errors.repoUrl}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value as "live" | "draft")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none
                         focus:border-[#dc2626] bg-white"
              >
                <option value="draft">⚠️ Draft — hidden from site</option>
                <option value="live">✓ Live — visible on site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Project Details *
              </label>
              <textarea
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                rows={14}
                className={`w-full px-3 py-2 border rounded-lg text-sm font-mono outline-none resize-y
                  ${errors.body ? "border-red-400" : "border-gray-200"} focus:border-[#dc2626]`}
              />
              {errors.body && <p className="text-xs text-red-600 mt-1">{errors.body}</p>}
            </div>
          </div>

          <div className="w-2/5 p-4 bg-[#f8f9fa]">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">
              Live Preview
            </p>
            <div className="h-full">
              <LivePreview data={previewData} />
            </div>
          </div>
        </form>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <div>
            {project && (
              <button
                type="button"
                onClick={onCancel}
                className="text-sm text-red-600 hover:underline"
              >
                Delete this project
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {saveError && (
              <p className="text-xs text-red-600 self-center">{saveError}</p>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600
                       hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2.5 bg-[#dc2626] text-white rounded-lg text-sm font-semibold
                       hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
