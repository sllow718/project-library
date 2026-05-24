"use client";

interface DeleteConfirmModalProps {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  projectName,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 text-center">
        <div className="text-3xl mb-3">⚠️</div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Delete &ldquo;{projectName}&rdquo;?
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          This is permanent. You can recover it from git history if needed.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600
                     hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-[#dc2626] text-white rounded-lg text-sm font-semibold
                     hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
