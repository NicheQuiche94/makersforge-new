import { Users, Building2, MessageSquare, Phone, Mail, Calendar, GitBranch } from "lucide-react";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: any;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ACTIVITY_ICONS: Record<string, any> = {
  note: MessageSquare,
  call: Phone,
  email: Mail,
  meeting: Calendar,
  status_change: GitBranch,
  created: Building2,
  updated: Building2,
  added_to_process: Users,
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-white/40 text-sm text-center py-4">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = ACTIVITY_ICONS[activity.activity_type] || MessageSquare;
        
        return (
          <div key={activity.id} className="flex gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white/60" />
              </div>
              {index < activities.length - 1 && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-white/10" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-white/80 text-sm">{activity.description}</p>
              <p className="text-white/40 text-xs mt-1">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}