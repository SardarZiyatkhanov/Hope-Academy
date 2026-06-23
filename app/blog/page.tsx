import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Xaricdə təhsil, viza, bursa və universitetlər haqqında faydalı məqalələr.",
};

export default function BlogPage() {
  return (
    <main>
      <Navbar />

      <PageHero
        badge="Blog"
        title="Faydalı məqalələr və bələdçilər"
        description="Xaricdə oxumaq, viza prosesi, dil sertifikatları və Avropa universitetləri haqqında bilməniz lazım olan hər şey."
      />

      <section className="bg-light py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {BLOG_POSTS.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.08}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-[200px] w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-pill bg-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-blue">
                        <Tag size={10} /> {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock size={10} /> {post.readTime}
                      </span>
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-navy leading-snug">{post.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-gray-500">{post.excerpt}</p>
                    <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-blue transition-all group-hover:gap-3">
                      Oxu <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
