import type { CSSProperties } from "react";

import { cv, type CvFormation, formatMonth } from "@/data/cv";
import { cn } from "@/lib/utils";

const statusLabels: Record<CvFormation["status"], string> = {
    upcoming: "À venir",
    current: "En cours",
    done: "Terminé",
};

/**
 * CV as a bento sheet, in a fixed palette that does not follow the site theme.
 * In print it fills one A4 page, and the data-pdf="city" element only receives the postal
 * address when scripts/cv.ts prints the PDF, so the published page never shows it.
 *
 * @returns The sheet, laid out on one A4 page in print
 */
export function Sheet() {
    const rows = Math.ceil(cv.experiences.length / 2);

    return (
        <article
            aria-label="Curriculum vitæ"
            className="cv-sheet mx-auto grid w-full max-w-[794px] grid-cols-1 gap-2.5 rounded-[28px] bg-white p-3 font-cv-sans text-[13px] leading-[1.48] text-cv-ink shadow-sm ring-1 ring-border sm:p-[26px] wide:grid-cols-6 print:min-h-[297mm] print:w-[210mm] print:max-w-none print:grid-rows-[minmax(156px,auto)_minmax(66px,auto)_auto_1fr_32px] print:rounded-none print:shadow-none print:ring-0"
        >
            <header className="flex flex-col items-start justify-between gap-5 rounded-[22px] bg-cv-ink px-[26px] pt-[22px] pb-5 text-white wide:col-span-4">
                <h1 className="font-cv-display text-[44px] leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-[58px]">
                    {cv.name}
                </h1>
                <span className="rounded-full bg-cv-green px-[13px] py-[5px] text-[13.5px] font-bold text-cv-ink">
                    {cv.title}
                </span>
            </header>

            <div className="flex flex-col justify-between gap-1 rounded-[22px] bg-cv-green px-[22px] pt-[22px] pb-5 wide:col-span-2">
                <a
                    href="https://sylvain.sh"
                    className="font-cv-display text-[27px] leading-none font-extrabold tracking-[-0.02em] transition-colors hover:text-cv-accent"
                >
                    {cv.site}
                </a>
                <address className="flex flex-col gap-px text-[13.5px] font-semibold not-italic">
                    <a
                        href="https://sylvain.sh/me"
                        className="transition-colors hover:text-cv-accent"
                    >
                        {cv.email}
                    </a>
                    <a href={cv.linkedin} className="transition-colors hover:text-cv-accent">
                        {cv.linkedin.replace(/^https?:\/\//, "")}
                    </a>
                    <span data-pdf="city" hidden />
                    <span>{cv.licence}</span>
                </address>
            </div>

            <p className="flex items-center rounded-[22px] bg-cv-blue px-7 py-4 text-[17px] leading-[1.35] font-medium tracking-[-0.005em] wide:col-span-6 print:py-0">
                {cv.summary}
            </p>

            <section className="flex flex-col gap-2.5 rounded-[22px] bg-cv-paper px-[26px] pt-[18px] pb-5 wide:col-span-6">
                <h2 className="font-cv-display text-2xl font-extrabold tracking-[-0.02em]">
                    Expérience
                </h2>
                <div
                    className="grid gap-y-[11px] wide:grid-flow-col wide:grid-cols-2 wide:grid-rows-[repeat(var(--rows),auto)] wide:gap-x-8"
                    style={{ "--rows": rows } as CSSProperties}
                >
                    {cv.experiences.map((experience) => (
                        <div
                            key={`${experience.title}-${experience.start}`}
                            className="flex flex-col gap-[3px]"
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-2.5">
                                <h3 className="font-cv-display text-[16.5px] font-bold tracking-[-0.01em]">
                                    {experience.title}
                                </h3>
                                <span className="whitespace-nowrap text-xs font-semibold text-cv-muted">
                                    {formatMonth(experience.start)} - {formatMonth(experience.end)}
                                </span>
                            </div>
                            {experience.subtitle && (
                                <span className="font-bold text-cv-accent">
                                    {experience.subtitle}
                                </span>
                            )}
                            <p className="text-cv-text">{experience.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col justify-between gap-2.5 rounded-[22px] bg-cv-yellow px-[22px] pt-4 pb-[18px] wide:col-span-4">
                <h2 className="font-cv-display text-2xl font-extrabold tracking-[-0.02em]">
                    Compétences
                </h2>
                <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                    {cv.skills.logos.map((skill) => (
                        <li
                            key={skill.name}
                            className="flex flex-col items-center gap-0.5 rounded-xl bg-white px-0.5 pt-1.5 pb-1"
                        >
                            <img
                                src={skill.icon}
                                alt=""
                                width={20}
                                height={20}
                                className="h-5 w-5"
                            />
                            <span className="text-[10.5px] leading-tight font-bold whitespace-nowrap">
                                {skill.name}
                            </span>
                        </li>
                    ))}
                    <li className="flex">
                        <a
                            href="https://sylvain.sh/tech"
                            className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl bg-cv-ink px-0.5 pt-1.5 pb-1 text-white transition-colors hover:bg-cv-accent"
                        >
                            <span className="font-cv-display text-[15px] leading-5 font-extrabold">
                                +{cv.skills.more}
                            </span>
                            <span className="text-[10.5px] leading-tight font-bold">Voir tout</span>
                        </a>
                    </li>
                </ul>
                <div className="grid gap-y-2.5 sm:grid-cols-2 sm:gap-x-[22px]">
                    {cv.skills.chips.map((column) => (
                        <div key={column[0].label} className="flex flex-col gap-2.5">
                            {column.map((group) => (
                                <div key={group.label} className="flex flex-col gap-[5px]">
                                    <h3 className="font-bold">{group.label}</h3>
                                    <ul className="flex flex-wrap gap-1">
                                        {group.items.map((item) => (
                                            <li
                                                key={item}
                                                className="rounded-full bg-white px-[9px] py-0.5 text-xs font-medium"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex flex-col gap-2.5 wide:col-span-2">
                <section className="flex flex-1 flex-col gap-[9px] rounded-[22px] bg-cv-pink px-5 py-4">
                    <h2 className="font-cv-display text-2xl font-extrabold tracking-[-0.02em]">
                        Formation
                    </h2>
                    {cv.formations.map((formation) => (
                        <div key={formation.title} className="flex flex-col gap-1">
                            <h3 className="font-cv-display text-[15.5px] leading-[1.25] font-bold">
                                {formation.title}
                            </h3>
                            <span className="font-semibold">{formation.school}</span>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                <span className="text-[12.5px] font-semibold">
                                    {formatMonth(formation.start)} - {formatMonth(formation.end)}
                                </span>
                                <span
                                    className={cn(
                                        "rounded-full px-[9px] py-0.5 text-xs font-bold",
                                        formation.status === "current"
                                            ? "bg-cv-ink text-white"
                                            : "bg-white"
                                    )}
                                >
                                    {statusLabels[formation.status]}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>
                <section className="flex flex-col gap-1 rounded-[22px] bg-cv-ink px-[22px] py-[18px] text-white">
                    <h2 className="font-cv-display text-lg font-extrabold tracking-[-0.01em]">
                        Langues
                    </h2>
                    <p className="text-sm font-medium">{cv.languages}</p>
                </section>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[22px] bg-cv-paper px-5 py-2 text-xs font-semibold wide:col-span-6 wide:rounded-full print:py-0">
                <span>
                    {cv.name} &copy; {new Date().getFullYear()}
                </span>
                <div className="flex gap-[18px]">
                    <a
                        href="https://sylvain.sh"
                        className="underline underline-offset-2 transition-colors hover:text-cv-accent"
                    >
                        sylvain.sh
                    </a>
                    <a
                        href="https://sylvain.sh/me"
                        className="underline underline-offset-2 transition-colors hover:text-cv-accent"
                    >
                        sylvain.sh/me
                    </a>
                    <a
                        href={cv.linkedin}
                        className="underline underline-offset-2 transition-colors hover:text-cv-accent"
                    >
                        LinkedIn
                    </a>
                </div>
            </footer>
        </article>
    );
}
