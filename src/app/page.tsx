import Link from "next/link";
import SkewText from "@/components/SkewText";
import Blueprint from "@/components/Blueprint";
import Scene3D from "@/components/Scene3D";
const steps = [["Upload", "Drop in your existing resume as PDF or DOCX."], ["Paste", "Add the job description you're aiming at."], ["Review", "Check the tailored version, then download PDF or DOCX."]];
export default function Landing() {
  return (
    <main id="main">
      <header className="absolute inset-x-0 top-0 z-40 text-black"><div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:h-20 md:px-12">
        <span className="text-lg font-extrabold tracking-tight">Resume Customizer</span>
        <nav className="flex items-center gap-6"><Link href="/login" className="font-semibold hover:text-brand">Log in</Link><Link href="/login" className="h-display text-xl text-brand hover:text-black">Get started</Link></nav></div></header>
      <section className="grid-light relative min-h-[85vh] overflow-hidden pb-16 pt-28 text-black md:pt-36">
        <Scene3D mode="statue" className="z-30" />
        <div className="relative z-20 mx-auto max-w-[1440px] px-5 md:px-12">
          <h1 className="relative z-0"><span className="sr-only">Bold resumes that fit the job</span>
            <span aria-hidden="true" className="rise block"><SkewText text="TAILOR EVERY" w={1000} /></span>
            <span aria-hidden="true" className="rise -mt-[2%] block w-[70%]" style={{ animationDelay: ".15s" }}><SkewText text="RESUME" w={640} /></span></h1>
          <p className="note mt-6 max-w-md text-lg md:text-2xl">One resume is <span className="wavy">not enough</span>. Rewrite it for each <span className="circled">job</span>.</p>
          <p className="mt-4 max-w-lg text-black/70">AI reorders and rephrases your real experience to match a job description. You review every line before you download.</p>
          <Link href="/login" className="btn mt-8">Tailor my resume</Link>
          <Blueprint className="pointer-events-none absolute bottom-0 right-0 hidden w-[30%] opacity-70 md:block" /></div></section>
      <section className="grid-dark relative overflow-hidden bg-black px-5 py-24 text-white md:px-12"><Scene3D mode="ribbon" /><div className="relative mx-auto max-w-[1440px]">
        <h2 className="h-display text-5xl md:text-7xl">How it works</h2>
        <ol className="mt-8 grid gap-0 border-2 border-white md:grid-cols-3 bg-black/60 backdrop-blur-sm">{steps.map(([t, d], i) => <li key={t} className="border-b-2 border-white p-6 last:border-b-0 md:border-b-0 md:border-r-2 md:last:border-r-0"><span className="h-display text-6xl text-brand">0{i + 1}</span><p className="mt-2 text-xl font-extrabold uppercase">{t}</p><p className="mt-1 text-white/70">{d}</p></li>)}</ol>
        <p className="mt-8 max-w-xl text-sm text-white/60">Your files are stored privately and processed by our server. We can't guarantee interviews or ATS outcomes.</p></div></section>
      <footer className="grid-dark border-t border-white/15 bg-black px-5 pt-16 md:px-12"><div className="mx-auto max-w-[1440px]">
        <p className="h-display text-center text-[clamp(2.6rem,11vw,10rem)]" aria-label="Resume Customizer">RESUME<span aria-hidden="true" className="mx-[.08em] inline-block h-0 w-0 translate-y-[.05em] border-x-[.12em] border-t-[.2em] border-x-transparent border-t-[var(--brand)]" />CUSTOMIZER</p>
        <p className="mt-12 border-t border-white/15 py-6 text-xs text-white/40">© {new Date().getFullYear()} Resume Customizer</p></div></footer>
    </main>);
}
