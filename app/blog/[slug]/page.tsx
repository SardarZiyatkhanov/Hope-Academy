import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main>
      <Navbar />

      {/* Article hero */}
      <section className="relative overflow-hidden bg-navy pb-0 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white/80">{post.category}</span>
          </nav>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-pill bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80">
              <Tag size={10} /> {post.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-white/40">
              <Clock size={10} /> {post.readTime}
            </span>
            <span className="text-[11px] text-white/40">{post.date}</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-white/60">{post.excerpt}</p>
        </div>

        {/* Hero image banner */}
        <div className="relative z-10 mx-auto mt-10 max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative h-[240px] w-full overflow-hidden rounded-t-xl sm:h-[320px]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy">
            <ArrowLeft size={14} /> Bloga qayıt
          </Link>
          <div className="prose prose-sm sm:prose max-w-none text-gray-600">
            {post.content.map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h2 className="mt-8 text-lg font-semibold text-navy sm:text-xl">{block.heading}</h2>
                )}
                <p className={`${block.heading ? "mt-2" : "mt-0"} text-gray-600 leading-relaxed`}>
                  {block.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA inline */}
          <div className="mt-12 rounded-card bg-gradient-to-br from-navy to-blue p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Hope Academy</p>
            <h3 className="mt-2 text-xl font-bold text-white">
              Xaricdə oxumaq istəyirsiniz?
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Pulsuz konsultasiya üçün müraciət formunu doldurun — məsləhətçimiz 24 saat ərzində sizinlə əlaqə saxlayacaq.
            </p>
            <div className="mt-4">
              <Link href="/#apply">
                <Button variant="primary">Pulsuz məsləhət al <ArrowRight size={15} /></Button>
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-navy">Digər məqalələr</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group rounded-card border border-gray-100 p-4 transition-all hover:border-blue/30 hover:shadow-md"
                  >
                    <span className="text-[11px] font-medium text-blue">{r.category}</span>
                    <p className="mt-1 text-sm font-semibold text-navy group-hover:text-blue">{r.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
