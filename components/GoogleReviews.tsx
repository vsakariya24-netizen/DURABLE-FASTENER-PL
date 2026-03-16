import { useState, useEffect } from "react";

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews);
        setRating(data.overallRating);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const renderStars = (count) => "⭐".repeat(count);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Google Reviews {rating && `— ${rating} ⭐`}</h2>

      {reviews.map((review, index) => (
        <div key={index} style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={review.profile_photo_url}
              alt={review.author_name}
              style={{ width: "40px", borderRadius: "50%" }}
            />
            <div>
              <strong>{review.author_name}</strong>
              <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>
                {review.relative_time_description}
              </p>
            </div>
          </div>
          <p>{renderStars(review.rating)}</p>
          <p>{review.text}</p>
        </div>
      ))}
    </div>
  );
}