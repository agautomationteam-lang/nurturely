import { StoryForm } from "@/components/stories/StoryForm";

export default function StoriesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Bedtime Stories</h1>
        <p className="mt-2 text-text-secondary">A gentle, sleepy story starring your child.</p>
      </div>
      <StoryForm />
    </div>
  );
}
