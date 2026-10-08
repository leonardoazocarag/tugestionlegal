import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getSamplePostBySlug } from "@shared/blogSamples";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
        <Share2 className="w-4 h-4" /> Compartir:
      </span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
        title="Compartir en WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
        title="Compartir en Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
        title="Compartir en LinkedIn"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
    </div>
  );
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = useMemo(() => {
    const raw = params?.slug || "";
    try {
      return decodeURIComponent(raw).trim();
    } catch {
      return raw.trim();
    }
  }, [params?.slug]);
  const { data: dbPost, isLoading } = trpc.blog.bySlug.useQuery({ slug }, { enabled: !!slug });
  const post = dbPost ?? getSamplePostBySlug(slug) ?? null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C19D4E]" />
      </div>
    );
  }

  if (!post) {
    return (
      <section className="py-20 bg-[#F5F0E9]">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-[#112250] mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
          <Link href="/blog">
            <Button className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Blog
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero with image */}
      <section className="relative">
        {post.imageUrl ? (
          <div className="h-[320px] md:h-[450px] relative overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#112250]/95 via-[#112250]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="container max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  {post.category && (
                    <span className="text-xs font-bold text-[#C19D4E] bg-[#C19D4E]/15 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#C19D4E]/30">{post.category}</span>
                  )}
                  <span className="text-xs text-white/70 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {post.title}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#112250] py-20">
            <div className="container max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                {post.category && (
                  <span className="text-xs font-bold text-[#C19D4E] uppercase tracking-widest">{post.category}</span>
                )}
                <span className="text-xs text-white/70 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {post.title}
              </h1>
            </div>
          </div>
        )}
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-[#F5F0E9]">
        <div className="container">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {/* Top bar: back + share */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#C19D4E]/20">
              <Link href="/blog">
                <button className="flex items-center text-sm text-[#C19D4E] hover:text-[#a8873f] font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Blog
                </button>
              </Link>
              <ShareButtons title={post.title} url={currentUrl} />
            </div>

            {/* Article body - editorial styling */}
            <div
              className="article-content
                prose prose-lg max-w-none
                prose-headings:text-[#112250] prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4
                prose-h2:text-2xl prose-h2:border-b prose-h2:border-[#C19D4E]/20 prose-h2:pb-3
                prose-h3:text-xl
                prose-p:text-gray-700 prose-p:leading-[1.9] prose-p:mb-6 prose-p:text-justify
                prose-a:text-[#C19D4E] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-l-[#C19D4E] prose-blockquote:bg-white prose-blockquote:py-5 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:shadow-sm prose-blockquote:my-8
                prose-strong:text-[#112250] prose-strong:font-semibold
                prose-ul:my-6 prose-ul:space-y-2
                prose-li:text-gray-700 prose-li:leading-relaxed
                prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                [&_.source]:text-sm [&_.source]:text-gray-500 [&_.source]:border-t-2 [&_.source]:border-[#C19D4E]/20 [&_.source]:pt-6 [&_.source]:mt-10 [&_.source]:font-medium
                [&_p:first-of-type]:text-lg [&_p:first-of-type]:font-medium [&_p:first-of-type]:text-gray-800 [&_p:first-of-type]:leading-[1.8]
                [&_p+p]:mt-0"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Bottom share */}
            <div className="mt-10 pt-6 border-t border-[#C19D4E]/20 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Publicado el {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <ShareButtons title={post.title} url={currentUrl} />
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 md:p-10 bg-[#112250] rounded-2xl text-center shadow-xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                ¿Necesitas asesoría sobre este tema?
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Contacta con nosotros y te ayudamos con tu caso particular. Primera consulta sin compromiso.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/reservas">
                  <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
                    Reservar Asesoría
                  </Button>
                </Link>
                <a href="https://wa.me/34614002510" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </>
  );
}
