import type { ResumeContent } from "@/lib/types";
const H = ({ children }: { children: React.ReactNode }) => <h2 className="mt-5 mb-1 border-b border-ink/30 text-sm font-semibold tracking-wide">{children}</h2>;
export function ResumePreview({ c }: { c: ResumeContent }) {
  return (
    <article className="mx-auto max-w-[800px] rounded-lg border border-ink/10 bg-white p-6 font-serif text-[15px] leading-relaxed sm:p-10 print:border-0">
      {c.name && <h1 className="text-2xl font-bold">{c.name}</h1>}
      {!!c.contact?.length && <p className="text-sm text-ink/70">{c.contact.join(" | ")}</p>}
      {c.summary && <><H>Summary</H><p>{c.summary}</p></>}
      {!!c.skills?.length && <><H>Skills</H><p>{c.skills.join(", ")}</p></>}
      {!!c.experience?.length && <><H>Experience</H>{c.experience.map((e, i) => (
        <div key={i} className="mb-3"><p className="font-semibold">{[e.title, e.company].filter(Boolean).join(", ")}<span className="ml-2 font-normal text-ink/60">{e.dates}</span></p>
          <ul className="list-disc pl-5">{e.bullets?.map((b, j) => <li key={j}>{b}</li>)}</ul></div>))}</>}
      {!!c.education?.length && <><H>Education</H>{c.education.map((e, i) => <p key={i}>{[e.degree, e.school, e.dates].filter(Boolean).join(", ")}</p>)}</>}
      {!!c.projects?.length && <><H>Projects</H>{c.projects.map((p, i) => <div key={i}><p className="font-semibold">{p.name}</p>{p.description && <p>{p.description}</p>}<ul className="list-disc pl-5">{p.bullets?.map((b, j) => <li key={j}>{b}</li>)}</ul></div>)}</>}
      {!!c.certifications?.length && <><H>Certifications</H><ul className="list-disc pl-5">{c.certifications.map((x, i) => <li key={i}>{x}</li>)}</ul></>}
      {c.additional?.map((s, i) => <div key={i}><H>{s.heading}</H><ul className="list-disc pl-5">{s.items.map((x, j) => <li key={j}>{x}</li>)}</ul></div>)}
    </article>
  );
}
