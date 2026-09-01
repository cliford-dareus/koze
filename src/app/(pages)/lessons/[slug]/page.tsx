import { notFound } from "next/navigation";
import { getLessonBySlug, getNextLesson, getUnit } from "@/data/lessons";
import LessonPlayer from "@/app/(pages)/lessons/_components/lesson-player";

type Props = {
  params: { slug: string };
};

export default function LessonPage({ params }: Props) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) notFound();

  const unit = getUnit(lesson.unitId);
  const next = getNextLesson(lesson.id);

  return (
    <LessonPlayer
      lesson={lesson}
      unitTitle={unit?.title ?? "Lessons"}
      nextSlug={next?.slug}
      nextTitle={next?.title}
    />
  );
}
