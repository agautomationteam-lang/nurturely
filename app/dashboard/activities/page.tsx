import { ActivityForm } from "@/components/activities/ActivityForm";

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-[#fff4e8] p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Play coach</p>
        <h1 className="mt-2 text-3xl font-semibold text-text-primary">Turn “what do we do now?” into three doable ideas.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
          Pick age, time, and location. Nurturely keeps materials common, steps simple, and safety visible.
        </p>
      </div>
      <ActivityForm />
    </div>
  );
}
