const db = require("../config/db");

// Get reviews for a property
const getReviews = (req, res) => {
const { propertyId } = req.params;

const query = `     SELECT
      reviews.id,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      users.name AS user_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.property_id = ?
    ORDER BY reviews.created_at DESC
  `;

db.query(query, [propertyId], (err, results) => {
if (err) {
console.error("Get Reviews Error:", err);


  return res.status(500).json({
    message: "Failed to fetch reviews",
  });
}

res.status(200).json({
  reviews: results,
});


});
};

// Add a review
const addReview = (req, res) => {
const { propertyId } = req.params;
const { rating, comment } = req.body;
const userId = req.user.id;

if (!rating) {
return res.status(400).json({
message: "Rating is required",
});
}

if (rating < 1 || rating > 5) {
return res.status(400).json({
message: "Rating must be between 1 and 5",
});
}

const checkQuery = `     SELECT id
    FROM reviews
    WHERE property_id = ? AND user_id = ?
  `;

db.query(
checkQuery,
[propertyId, userId],
(err, existingReview) => {
if (err) {
console.error("Check Review Error:", err);


    return res.status(500).json({
      message: "Failed to check existing review",
    });
  }

  if (existingReview.length > 0) {
    return res.status(400).json({
      message: "You have already reviewed this property",
    });
  }

  const insertQuery = `
    INSERT INTO reviews
    (property_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [
      propertyId,
      userId,
      rating,
      comment || null,
    ],
    (err, result) => {
      if (err) {
        console.error("Add Review Error:", err);

        return res.status(500).json({
          message: "Failed to submit review",
        });
      }

      res.status(201).json({
        message: "Review submitted successfully",
        reviewId: result.insertId,
      });
    }
  );
}


);
};

module.exports = {
getReviews,
addReview,
};
