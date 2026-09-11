import { notFound } from "next/navigation";
import { getLessonBySlug, getNextLesson, getUnit, LessonDirection } from "@/data/lessons";
import LessonPlayer from "@/app/(pages)/lessons/_components/lesson-player";

type Props = {
    params: { slug: string };
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LessonPage({ params, searchParams }: Props) {
    const direction = (await searchParams).direction as string as LessonDirection;
    const lesson = getLessonBySlug(params.slug, direction);
    if (!lesson) notFound();

    const unit = getUnit(lesson.unitId);
    const next = getNextLesson(lesson.id, direction);

    return (
        <LessonPlayer
            lesson={lesson}
            unitTitle={unit?.title ?? "Lessons"}
            nextSlug={next?.slug}
            nextTitle={next?.title}
            direction={direction}
        />
    );
}
