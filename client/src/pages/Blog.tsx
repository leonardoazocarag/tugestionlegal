import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { SAMPLE_BLOG_POSTS } from "@shared/blogSamples";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, Loader2, Mail, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      toast.success("Te has suscrito correctamente al newsletter");
    },
    onError: () => {
      toast.error("Error al suscribirte. Inténtalo de nuevo.");
    },
  });

  if (subscribed) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <CheckCircle className="w-10 h-10 text-green-500" />
        <p className="text-[#112250] font-semibold">Suscripción confirmada</p>
        <p className="text-gray-600 text-sm">
          Recibirás novedades legales semanales. En tu primera asesoría o trámite, indica que estás suscrito para aplicar el 10% de descuento.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        subscribe.mutate({ email, name: name || undefined });
      }}
      className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
    >
      <input
        type="text"
        placeholder="Tu nombre (opcional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C19D4E]/50 text-sm"
      />
      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C19D4E]/50 text-sm"
      />
      <Button
        type="submit"
        disabled={subscribe.isPending}
        className="bg-[#C19D4E] hover:bg-[#a8873f] text-white px-6"
      >
        {subscribe.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Suscribirme"}
      </Button>
    </form>
  );
}

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.published.useQuery();
  const displayPosts = posts && posts.length > 0 ? posts : SAMPLE_BLOG_POSTS;

  return (
    <>
      <section className="bg-[#112250] text-white py-20">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.span variants={fadeUp} className="text-[#C19D4E] text-sm font-semibold uppercase tracking-wider">Blog</motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-bold mt-3 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Noticias y Artículos
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/80 text-lg leading-relaxed">
              Mantente informado sobre las últimas novedades en extranjería, nacionalidad y gestiones administrativas.
              Publicamos contenido útil y actualizado para ayudarte en tus trámites.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#F5F0E9]">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C19D4E]" />
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.map((post) => (
                <motion.div key={post.id} variants={fadeUp}>
                  <Link href={`/blog/${post.slug}`}>
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer">
                    <CardContent className="p-0">
                      {post.imageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-[#112250] to-[#112250]/70 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-[#C19D4E]/40" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {post.category && (
                            <span className="text-xs font-semibold text-[#C19D4E] uppercase tracking-wider">{post.category}</span>
                          )}
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0A1635] mb-2 group-hover:text-[#C19D4E] transition-colors line-clamp-2" style={{ fontFamily: "var(--font-heading)" }}>
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        <div className="mt-4 flex items-center text-sm text-[#C19D4E] font-medium">
                          Leer más <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Mail className="w-12 h-12 text-[#C19D4E] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#112250] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Suscríbete y obtén un 10% de descuento
            </h2>
            <p className="text-gray-600 mb-6">
              Únete al newsletter semanal de Tu Gestión Legal: novedades legales, sentencias relevantes y consejos prácticos.
              Además, disfruta de un <strong className="text-[#112250]">10% de descuento</strong> en tu primera asesoría o trámite.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#112250] text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>¿Tienes una consulta específica?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Si no encuentras la respuesta en nuestro blog, reserva una asesoría y resolveremos todas tus dudas.
          </p>
          <Link href="/reservas">
            <Button size="lg" className="bg-[#C19D4E] hover:bg-[#a8873f] text-white">
              Reservar Asesoría
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
