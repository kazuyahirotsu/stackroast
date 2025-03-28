import StackForm from "@/components/StackForm";
import { LatestRoasts } from "@/components/LatestRoasts";

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="text-5xl font-bold mb-3">
          <span className="mr-2">🔥</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-500">
            StackRoast
          </span>
        </h1>
        <p className="text-lg opacity-80 max-w-md mx-auto">
          Input your tech stack choices and get a humorous AI critique
        </p>
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
