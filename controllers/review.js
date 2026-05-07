const Review=require("../models/review.js")
const Listing=require("../models/listing.js")

module.exports.createReview=async(req,res)=>{
   
    let listing= await Listing.findById(req.params.id);
    if (!listing) {
  req.flash("error", "Listing not found");
  return res.redirect("/listings");
}
  let newReview= new Review(req.body.review);
newReview.author=req.user._id;
await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

req.flash("success","New Review Created");
res.redirect(`/listings/${listing._id}`)

}

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  await Review.findByIdAndDelete(reviewId);

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};