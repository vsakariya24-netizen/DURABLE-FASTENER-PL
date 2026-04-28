import React, { useState, useEffect, useRef } from "react";

type Review = {
  author_name: string;
  profile_photo_url: string;
  relative_time_description: string;
  rating: number;
  text: string;
  author_url?: string;
};

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5.0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const scrollRef = useRef<HTMLDivElement>(null);

  const GOOGLE_PAGE_URL = "https://search.google.com/local/writereview?placeid=ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Fetching logic
    const CACHE_KEY = "google_reviews_v3";
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000) {
        setReviews(data.reviews);
        setRating(data.rating);
        setTotal(data.total);
        setLoading(false);
        return;
      }
    }

    fetch("https://durablefastener.com/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.reviews) {
          const filtered = data.result.reviews.filter((rev: any) => rev.rating >= 4);
          setReviews(filtered);
          setRating(data.result.rating || 5.0);
          setTotal(data.result.total || 0);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: { reviews: filtered, rating: data.result.rating, total: data.result.total }, timestamp: Date.now() }));
        }
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(0, reviews.length - cardsToShow + 1);

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth / cardsToShow;
      setCurrentSlide(index);
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

  const scroll = (dir: "left" | "right") => {
    let next = dir === "left" ? currentSlide - 1 : currentSlide + 1;
    if (next >= 0 && next < totalSlides) scrollToSlide(next);
  };

  if (loading) return null;

  return (
    <section style={{ padding: "80px 0", backgroundColor: "#fff", fontFamily: "inherit" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", position: "relative" }}>
        
        {/* HEADER BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#000" }}>Excellent</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
              <span style={{ color: "#FBBC05", fontSize: "18px" }}>{"★".repeat(5)}</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Based on <b>{total} reviews</b></span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" style={{ height: "18px", marginLeft: "10px" }} />
            </div>
          </div>
          <a href={GOOGLE_PAGE_URL} target="_blank" rel="noreferrer" style={buttonStyle}>Review us on Google</a>
        </div>

        {/* SLIDER WRAPPER */}
        <div style={{ position: "relative" }}>
          {/* Navigation Arrows */}
          <button onClick={() => scroll("left")} style={{ ...arrowStyle, left: "-25px" }} disabled={currentSlide === 0}>‹</button>
          <button onClick={() => scroll("right")} style={{ ...arrowStyle, right: "-25px" }} disabled={currentSlide >= totalSlides - 1}>›</button>

          {/* Cards Container */}
          <div ref={scrollRef} style={{ display: "flex", gap: "20px", overflow: "hidden", scrollBehavior: "smooth", padding: "10px 0" }}>
            {reviews.map((rev, i) => (
              <div key={i} style={{
                ...cardStyle,
                minWidth: `calc((100% - ${(cardsToShow - 1) * 20}px) / ${cardsToShow})`,
                maxWidth: `calc((100% - ${(cardsToShow - 1) * 20}px) / ${cardsToShow})`,
              }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "15px" }}>
                  <img src={rev.profile_photo_url} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px", color: "#000" }}>{rev.author_name}</div>
                    <div style={{ fontSize: "12px", color: "#777" }}>{rev.relative_time_description}</div>
                  </div>
                </div>
                <div style={{ color: "#FBBC05", fontSize: "14px", marginBottom: "10px" }}>{"★".repeat(rev.rating)}</div>
                <p style={reviewTextStyle}>{rev.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          {Array.from({ length: Math.min(totalSlides, 10) }).map((_, i) => (
            <div key={i} onClick={() => scrollToSlide(i)} style={{
              display: "inline-block", width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: i === currentSlide ? "#000" : "#ccc", margin: "0 4px", cursor: "pointer"
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Styles
const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "20px",
  border: "1px solid #f0f0f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  height: "240px", // Maintains uniform height as seen in image
};

const reviewTextStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#333",
  fontStyle: "italic",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 5, // Matches the truncation in your image
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const arrowStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  border: "1px solid #eee",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  zIndex: 10,
  cursor: "pointer",
  fontSize: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#000"
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  border: "1px solid #000",
  borderRadius: "5px",
  textDecoration: "none",
  color: "#000",
  fontSize: "14px",
  fontWeight: "600"
};
