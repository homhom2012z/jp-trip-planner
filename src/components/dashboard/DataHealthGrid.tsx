"use client";

import { useUser } from "@/context/UserContext";
import { api } from "@/services/api";
import { useState, useMemo } from "react";

export default function DataHealthGrid() {
  const { locations, refreshLocations, activeTripId } = useUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [previewLoc, setPreviewLoc] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // Filter and Sort
  const filteredAndSortedLocations = useMemo(() => {
    let result = locations;

    // 1. Filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.name.toLowerCase().includes(lowerQuery) ||
          loc.city.toLowerCase().includes(lowerQuery) ||
          loc.type.toLowerCase().includes(lowerQuery)
      );
    }

    // 2. Sort: Warning items first
    return [...result].sort((a, b) => {
      const aMissing = !a.lat || !a.lng ? 1 : 0;
      const bMissing = !b.lat || !b.lng ? 1 : 0;
      return bMissing - aMissing; // Missing first
    });
  }, [locations, searchQuery]);

  const handleEdit = (id: string, field: string, currentValue: string) => {
    setEditingId(id);
    setEditField(field);
    setEditValue(currentValue);
  };

  const handleSave = async () => {
    if (!editingId || !editField || !activeTripId) return;

    setSaving(true);
    try {
      await api.updateLocation(activeTripId, editingId, {
        [editField]: editValue,
      });
      await refreshLocations(); // Refresh to show update
      setEditingId(null);
      setEditField(null);
    } catch (e) {
      alert("Failed to update");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditingId(null);
      setEditField(null);
    }
  };

  if (locations.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
        No locations found. Connect your sheet or add some data!
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name, city, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
          <div className="text-xs font-medium text-gray-500">
            {filteredAndSortedLocations.length} items
          </div>
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 w-1/3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-center">Coords</th>
                <th className="px-4 py-3 text-center">Photo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedLocations.map((loc) => {
                const hasCoords = loc.lat !== 0 && loc.lng !== 0 && !!loc.lat;
                const hasPhoto = !!loc.photoUrl;
                const isHealthy = hasCoords && hasPhoto;

                return (
                  <tr
                    key={loc.id}
                    className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700 group"
                  >
                    <td className="px-4 py-3">
                      {isHealthy ? (
                        <span className="material-symbols-outlined text-green-500 text-[18px]">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-amber-500 text-[18px]">
                          warning
                        </span>
                      )}
                    </td>

                    {/* Name Cell */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {editingId === loc.id && editField === "name" ? (
                        <input
                          autoFocus
                          className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={handleKeyDown}
                          disabled={saving}
                        />
                      ) : (
                        <div
                          onClick={() => handleEdit(loc.id, "name", loc.name)}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 rounded flex items-center gap-2 group-hover:text-blue-600 transition-colors"
                          title="Click to edit"
                        >
                          {loc.name}
                          <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-30">
                            edit
                          </span>
                        </div>
                      )}
                    </td>

                    {/* City Cell */}
                    <td className="px-4 py-3">
                      {editingId === loc.id && editField === "city" ? (
                        <input
                          autoFocus
                          className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={handleKeyDown}
                          disabled={saving}
                        />
                      ) : (
                        <div
                          onClick={() =>
                            handleEdit(loc.id, "city", loc.city || "")
                          }
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 rounded"
                          title="Click to edit"
                        >
                          {loc.city}
                        </div>
                      )}
                    </td>

                    {/* Type Cell */}
                    <td className="px-4 py-3">
                      {editingId === loc.id && editField === "type" ? (
                        <input
                          autoFocus
                          className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={handleKeyDown}
                          disabled={saving}
                        />
                      ) : (
                        <div
                          onClick={() => handleEdit(loc.id, "type", loc.type)}
                          className="cursor-pointer inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                          title="Click to edit"
                        >
                          {loc.type}
                        </div>
                      )}
                    </td>

                    {/* Price Cell */}
                    <td className="px-4 py-3">
                      {editingId === loc.id && editField === "priceJpy" ? (
                        <input
                          autoFocus
                          className="w-full px-2 py-1 border border-blue-500 rounded text-sm focus:outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={handleKeyDown}
                          disabled={saving}
                        />
                      ) : (
                        <div
                          onClick={() =>
                            handleEdit(loc.id, "priceJpy", loc.priceJpy || "")
                          }
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 -mx-2 rounded"
                          title="Click to edit"
                        >
                          {loc.priceJpy}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {hasCoords ? (
                        <span className="text-xs font-mono text-gray-500">
                          {loc.lat?.toFixed(3)}, {loc.lng?.toFixed(3)}
                        </span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 text-red-600 text-[10px] font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 mb-1">
                            MISSING
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {hasPhoto ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setPreviewLoc({
                                url: loc.photoUrl!,
                                name: loc.name,
                              })
                            }
                            className="text-gray-400 hover:text-[#1a73e8] transition-colors"
                            title="Preview Image"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              image
                            </span>
                          </button>
                          <a
                            href={loc.photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Open in new tab"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              open_in_new
                            </span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-amber-600 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="block md:hidden divide-y divide-gray-100">
          {filteredAndSortedLocations.map((loc) => {
            const hasCoords = loc.lat !== 0 && loc.lng !== 0 && !!loc.lat;
            const hasPhoto = !!loc.photoUrl;
            const isHealthy = hasCoords && hasPhoto;

            return (
              <div key={loc.id} className="p-4 bg-white">
                <div className="flex items-start gap-4">
                  {/* Photo or Placeholder */}
                  <div
                    className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden border border-gray-200"
                    onClick={() =>
                      hasPhoto &&
                      setPreviewLoc({ url: loc.photoUrl!, name: loc.name })
                    }
                  >
                    {hasPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={loc.photoUrl}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-gray-300">
                        image
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        onClick={() => handleEdit(loc.id, "name", loc.name)}
                        className="font-semibold text-gray-900 truncate pr-2 cursor-pointer active:text-blue-600"
                      >
                        {editingId === loc.id && editField === "name"
                          ? "..."
                          : loc.name}
                      </h3>
                      {isHealthy ? (
                        <span className="material-symbols-outlined text-green-500 text-[18px]">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-amber-500 text-[18px]">
                          warning
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500 mt-0.5">
                      {loc.city} • {loc.type} • {loc.priceJpy || "¥?"}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {/* Editing Hint */}
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                        Tap cells on desktop to edit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {previewLoc && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewLoc(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewLoc.url}
              alt={previewLoc.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Allow clicking image without closing
            />
            <div className="mt-4 text-white font-medium text-lg drop-shadow-md bg-black/50 px-4 py-2 rounded-full">
              {previewLoc.name}
            </div>
            <button
              onClick={() => setPreviewLoc(null)}
              className="absolute top-4 right-4 md:-right-12 text-white/70 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
