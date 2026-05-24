"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project } from "@/lib/types";
import { fetchAllProjects } from "@/lib/firebase-client";
import { getAllTags } from "@/lib/tag-utils";
import PasswordGate from "@/components/admin/PasswordGate";
import AdminTable from "@/components/admin/AdminTable";
import ProjectForm from "@/components/admin/ProjectForm";
import ToastContainer from "@/components/admin/Toast";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.configured === false) {
          setConfigured(false);
          setAuthenticated(false);
        } else if (data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllProjects();
      setProjects(data);
      setAllTags(getAllTags(data));
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadProjects();
  }, [authenticated, loadProjects]);

  const handleSave = () => {
    setFormOpen(false);
    setEditingProject(null);
    loadProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  if (authenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <PasswordGate onAuthenticated={() => setAuthenticated(true)} configured={configured} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="bg-[#1e293b] text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-sm font-bold">⚙️ Admin — Project Manager</h1>
          <span className="text-[10px] text-gray-400">{projects.length} projects</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleAdd}
            className="bg-[#dc2626] text-white px-4 py-2 rounded-lg text-sm font-semibold
                     hover:bg-red-700 transition-colors"
          >
            + Add Project
          </button>
          <span className="text-[11px] text-gray-400">
            Drag rows to reorder — saves automatically
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading projects...</div>
        ) : (
          <AdminTable
            projects={projects}
            onEdit={handleEdit}
            onRefresh={loadProjects}
          />
        )}
      </main>

      {formOpen && (
        <ProjectForm
          project={editingProject}
          allTags={allTags}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}

      <ToastContainer />
    </div>
  );
}
