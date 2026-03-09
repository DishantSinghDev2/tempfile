// src/app/(dashboard)/dashboard/files/[id]/file-management-client.tsx
"use client";

import { useState } from "react";
import { 
  Lock, 
  FileText, 
  Palette, 
  BarChart3, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  ChevronRight,
  Heart,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import type { File, FileForm, FileCustomization } from "@/lib/db/schema";
import { formatBytes } from "@/lib/utils";

interface Props {
  file: File;
  initialForm: (Omit<FileForm, 'fields'> & { fields: any[] }) | null;
  initialCustomization: FileCustomization | null;
  submissions: any[];
}

export function FileManagementClient({ file, initialForm, initialCustomization, submissions }: Props) {
  const [activeTab, setActiveTab] = useState<"settings" | "form" | "customization" | "analytics">("settings");
  const [loading, setLoading] = useState(false);

  // Settings state
  const [password, setPassword] = useState(file.passwordHash || "");

  // Form state
  const [form, setForm] = useState<{
    enabled: boolean;
    title: string;
    description: string;
    required: boolean;
    showAt: "before" | "after";
    fields: { name: string; label: string; type: string; placeholder: string; required: boolean }[];
  }>({
    enabled: !!initialForm,
    title: initialForm?.title || "Download Details",
    description: initialForm?.description || "Please fill in your details before downloading.",
    required: initialForm?.required || false,
    showAt: (initialForm?.showAt as any) || "before",
    fields: initialForm?.fields || [{ name: "email", label: "Email Address", type: "email", placeholder: "your@email.com", required: true }],
  });

  // Customization state
  const [customization, setCustomization] = useState<{
    enabled: boolean;
    donateButtonUrl: string;
    customText: string;
    backgroundColor: string;
    textColor: string;
  }>({
    enabled: !!initialCustomization,
    donateButtonUrl: initialCustomization?.donateButtonUrl || "",
    customText: initialCustomization?.customText || "",
    backgroundColor: (initialCustomization?.theme as any)?.backgroundColor || "#ffffff",
    textColor: (initialCustomization?.theme as any)?.textColor || "#000000",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files/${file.shareId}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password || null,
          form: form.enabled ? {
            title: form.title,
            description: form.description,
            fields: form.fields,
            required: form.required,
            showAt: form.showAt,
          } : null,
          customization: customization.enabled ? {
            theme: {
              backgroundColor: customization.backgroundColor,
              textColor: customization.textColor,
            },
            donateButtonUrl: customization.donateButtonUrl,
            customText: customization.customText,
          } : null,
        }),
      });

      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    setForm({
      ...form,
      fields: [...form.fields, { name: `field_${form.fields.length + 1}`, label: "New Field", type: "text", placeholder: "", required: false }]
    });
  };

  const removeField = (index: number) => {
    const newFields = [...form.fields];
    newFields.splice(index, 1);
    setForm({ ...form, fields: newFields });
  };

  const updateField = (index: number, updates: any) => {
    const newFields = [...form.fields];
    newFields[index] = { ...newFields[index], ...updates };
    setForm({ ...form, fields: newFields });
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 border border-border rounded-md w-fit bg-muted/5">
        {[
          { id: "settings", icon: Lock, label: "Access" },
          { id: "form", icon: FileText, label: "Form" },
          { id: "customization", icon: Palette, label: "Style" },
          { id: "analytics", icon: BarChart3, label: "Analytics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`h-8 px-4 flex items-center gap-2 text-xs font-mono rounded transition-colors ${
              activeTab === tab.id
                ? "bg-background text-foreground border border-border shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Password Protection</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Require a password to access the file share page. This is the most secure way to share sensitive files.
                </p>
                <div className="relative max-w-sm">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set a password..."
                    className="w-full h-10 pl-9 pr-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Tab */}
          {activeTab === "form" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Downloader Form</h3>
                  <p className="text-xs text-muted-foreground">Ask users for details before or after they download.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Enable</span>
                  <button 
                    onClick={() => setForm({ ...form, enabled: !form.enabled })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${form.enabled ? "bg-foreground" : "bg-muted"}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-background transition-all ${form.enabled ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </div>

              {form.enabled && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Form Title</label>
                      <input 
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Show Form</label>
                      <select 
                        value={form.showAt}
                        onChange={(e) => setForm({ ...form, showAt: e.target.value as any })}
                        className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="before">Before download</option>
                        <option value="after">After download</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Description</label>
                    <textarea 
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full h-20 p-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground">Fields</h4>
                      <button onClick={addField} className="text-[10px] font-mono flex items-center gap-1 hover:text-foreground transition-colors">
                        <Plus className="h-3 w-3" /> Add field
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {form.fields.map((field, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted/5 group relative">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono uppercase text-muted-foreground">Label</label>
                              <input 
                                value={field.label}
                                onChange={(e) => updateField(i, { label: e.target.value })}
                                className="w-full h-8 px-2 text-xs bg-background border border-border rounded focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono uppercase text-muted-foreground">Type</label>
                              <select 
                                value={field.type}
                                onChange={(e) => updateField(i, { type: e.target.value })}
                                className="w-full h-8 px-2 text-xs bg-background border border-border rounded focus:outline-none"
                              >
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="tel">Phone</option>
                                <option value="url">URL</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono uppercase text-muted-foreground">Placeholder</label>
                              <input 
                                value={field.placeholder}
                                onChange={(e) => updateField(i, { placeholder: e.target.value })}
                                className="w-full h-8 px-2 text-xs bg-background border border-border rounded focus:outline-none"
                              />
                            </div>
                          </div>
                          <button onClick={() => removeField(i)} className="mt-5 text-muted-foreground hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customization Tab */}
          {activeTab === "customization" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Page Styling</h3>
                  <p className="text-xs text-muted-foreground">Customize how the download page looks for this file.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">Enable</span>
                  <button 
                    onClick={() => setCustomization({ ...customization, enabled: !customization.enabled })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${customization.enabled ? "bg-foreground" : "bg-muted"}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-background transition-all ${customization.enabled ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </div>

              {customization.enabled && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground border-b border-border pb-2">Colors</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Background</span>
                          <input 
                            type="color" 
                            value={customization.backgroundColor}
                            onChange={(e) => setCustomization({ ...customization, backgroundColor: e.target.value })}
                            className="w-10 h-6 p-0 border-0 bg-transparent cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Text Color</span>
                          <input 
                            type="color" 
                            value={customization.textColor}
                            onChange={(e) => setCustomization({ ...customization, textColor: e.target.value })}
                            className="w-10 h-6 p-0 border-0 bg-transparent cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground border-b border-border pb-2">Donations</h4>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                            <Heart className="h-2 w-2" /> Donate URL (BuyMeACoffee, PayPal, etc)
                          </label>
                          <input 
                            value={customization.donateButtonUrl}
                            onChange={(e) => setCustomization({ ...customization, donateButtonUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Custom Message on page</label>
                    <textarea 
                      value={customization.customText}
                      onChange={(e) => setCustomization({ ...customization, customText: e.target.value })}
                      placeholder="Thank you for downloading!"
                      className="w-full h-20 p-3 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-border rounded-lg bg-muted/5 flex flex-col items-center justify-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total Downloads</span>
                  <span className="font-mono text-3xl font-bold">{file.downloadCount}</span>
                </div>
                <div className="p-6 border border-border rounded-lg bg-muted/5 flex flex-col items-center justify-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Form Submissions</span>
                  <span className="font-mono text-3xl font-bold">{submissions.length}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Form Submissions</h3>
                {submissions.length === 0 ? (
                  <div className="p-10 border border-dashed border-border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground font-mono italic">No submissions yet.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/20 border-b border-border">
                          <th className="text-left px-4 py-3 font-mono uppercase tracking-widest text-muted-foreground">Date</th>
                          {form.fields.map(f => (
                            <th key={f.name} className="text-left px-4 py-3 border-l border-border font-mono uppercase tracking-widest text-muted-foreground">{f.label}</th>
                          ))}
                          <th className="text-left px-4 py-3 border-l border-border font-mono uppercase tracking-widest text-muted-foreground">IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((s, i) => (
                          <tr key={i} className="border-t border-border hover:bg-muted/5 transition-colors">
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {new Date(s.createdAt).toLocaleDateString()}
                            </td>
                            {form.fields.map(f => (
                              <td key={f.name} className="px-4 py-3 border-l border-border font-medium">
                                {s.data[f.name] || "-"}
                              </td>
                            ))}
                            <td className="px-4 py-3 border-l border-border text-muted-foreground font-mono">
                              {s.downloaderIp || "Unknown"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-6">
          <div className="p-6 border border-border rounded-lg bg-background space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
              <ExternalLink className="h-3 w-3" /> Quick Info
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">Size</span>
                <span className="text-xs font-mono">{formatBytes(file.size)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">Type</span>
                <span className="text-xs font-mono truncate max-w-[100px]">{file.mimeType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground font-mono uppercase">Expiry</span>
                <span className="text-xs font-mono">{new Date(file.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="pt-2">
              <a 
                href={`/f/${file.shareId}`} 
                target="_blank" 
                className="w-full h-9 flex items-center justify-center gap-2 text-xs font-mono border border-border rounded-md hover:bg-muted transition-colors"
              >
                View Public Page <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-background space-y-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2 bg-foreground text-background font-mono text-sm rounded-md hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              Changes are live instantly on the share page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
