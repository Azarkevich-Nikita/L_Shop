import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Banner } from "../../types/api";

function Home() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadBanners = async () => {
      try {
        const res = await fetch("/api/banners");
        if (res.ok) {
          const data = await res.json() as Banner[];
          if (!cancelled && Array.isArray(data)) {
            setBanners(data);
          }
        }
      } catch {
        // баннеры опциональны
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBanners();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <span>Загрузка...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Главная</h1>
      {banners.length > 0 && (
        <section className="home-banners" style={{ marginTop: "1rem" }}>
          {banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.link || "#"}
              onClick={(e) => {
                if (banner.link && banner.link.startsWith("/")) {
                  e.preventDefault();
                  navigate(banner.link);
                }
              }}
              style={{ display: "block", marginBottom: "1rem" }}
            >
              <img
                src={banner.image_url}
                alt={banner.title || `Баннер ${banner.id}`}
                style={{
                  width: "100%",
                  maxWidth: 1200,
                  height: "auto",
                  display: "block",
                  borderRadius: 8,
                }}
              />
              {banner.title && (
                <span style={{ display: "block", marginTop: "0.25rem", fontWeight: 600 }}>
                  {banner.title}
                </span>
              )}
            </a>
          ))}
        </section>
      )}
    </div>
  );
}

export default Home;
