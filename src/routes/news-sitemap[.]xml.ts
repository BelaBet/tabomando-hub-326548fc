import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fetchMaterias } from "@/lib/data";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";
const MAX_AGE_DAYS = 2;

export const Route = createFileRoute("/news-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let materias: Awaited<ReturnType<typeof fetchMaterias>> = [];
        try {
          materias = await fetchMaterias();
        } catch (e) {
          console.error("news-sitemap: failed to fetch matérias", e);
        }
        const now = Date.now();
        const recentes = materias.filter(
          (m) => (now - new Date(m.publicadoEm).getTime()) / 86400000 <= MAX_AGE_DAYS * 30,
        );


        const urls = recentes.map((m) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}/materia/${m.slug}</loc>`,
            `    <news:news>`,
            `      <news:publication>`,
            `        <news:name>Tá Sabendo?</news:name>`,
            `        <news:language>pt-BR</news:language>`,
            `      </news:publication>`,
            `      <news:publication_date>${m.publicadoEm}</news:publication_date>`,
            `      <news:title><![CDATA[${m.titulo}]]></news:title>`,
            `    </news:news>`,
            `  </url>`,
          ].join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=600" },
        });
      },
    },
  },
});
