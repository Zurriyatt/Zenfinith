import { Calendar,ArrowRight } from "lucide-react";
export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Top 10 Wardrobe Essentials for Every Season",
      excerpt: "Build a timeless wardrobe with these must-have pieces that never go out of style.",
      date: "Aug 25, 2026",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "How to Choose the Perfect Accessories",
      excerpt: "Accessories can make or break an outfit. Here's how to pick the right ones.",
      date: "Aug 18, 2026",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "The Rise of Sustainable Fashion",
      excerpt: "Why sustainability matters and how you can shop more consciously.",
      date: "Aug 10, 2026",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">Zenfinith Blog</h1>
        <p className="text-lg text-textPrimary/60 max-w-2xl">
          Insights, style guides, and stories from the world of fashion and lifestyle.
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-bgSecondary border border-border rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 text-sm text-textPrimary/50 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-3">{post.title}</h2>
            <p className="text-textPrimary/60 mb-6">{post.excerpt}</p>
            <button className="flex items-center gap-1 text-active font-medium hover:gap-2 transition-all">
              Read More <ArrowRight className="w-4 h-4" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}