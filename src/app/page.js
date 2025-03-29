import StackForm from "@/components/StackForm";
import { LatestRoasts } from "@/components/LatestRoasts";

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <a href="/" className="flex items-center justify-center gap-2">
            <span className="text-4xl">🔥</span>
            <span className="font-bold text-4xl fire-gradient">RoastMyStack</span>
          </a>
        </h1>
        <p className="text-xl mb-8">Get your tech stack brutally roasted by AI</p>
      </section>
      
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Your Tech Stack</h2>
          <p className="text-sm opacity-70 mb-4">
            Tell us what technologies you're using, and our AI will roast your choices
          </p>
          <StackForm />
        </div>
      </div>
      
      {/* Recent roasts section */}
      <LatestRoasts />
    </div>
  );
}
