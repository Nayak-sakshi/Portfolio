import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import GithubRepos from "@/components/GithubRepos";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Spotlight from "@/components/Spotlight";
import { getContent } from "@/lib/store";
import { getRepos } from "@/lib/github";

// Rebuilt on every admin save (revalidatePath) and at least hourly for fresh GitHub data.
export const revalidate = 3600;

export default async function Home() {
  const content = await getContent();
  const repos = await getRepos(content.profile.github);
  const current = content.experience.find((r) => r.current);
  const hasRepos = repos.length > 0;

  return (
    <>
      <Spotlight />
      <div className="grain" aria-hidden />
      <Nav email={content.profile.email} showGithub={hasRepos} />
      <main>
        <Hero profile={content.profile} />
        <About profile={content.profile} stats={content.stats} education={content.education} now={current?.intro} />
        <Experience experience={content.experience} />
        <Projects projects={content.projects} />
        {hasRepos && <GithubRepos repos={repos} profileUrl={content.profile.github} />}
        <Skills skills={content.skills} index={hasRepos ? "05" : "04"} />
        <Contact profile={content.profile} index={hasRepos ? "06" : "05"} />
      </main>
    </>
  );
}
