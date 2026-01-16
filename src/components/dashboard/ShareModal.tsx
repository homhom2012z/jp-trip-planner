import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";
import { api } from "@/services/api";
import toast from "react-hot-toast";
import { X, Copy, Share2, Users, Trash2, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  user: User;
  onProfileUpdate: () => Promise<void>;
  isOwner: boolean; // Can only invite if owner
}

export default function ShareModal({
  isOpen,
  onClose,
  profile,
  user,
  onProfileUpdate,
  isOwner,
}: ShareModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"link" | "collaborators">("link");
  const [loading, setLoading] = useState(false);

  // Collaborators State
  const [collaborators, setCollaborators] = useState<
    { email: string; created_at: string }[]
  >([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loadingCollabs, setLoadingCollabs] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === "collaborators" && isOwner) {
      fetchCollaborators();
    }
  }, [isOpen, activeTab, isOwner]);

  const fetchCollaborators = async () => {
    setLoadingCollabs(true);
    try {
      const data = await api.listCollaborators(profile.id);
      setCollaborators(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to list collaborators");
    } finally {
      setLoadingCollabs(false);
    }
  };

  const handleCopyLink = async () => {
    if (!profile.public_slug) return;
    const link = `${window.location.origin}/share/${profile.public_slug}`;
    await navigator.clipboard.writeText(link);
    toast.success(t("linkCopied"));
  };

  const handleEnableShare = async () => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${apiUrl}/api/share/enable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: user.id }), // Only owner handles public link state for now
      });
      if (!res.ok) throw new Error("Failed");
      await onProfileUpdate();
      toast.success("Sharing enabled!");
    } catch (e) {
      toast.error("Failed to enable sharing");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableShare = async () => {
    if (!confirm("Stop sharing? Link will break.")) return;
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${apiUrl}/api/share/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: user.id }),
      });
      if (!res.ok) throw new Error("Failed");
      await onProfileUpdate();
      toast.success("Sharing disabled");
    } catch (e) {
      toast.error("Failed to disable");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setLoading(true);
    try {
      await api.inviteCollaborator(profile.id, inviteEmail);
      toast.success(`${t("invited")} ${inviteEmail}`);
      setInviteEmail("");
      fetchCollaborators();
    } catch (e: any) {
      // api throws with message
      const msg = e.response?.data?.error || e.message || "Failed to invite";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (email: string) => {
    if (!confirm(`Remove ${email}?`)) return;
    try {
      await api.removeCollaborator(profile.id, email);
      toast.success(t("removed"));
      fetchCollaborators();
    } catch (e) {
      toast.error("Failed to remove");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#1b0d12]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            {t("shareTrip")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "link"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            {t("publicLink")}
          </button>
          {isOwner && (
            <button
              onClick={() => setActiveTab("collaborators")}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "collaborators"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t("collaborators")}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "link" ? (
            <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
              <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
                {t("publicLinkDesc")}
              </div>

              {!profile.public_slug ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{t("makePublic")}</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t("makePublicDesc")}
                  </p>
                  <button
                    onClick={handleEnableShare}
                    disabled={loading}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {loading ? t("generating") : t("generateLink")}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("publicLink")}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 truncate font-mono">
                        {window.location.origin}/share/{profile.public_slug}
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {t("linkActive")}
                    </div>
                    <button
                      onClick={handleDisableShare}
                      disabled={loading}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      {t("stopSharing")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="bg-purple-50 p-4 rounded-xl text-sm text-purple-800 border border-purple-100">
                {t("collabDesc")}
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInvite} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="friend@gmail.com"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {t("invite")}
                </button>
              </form>

              {/* List */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("whoHasAccess")}
                </label>

                {loadingCollabs ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    {t("loading")}
                  </div>
                ) : collaborators.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                    {t("noCollaborators")}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                    {collaborators.map((c) => (
                      <div
                        key={c.email}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
                      >
                        <span className="text-sm text-gray-700">{c.email}</span>
                        <button
                          onClick={() => handleRemoveCollaborator(c.email)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
