import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  MessageSquare,
  PhoneCall,
  Search,
  SlidersHorizontal,
  Tag,
} from "lucide-react";
import { BlogPost, SiteSetting } from "../../types/index.js";

interface BlogViewProps {
  settings: SiteSetting;
}

export default function BlogView({ settings }: BlogViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const postParam = searchParams.get("post");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog?published=true");
        if (response.ok) {
          const postList: BlogPost[] = await response.json();
          setPosts(postList);

          if (postParam) {
            const matchingPost = postList.find((post) => post.slug === postParam);
            setActivePost(matchingPost ?? null);
          } else {
            setActivePost(null);
          }
        }
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [postParam]);

  const handleReadPost = (post: BlogPost) => {
    setActivePost(post);
    setSearchParams({ post: post.slug });
  };

  const handleBackToList = () => {
    setActivePost(null);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("post");
    setSearchParams(nextParams);
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
  });

  const renderMarkdownText = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-xl md:text-2xl font-bold text-foreground mt-6 mb-3"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-lg font-bold text-foreground-secondary mt-5 mb-2"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li
            key={index}
            className="list-disc list-inside ml-4 text-foreground-secondary my-1 text-sm leading-relaxed"
          >
            {line.replace(/^[-\*]\s+/, "")}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }
      return (
        <p
          key={index}
          className="text-foreground-secondary text-sm leading-relaxed my-2.5"
        >
          {line}
        </p>
      );
    });
  };

  if (activePost) {
    return (
      <div id="blog-view" className="pt-24 pb-32 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: activePost.title,
              description: activePost.description,
              image: activePost.thumbnail,
              datePublished: activePost.createdAt,
              author: {
                "@type": "Organization",
                name: "VietKey Shop Blog",
                url: "https://vietkey.vn",
              },
            })}
          </script>

          <div className="space-y-6">
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-video shadow-[0_20px_60px_rgba(15,23,42,0.14)] bg-card">
              <img
                src={activePost.thumbnail}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-foreground-muted">
              <span className="min-h-11 inline-flex items-center gap-1.5 rounded-full bg-card px-3 shadow-sm">
                <Calendar className="h-4 w-4 text-[#F97316]" />
                {new Date(activePost.createdAt).toLocaleDateString("en-US")}
              </span>
              <span className="min-h-11 inline-flex items-center gap-1.5 rounded-full bg-card px-3 shadow-sm">
                <Clock className="h-4 w-4 text-[#F97316]" />
                5 min
              </span>
              <span className="min-h-11 inline-flex items-center gap-1.5 rounded-full bg-card px-3 shadow-sm">
                <Tag className="h-4 w-4 text-[#F97316]" />
                SEO
              </span>
            </div>

            <article className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {activePost.title}
              </h1>
              <div className="max-w-none pt-2">
                {renderMarkdownText(activePost.content)}
              </div>
            </article>

            <div className="hidden md:flex bg-card p-6 rounded-3xl text-foreground items-center justify-between gap-4 mt-12 shadow-xl">
              <div>
                <p className="font-bold text-base text-foreground">Need expert help?</p>
                <p className="text-xs text-foreground-secondary mt-1">
                  Talk with VietKey for SEO, landing pages, and conversion design.
                </p>
              </div>
              <div className="flex space-x-2 shrink-0">
                <a
                  href={settings.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-11 px-4 bg-[#05a0eb] hover:bg-[#048ccf] text-white rounded-xl text-xs font-semibold transition duration-200 flex items-center space-x-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Zalo</span>
                </a>
                <a
                  href={`tel:${settings.hotline.replace(/\./g, "")}`}
                  className="min-h-11 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-semibold transition duration-200 flex items-center space-x-1"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-4 bottom-24 z-40 flex justify-end gap-3 md:hidden pointer-events-none">
          <button
            onClick={handleBackToList}
            aria-label="Back to posts"
            className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-slate-950 text-white shadow-xl flex items-center justify-center active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <a
            href={settings.zalo}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-[#F97316] text-white shadow-xl shadow-orange-500/25 flex items-center justify-center active:scale-95"
            aria-label="Open chat"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
          <a
            href={`tel:${settings.hotline.replace(/\./g, "")}`}
            className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-slate-950 text-white shadow-xl flex items-center justify-center active:scale-95"
            aria-label="Call now"
          >
            <PhoneCall className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="blog-view" className="pt-24 pb-32 md:pt-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 md:space-y-12">
          <div className="space-y-4 md:flex md:items-end md:justify-between md:gap-6">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-[#F97316]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#C2410C]">
                Blog
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                Visual Guides
              </h1>
            </div>

            <div className="relative md:w-96">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
              <input
                id="blog-search"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-h-11 w-full rounded-full bg-card pl-11 pr-4 text-sm text-foreground shadow-sm outline-none ring-1 ring-slate-200/70 transition focus:ring-2 focus:ring-[#F97316] dark:ring-slate-800"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-56 rounded-[1.5rem] bg-card shadow-sm animate-pulse"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-[2rem] bg-card py-14 text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">No posts found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => handleReadPost(post)}
                  className="group relative overflow-hidden rounded-[1.5rem] bg-card text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  <span className="absolute right-2 bottom-2 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg shadow-orange-500/30 transition group-hover:scale-110">
                    <ChevronRight className="h-4 w-4" />
                  </span>

                  <div className="aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-h-[6.75rem] p-3 pb-14">
                    <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-foreground-muted">
                      <Calendar className="h-3.5 w-3.5 text-[#F97316]" />
                      <span>{new Date(post.createdAt).toLocaleDateString("en-US")}</span>
                    </div>
                    <h3 className="mobile-card-title font-bold text-sm leading-snug text-foreground transition group-hover:text-[#C2410C]">
                      {post.title}
                    </h3>
                    <p className="hidden">{post.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-4 bottom-24 z-40 flex justify-end gap-3 md:hidden pointer-events-none">
        <button
          type="button"
          className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-slate-950 text-white shadow-xl flex items-center justify-center active:scale-95"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-[#F97316] text-white shadow-xl shadow-orange-500/25 flex items-center justify-center active:scale-95"
          aria-label="Back to top"
        >
          <ChevronRight className="h-4 w-4 rotate-[-90deg]" />
        </button>
      </div>
    </div>
  );
}
