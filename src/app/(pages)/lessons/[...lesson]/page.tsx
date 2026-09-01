import { redirect } from "next/navigation";

type Props = {
  params: { lesson: string[] };
};

/** Legacy `/lessons/lesson-1` style paths → `/lessons/{slug}` */
export default function LegacyLessonCatchAll({ params }: Props) {
  const segment = params.lesson?.[0];
  if (!segment) redirect("/lessons");
  redirect(`/lessons/${segment}`);
}
