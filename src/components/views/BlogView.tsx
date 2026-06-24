import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock,
  Tag,
  Calendar,
  User,
  ArrowLeft,
  Search,
  BookOpen,
  ChevronRight,
  MessageSquare,
  PhoneCall,
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

  // Bài viết đang đọc chi tiết
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const postParam = searchParams.get("post");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog?published=true");
        if (res.ok) {
          const list: BlogPost[] = await res.json();
          setPosts(list);

          // Nếu URL có tham số ?post=slug, mở bài viết đó lên
          if (postParam) {
            const postObj = list.find((p) => p.slug === postParam);
            if (postObj) setActivePost(postObj);
          } else {
            setActivePost(null);
          }
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách blog:", err);
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
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("post");
    setSearchParams(newParams);
  };

  // Lọc bài viết
  const filteredPosts = posts.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Render HTML giả lập hoặc thô cho Markdown
  const renderMarkdownText = (text: string) => {
    // Parser đơn giản cho headings và lists
    return text.split("\n").map((line, idx) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-xl md:text-2xl font-bold text-foreground mt-6 mb-3"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-lg font-bold text-foreground-secondary mt-5 mb-2"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li
            key={idx}
            className="list-disc list-inside ml-4 text-foreground-secondary my-1 text-sm leading-relaxed"
          >
            {line.replace(/^[-\*]\s+/, "")}
          </li>
        );
      }
      if (line.startsWith("=¡ ")) {
        return (
          <div
            key={idx}
            className="my-5 p-4 bg-background-secondary rounded-xl border-l-4 border-primary text-foreground-secondary text-sm leading-relaxed font-medium"
          >
            {line}
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p
          key={idx}
          className="text-foreground-secondary text-sm leading-relaxed my-2.5"
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div id="blog-view" className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==============================================
            CHẾ ĐỘ 1: ĐỌC CHI TIẾT BÀI VIẾT (READER VIEW)
           ============================================== */}
        {activePost ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
            {/* Dynamic JSON-LD SEO Schema simulation inside the reader markup */}
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

            {/* Back CTA Button */}
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-background-secondary border border-border text-foreground-secondary hover:text-foreground rounded-xl text-xs font-bold transition duration-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách bài viết</span>
            </button>

            {/* Post Cover image */}
            <div className="rounded-3xl overflow-hidden aspect-video border border-border shadow-md">
              <img
                src={activePost.thumbnail}
                alt={activePost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Metadata tags */}
            <div className="flex flex-wrap gap-4 items-center text-xs text-foreground-muted border-b border-border pb-5">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {new Date(activePost.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-primary" />
                <span>5 phút đọc</span>
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="bg-badge-bg text-badge-text border border-border px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                  SEO MARKETING
                </span>
              </span>
            </div>

            {/* Content body */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {activePost.title}
              </h1>
              <div className="max-w-none pt-4">
                {renderMarkdownText(activePost.content)}
              </div>
            </div>

            {/* Floating Contact Lead box in bottom of the reader */}
            <div className="bg-card p-6 rounded-3xl border border-border text-foreground flex flex-col md:flex-row items-center justify-between gap-4 mt-12 shadow-xl">
              <div>
                <p className="font-bold text-base text-foreground">
                  Cần tối ưu SEO hoặc tự thiết kế mẫu?
                </p>
                <p className="text-xs text-foreground-secondary mt-1">
                  Đội ngũ kỹ thuật VietKey hân hạnh đem đến website có điểm số
                  tối đa.
                </p>
              </div>
              <div className="flex space-x-2 shrink-0">
                <a
                  href={settings.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#05a0eb] hover:bg-[#048ccf] text-white rounded-xl text-xs font-semibold transition duration-200 flex items-center space-x-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Zalo</span>
                </a>
                <a
                  href={`tel:${settings.hotline.replace(/\./g, "")}`}
                  className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold transition duration-200 flex items-center space-x-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Gọi {settings.hotline}</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ==============================================
              CHẾ ĐỘ 2: DANH SÁCH BÀI VIẾT (LIST VIEW)
             ============================================== */
          <div className="space-y-12">
            {/* Search and Headers */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-border pb-8">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight animate-fade-in">
                  Kinh Nghiệm SEO & Marketing
                </h1>
                <p className="text-foreground-secondary text-sm max-w-xl">
                  Góc chia sẻ kiến thức thiết kế Landing Page, kỹ thuật tối ưu
                  on-page để đứng vững vị trí cao trên công cụ tìm kiếm Google.
                </p>
              </div>

              {/* Search blog box */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-foreground-muted" />
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Tìm kiếm bài viết kinh nghiệm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-3xl h-80 border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-background-secondary rounded-2xl border border-dashed border-border">
                <BookOpen className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground">
                  Không tìm thấy bài viết nào
                </h3>
                <p className="text-foreground-secondary mt-1">
                  Vui lòng quay lại sau hoặc thử từ khóa tìm kiếm khác.
                </p>
              </div>
            ) : (
              /* Blog Posts Grid list */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleReadPost(post)}
                    className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-primary/50 transition duration-300 flex flex-col md:flex-row group cursor-pointer"
                  >
                    {/* Cover visual left inside (40% width in desktop) */}
                    <div className="md:w-2/5 h-48 md:h-full overflow-hidden bg-[#e2e8f0] dark:bg-[#1e293b] relative shrink-0">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* Content text right (60% width) */}
                    <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Time tag */}
                        <div className="flex items-center space-x-2 text-xs text-foreground-muted font-medium">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition duration-200 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-foreground-secondary text-xs leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      {/* Read Link */}
                      <div className="flex items-center space-x-1 text-primary hover:text-primary-hover text-xs font-bold uppercase tracking-wider transition duration-200">
                        <span>Đọc kinh nghiệm</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
