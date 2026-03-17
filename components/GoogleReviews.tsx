import React, { useState, useEffect, useRef } from "react";

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(4.9);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Link to your Google Business Profile for "Read more" and "Review us"
  const GOOGLE_PAGE_URL = "https://search.google.com/local/writereview?placeid=ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

useEffect(() => {
  const CACHE_KEY = "google_reviews_cache";
  const CACHE_TIME = 6 * 60 * 60 * 1000; // 6 hours

  const cached = localStorage.getItem(CACHE_KEY);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);

    if (Date.now() - timestamp < CACHE_TIME) {
      setReviews(data.reviews);
      setRating(data.rating);
      setLoading(false);
      return; // ✅ API call skip
    }
  }

  const isLocal = window.location.hostname === "localhost";

  const API_URL = isLocal
    ? "http://localhost:5000/api/reviews"
  : "https://supabase-proxy-dfpl.vsakariya24.workers.dev";  
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.result) {
        const reviewData = {
          reviews: data.result.reviews || [],
          rating: data.result.rating || 4.9,
        };

        setReviews(reviewData.reviews);
        setRating(reviewData.rating);

        // ✅ Save cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: reviewData,
            timestamp: Date.now(),
          })
        );
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scrolls one full page width
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const renderStars = (count: number) => "★".repeat(Math.round(count));

  if (loading) return <p style={{ textAlign: "center", padding: "100px", color: "#666" }}>Loading Classone Reviews...</p>;

  return (
    <section style={{ backgroundColor: "#fdfdfd", padding: "80px 0", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* --- 1. SECTION MAIN TITLE --- */}
        <h2 style={{ 
          textAlign: "center", 
          fontSize: "36px", 
          fontWeight: "800", 
          color: "#1a1a1a", 
          marginBottom: "10px" 
        }}>
          What Our Customers Say
        </h2>
        

        {/* --- 2. GOOGLE HEADER BAR --- */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-end", 
          marginBottom: "30px",
          borderBottom: "1px solid #eee",
          paddingBottom: "20px"
        }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
              <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span> <span style={{ color: "#555" }}>Reviews</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
              <span style={{ fontWeight: "800", fontSize: "22px", color: "#222" }}>{rating}</span>
              <span style={{ color: "#FBBC05", fontSize: "20px" }}>{renderStars(5)}</span>
              <span style={{ color: "#999", fontSize: "13px" }}>(Verified)</span>
            </div>
          </div>
          <a 
            href={GOOGLE_PAGE_URL}
            target="_blank"
            rel="noreferrer"
            style={reviewButtonStyle}
          >
            Review us on Google
          </a>
        </div>

        {/* --- 3. MULTI-CARD SLIDER --- */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          
          <button onClick={() => scroll("left")} style={{ ...navButtonStyle, left: "-20px" }}>‹</button>

          <div 
            ref={scrollRef}
            style={{ 
              display: "flex", 
              gap: "25px", 
              overflowX: "hidden", 
              scrollBehavior: "smooth",
              padding: "15px 5px"
            }}
          >
            {reviews.map((review: any, index: number) => (
              <div key={index} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <img 
                      src={review.profile_photo_url} 
                      alt="" 
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=random&color=fff`; }}
                      style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>{review.author_name}</div>
                      <div style={{ fontSize: "12px", color: "#999" }}>{review.relative_time_description}</div>
                    </div>
                  </div>
                  <span style={{ color: "#4285F4", fontSize: "16px" }}>✔</span>
                </div>

                <div style={{ color: "#FBBC05", fontSize: "15px", marginBottom: "12px" }}>{renderStars(5)}</div>
                
                <p style={textStyle}>{review.text}</p>
                
                <a 
                  href={review.author_url || GOOGLE_PAGE_URL} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: "#1a73e8", fontSize: "13px", textDecoration: "none", fontWeight: "bold", marginTop: "auto" }}
                >
                  Read more
                </a>
              </div>
            ))}
          </div>

          <button onClick={() => scroll("right")} style={{ ...navButtonStyle, right: "-20px" }}>›</button>
        </div>

        {/* --- 4. PAGINATION DOTS --- */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <span style={{ color: "#333", fontSize: "24px", cursor: "pointer" }}>•</span>
          <span style={{ color: "#ddd", fontSize: "24px", marginLeft: "8px", cursor: "pointer" }}>• •</span>
        </div>

      </div>
    </section>
  );
}

// --- CSS STYLES ---
const cardStyle: React.CSSProperties = {
  minWidth: "280px", 
  maxWidth: "280px",
  backgroundColor: "#fff",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  border: "1px solid #f0f0f0",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
};

const textStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#444",
  height: "95px",
  overflow: "hidden",
  marginBottom: "15px",
  display: "-webkit-box",
  WebkitLineClamp: 4,
  WebkitBoxOrient: "vertical",
  fontStyle: "italic"
};

const navButtonStyle: React.CSSProperties = {
  position: "absolute",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  border: "1px solid #eee",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  fontSize: "28px",
  cursor: "pointer",
  zIndex: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#444",
};

const reviewButtonStyle: React.CSSProperties = {
  backgroundColor: "#1a73e8",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: "30px",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 4px 12px rgba(26, 115, 232, 0.2)"
};
