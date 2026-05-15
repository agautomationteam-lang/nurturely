import { StoryForm } from "@/components/stories/StoryForm";
import { requireAppUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function StoriesPage() {
  const user = await requireAppUser();
  const recentStories = await prisma.story.findMany({
    where: { userId: user.clerkUserId },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, childName: true, theme: true, content: true, createdAt: true }
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] bg-primary p-6 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">Bedtime reset</p>
        <h1 className="mt-2 text-3xl font-semibold">A story that helps bedtime feel safe and slow.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
          Add your child&apos;s name, age, and favorite world. Nurturely writes a gentle 2-3 minute story with no scary turns and no cliffhanger.
        </p>
      </div>
      <StoryForm recentStories={recentStories.map((story) => ({ ...story, createdAt: story.createdAt.toISOString() }))} />
    </div>
  );
}
