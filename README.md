export default function VisualAIProStudio() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/20 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            VisualAI-pro Studio
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            The Future of AI Creativity
          </p>
        </div>

        <div className="flex gap-4">
          <button className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition">
            Login
          </button>
          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition font-semibold">
            Start Creating
          </button>
        </div>
      </header>

      <main className="relative z-10 px-8 py-16">
        <section className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-sm text-cyan-300">AI Creator Engine</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-black leading-tight">
            Create Insane
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
              AI Prompts
            </span>
          </h2>

          <p className="mt-8 text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Generate cinematic prompts, viral content ideas, thumbnails, ads, reels, stories, image prompts, video prompts and multilingual AI creations with one click.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition text-lg font-bold shadow-2xl shadow-cyan-500/20">
              Launch Studio
            </button>

            <button className="px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition text-lg">
              Watch Demo
            </button>
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Image AI',
            'Video Prompt AI',
            'Viral Reels',
            'YouTube Scripts',
            'Thumbnail Generator',
            'Anime Prompt Mode',
            'Luxury Brand AI',
            'Storytelling Engine',
          ].map((item, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-cyan-500/50 transition overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 mb-5"></div>

                <h3 className="text-xl font-bold">{item}</h3>

                <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                  AI-powered smart generation system for creators, marketers and modern digital studios.
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-5xl font-black leading-tight">
              One Prompt.
              <span className="block text-cyan-400">Infinite Creativity.</span>
            </h3>

            <p className="mt-6 text-gray-300 leading-relaxed text-lg">
              VisualAI-pro Studio transforms simple ideas into cinematic prompts, viral hooks, storytelling scripts, AI visuals and social media content instantly.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Generate prompts in 100+ languages',
                'Monthly AI usage system',
                'Premium cinematic AI styles',
                'Save & export projects',
                'Creator subscription plans',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                  <p className="text-gray-200">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl shadow-purple-500/10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold">AI Prompt Generator</h4>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm">
                LIVE AI
              </span>
            </div>

            <textarea
              placeholder="Describe your idea..."
              className="w-full h-40 rounded-2xl bg-black/40 border border-white/10 p-5 outline-none focus:border-cyan-500 resize-none"
            />

            <div className="grid grid-cols-2 gap-4 mt-5">
              <select className="bg-black/40 border border-white/10 rounded-xl p-3">
                <option>Image AI</option>
                <option>Video AI</option>
                <option>Reels</option>
                <option>YouTube</option>
              </select>

              <select className="bg-black/40 border border-white/10 rounded-xl p-3">
                <option>English</option>
                <option>Hindi</option>
                <option>Bengali</option>
                <option>Japanese</option>
              </select>
            </div>

            <button className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 font-bold text-lg hover:scale-[1.02] transition shadow-xl shadow-cyan-500/20">
              Generate Crazy Prompt
            </button>
          </div>
        </section>

        <section className="mt-32 text-center">
          <h3 className="text-5xl font-black">
            Built For The Next Generation
          </h3>

          <p className="mt-5 text-gray-400 max-w-3xl mx-auto text-lg">
            Creators, editors, filmmakers, AI artists, YouTubers, marketers and agencies can create powerful AI content faster than ever.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Free',
                price: '₹0',
                features: ['5 prompts/day', 'Basic AI styles', 'Limited export'],
              },
              {
                title: 'Creator Pro',
                price: '₹499/mo',
                features: ['Unlimited prompts', 'Premium cinematic AI', 'Multi-language support'],
              },
              {
                title: 'Studio Ultra',
                price: '₹1499/mo',
                features: ['Team features', 'API access', 'Advanced creator tools'],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <h4 className="text-2xl font-bold">{plan.title}</h4>
                <p className="text-5xl font-black mt-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                  {plan.price}
                </p>

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <p key={i} className="text-gray-300">
                      • {feature}
                    </p>
                  ))}
                </div>

                <button className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold hover:scale-105 transition">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
