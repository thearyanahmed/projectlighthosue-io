import type { ViewCourseResponse, ViewLessonResponse } from "./api_response_types";

export type CourseMetadataCount = {
    total_duration: string;
}

export function course_metadata_count(course: ViewCourseResponse): CourseMetadataCount {
    // Calculate total duration in a human-readable format
    const totalDuration = course.lessons.reduce((acc,) => {
        return acc + course.lessons.reduce((lessonAcc, lesson) => {
            const duration = parse_duration(lesson.watch_time || "0:00");
            return lessonAcc + duration;
        }, 0);
    }, 0);

    return {
        total_duration: format_duration(totalDuration)
    };
}

function parse_duration(durationStr: string): number {
    // Expects format "mm:ss" or "h:mm:ss"
    const parts = durationStr.split(":").map(Number);
    if (parts.length === 2) {
        // mm:ss
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
    } else if (parts.length === 3) {
        // h:mm:ss
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
}

function format_duration(totalDuration: number): string {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;

    const parts: string[] = [];
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0 || hours > 0) { // Show minutes if there are hours
        parts.push(`${minutes}m`);
    }
    parts.push(`${seconds}s`);

    return parts.join(" ");
}

export function lesson_duration(lesson: ViewLessonResponse): string {
    if (!lesson.watch_time && !lesson.read_time) return "";

    if (lesson.watch_time) {
        return lesson.watch_time as string
    }

    return lesson.read_time as string
}
