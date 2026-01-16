import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  // const { t } = useLanguage(); // Unused for now
  const [step, setStep] = useState<"input" | "preview" | "batch-result">(
    "input"
  );
  const [searchMode, setSearchMode] = useState<"name" | "link" | "batch">(
    "name"
  );
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [url, setUrl] = useState("");
  const [batchUrls, setBatchUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<{
    added: number;
    errors: any[];
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewData, setPreviewData] = useState<any>(null);

  if (!isOpen) return null;

  const handlePreview = async () => {
    if (searchMode === "name" && (!name || !city)) {
      toast.error("Please enter specific name and city");
      return;
    }
    if (searchMode === "link" && !url) {
      toast.error("Please paste a Google Maps link");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (searchMode === "link") {
        data = await api.previewLocation(undefined, undefined, url);
      } else {
        data = await api.previewLocation(name, city);
      }

      if (!data) {
        toast.error("Location not found");
      } else {
        setPreviewData(data);
        if (searchMode === "link" && data.name) {
          setName(data.name);
          // City might not be in data, but we can leave it or try to parse?
          // For now, let's leave city as is (user might need to fill it if we can't get it).
          // Actually, `data` from backend only has `name` now.
        }
        setStep("preview");
      }
    } catch {
      toast.error("Failed to find location");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await api.addLocation(name, city, previewData);
      toast.success("Location added to Sheet!");
      onSuccess();
      onClose();
      // Reset state suitable for next use
      setStep("input");
      setName("");
      setCity("");
      setPreviewData(null);
    } catch {
      toast.error("Failed to add location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Add New Location</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === "input" && (
            <div className="space-y-4">
              {/* Tabs for Search Mode */}
              {/* Tabs for Search Mode */}
              <div className="flex p-1 bg-gray-100 rounded-xl mb-4">
                <button
                  onClick={() => setSearchMode("name")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    searchMode === "name"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Name
                </button>
                <button
                  onClick={() => setSearchMode("link")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    searchMode === "link"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Link
                </button>
                <button
                  onClick={() => setSearchMode("batch")}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    searchMode === "batch"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Batch
                </button>
              </div>

              {searchMode === "name" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Starbucks at Shibuya Crossing"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 bg-white"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Tokyo"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 bg-white"
                    />
                  </div>
                </>
              )}

              {searchMode === "link" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste link here (e.g. maps.app.goo.gl/...)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 bg-white"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supports short links from the Google Maps app share button.
                  </p>
                </div>
              )}

              {searchMode === "batch" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Links (Max 20)
                  </label>
                  <textarea
                    value={batchUrls}
                    onChange={(e) => setBatchUrls(e.target.value)}
                    placeholder={`https://maps.app.goo.gl/...\nhttps://maps.google.com/...`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 bg-white min-h-[150px] font-mono text-xs"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Paste multiple links, one per line. Limit 20 at a time.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "preview" && previewData && (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {previewData.photoUrl ? (
                  <img
                    src={previewData.photoUrl}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined">
                      image_not_supported
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {previewData.name || name}
                  </h4>
                  <div className="text-sm text-gray-500 mb-2 truncate">
                    {city || "Japan"}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {previewData.type && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                        {previewData.type}
                      </span>
                    )}
                    {previewData.priceLevel && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {previewData.priceLevel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {previewData.summary && (
                <div className="text-sm text-gray-600 italic bg-amber-50 p-3 rounded-lg border border-amber-100">
                  &quot;{previewData.summary}&quot;
                </div>
              )}

              <p className="text-xs text-center text-gray-500">
                Correct location? Click Add to save to your Sheet.
              </p>
            </div>
          )}

          {step === "batch-result" && batchResult && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                <div className="font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  Success
                </div>
                <div className="text-sm mt-1">
                  Added {batchResult.added} locations successfully.
                </div>
              </div>
              {batchResult.errors.length > 0 && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 max-h-[150px] overflow-auto">
                  <div className="font-bold text-sm mb-2">Failed URLs:</div>
                  {batchResult.errors.map((err: any, i: number) => (
                    <div key={i} className="text-xs font-mono mb-1 truncate">
                      {err.url} ({err.error})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3 text-right bg-white">
          {(step === "preview" || step === "batch-result") && (
            <button
              onClick={() => {
                if (step === "batch-result") {
                  onSuccess();
                  onClose();
                } else {
                  setStep("input");
                }
              }}
              disabled={loading && step !== "batch-result"}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
            >
              {step === "batch-result" ? "Close" : "Back"}
            </button>
          )}

          {step !== "batch-result" && (
            <button
              onClick={async () => {
                if (step === "input") {
                  if (searchMode === "batch") {
                    if (!batchUrls.trim()) {
                      toast.error("Please enter URLS");
                      return;
                    }
                    const urls = batchUrls.split("\n").filter((u) => u.trim());
                    if (urls.length === 0) return;

                    setLoading(true);
                    try {
                      const res = await api.batchAddLocations(urls);
                      setBatchResult(res);
                      setStep("batch-result");
                      toast.success(`Processed ${urls.length} links`);
                    } catch (e) {
                      toast.error("Batch failed");
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    handlePreview();
                  }
                } else {
                  handleAdd();
                }
              }}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-lg">
                  refresh
                </span>
              )}
              {step === "input"
                ? searchMode === "batch"
                  ? "Process Batch"
                  : "Preview Location"
                : "Add to Trip"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
