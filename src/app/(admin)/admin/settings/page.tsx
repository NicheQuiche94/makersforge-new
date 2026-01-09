import { createClient } from "@/lib/supabase/server";
import { TagsManager } from "@/components/admin/TagsManager";
import { TasksManager } from "@/components/admin/TasksManager";

export default async function SettingsPage() {
  const supabase = await createClient();

  const [
    { data: candidateTags },
    { data: companyTags },
    { data: tasks }
  ] = await Promise.all([
    supabase.from("tags").select("*").eq("entity_type", "candidate").order("name"),
    supabase.from("tags").select("*").eq("entity_type", "company").order("name"),
    supabase.from("tasks").select("*").order("due_date", { ascending: true }),
  ]);

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white font-heading mb-2">Settings</h1>
      <p className="text-white/60 mb-8">Manage tags, tasks, and CRM configuration.</p>

      <div className="space-y-8">
        {/* Candidate Tags */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Candidate Tags</h2>
          <p className="text-white/60 text-sm mb-6">Tags to categorize and filter candidates.</p>
          <TagsManager 
            tags={candidateTags || []} 
            entityType="candidate" 
          />
        </div>

        {/* Company Tags */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Company Tags</h2>
          <p className="text-white/60 text-sm mb-6">Tags to categorize and filter companies.</p>
          <TagsManager 
            tags={companyTags || []} 
            entityType="company" 
          />
        </div>

        {/* Tasks */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">All Tasks</h2>
          <p className="text-white/60 text-sm mb-6">Manage your reminders and to-dos.</p>
          <TasksManager tasks={tasks || []} />
        </div>
      </div>
    </div>
  );
}