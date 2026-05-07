const Listing=require("../models/listing.js")
module.exports.index=async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }


module.exports.renderNewForm= async (req, res) => {
    res.render("listings/new.ejs");
  }

 module.exports.showListing= async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id)
        .populate({
  path: "reviews",
  populate: { path: "author" }
})
        .populate("owner");
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
      }

      res.render("listings/show.ejs", { listing });
    }

module.exports.createListing=async (req, res, next) => {
let url=req.file.path;
let filename=req.file.filename;
const {location} = req.body.listing;
  const apiKey = process.env.LOCATIONIQ_API_KEY; 
  const geocodeUrl = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(location)}&format=json`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
        let coordinates;
         if (data && data.length > 0) {
      coordinates = [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [lng, lat]
    } else {
      coordinates = [72.8777, 19.0760]; // fallback: Mumbai
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
     newListing.geometry = {
      type: 'Point',
      coordinates
    };
       let savedListing=await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }
  module.exports.listingsByCategory = async (req, res) => {

    const { category } = req.params;
    const listings = await Listing.find({ category });
if(listings.length===0){
    req.flash("error", "Cannot fetch listings for this category");
        return res.redirect("/listings");
}
    res.render("listings/category.ejs", { listings, category });

};
 module.exports.renderEditForm= async (req, res) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
      }

      res.render("listings/edit.ejs", { listing});
    }

 module.exports.updateListing=async(req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file !="undefined"){
  let url=req.file.path;
let filename=req.file.filename;
    listing.image={url,filename};
   await listing.save();
   }
  
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing= async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }

module.exports.searchDestination=async(req,res)=>{
  const searchQuery=req.query.q;
   if(!searchQuery || searchQuery.trim() === ""){
        req.flash("error", "Search input is empty");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        $or: [
            { location: { $regex: searchQuery, $options: "i" } },

            { title: { $regex: searchQuery, $options: "i" } },

            { country: { $regex: searchQuery, $options: "i" } },
        ]
    });
     if(listings.length === 0){
        req.flash("error", "No matching listings found");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", {
        allListings: listings
    });
}


