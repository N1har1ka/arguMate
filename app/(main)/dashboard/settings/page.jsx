"use client";

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseclient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileRowId, setProfileRowId] = useState(null); // DB row id
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    try {
      // try to find user row by email
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user?.email)
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 can appear when single() finds no rows
        console.error("Supabase select Users error:", error);
        toast.error("Failed to load profile");
        setLoading(false);
        return;
      }

      if (data) {
        setProfileRowId(data.id ?? null);
        setName(data.name ?? "");
        setEmail(data.email ?? user?.email ?? "");
      } else {
        // no Users row found — pre-fill from auth user if available
        setName(user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "");
        setEmail(user?.email ?? "");
      }
    } catch (e) {
      console.error("fetchProfile:", e);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const validateEmail = (value) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  async function onSave(e) {
    e?.preventDefault?.();
    if (!name?.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setSaving(true);
    try {
      if (profileRowId) {
        const { data, error } = await supabase
          .from("Users")
          .update({ name: name.trim(), email: email.trim() })
          .eq("id", profileRowId)
          .select()
          .single();

        if (error) throw error;
        toast.success("Profile updated");
      } else {
        // create a new Users row for this auth user
        const { data, error } = await supabase
          .from("Users")
          .insert([{ name: name.trim(), email: email.trim() }])
          .select()
          .single();

        if (error) throw error;
        setProfileRowId(data.id);
        toast.success("Profile created");
      }

      // OPTIONAL: update Supabase Auth email (only if you want to)
      // NOTE: changing auth email requires confirmation and may need elevated privileges.
      // If you want to update auth user email programmatically:
      // await supabase.auth.updateUser({ email: email.trim() })

    } catch (err) {
      console.error("save profile error:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-950 text-gray-100" : "bg-indigo-50 text-gray-900"}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Update your profile (name & email)</p>

        <div className={`${isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"} rounded-xl p-6 shadow-sm`}>
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2Icon className="animate-spin" />
              <span>Loading profile…</span>
            </div>
          ) : (
            <form onSubmit={onSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={isDark ? "bg-gray-800 text-gray-100" : ""}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={isDark ? "bg-gray-800 text-gray-100" : ""}
                />
                <p className="mt-1 text-xs text-gray-400">We only use this to send notifications (if enabled).</p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? <span className="flex items-center gap-2"><Loader2Icon className="animate-spin" /> Saving</span> : "Save changes"}
                </Button>

                <button
                  type="button"
                  className={`text-sm px-3 py-2 rounded-md ${isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900"}`}
                  onClick={() => {
                    // reset to last fetched values
                    fetchProfile();
                    toast("Reverted");
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4">Only name and email can be changed here.</p>
      </div>
    </div>
  );
}
