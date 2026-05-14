import { ActivityForm } from "@/components/activities/ActivityForm";

export default function ActivitiesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Activity Generator</h1>
        <p className="mt-2 text-text-secondary">Simple play ideas for the age, time, and place you have.</p>
      </div>
      <ActivityForm />
    </div>
  );
}
