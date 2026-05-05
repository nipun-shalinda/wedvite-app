"use client";

import { useState } from "react";
import type { CardData } from "@/lib/card-data";
import { convertDriveUrl } from "@/lib/google-drive";

interface Props {
  form: CardData;
  update: (field: keyof CardData, value: string) => void;
}

export default function StepImage({ form, update }: Props) {
  const [rawUrl, setRawUrl] = useState(form.imageUrl);
  const [error, setError] = useState(false);

  function handleUrlChange(url: string) {
    setRawUrl(url);
    setError(false);
    const direct = convertDriveUrl(url.trim());
    update("imageUrl", direct);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Couple Image</h2>
      <p className="text-sm text-gray-500">Add your couple photo here. It will appear as the envelope background on your invitation card.</p>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Google Drive Image URL</label>
        <input type="url" value={rawUrl} onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-1">
        <p className="font-medium">How to get the link:</p>
        <ol className="list-decimal list-inside space-y-0.5 text-xs">
          <li>Upload your photo to Google Drive</li>
          <li>Right-click → Share → Change to &quot;Anyone with the link&quot;</li>
          <li>Copy the link and paste it above</li>
        </ol>
      </div>

      {/* Preview */}
      {form.imageUrl && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imageUrl}
              alt="Couple preview"
              className="w-full h-full object-cover"
              onError={() => setError(true)}
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 mt-1">
              Image failed to load. Make sure the file is shared as &quot;Anyone with the link&quot;.
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400">If you skip this step, a default illustration will be used.</p>
    </div>
  );
}
