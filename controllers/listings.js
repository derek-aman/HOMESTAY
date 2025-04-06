  const Listing =  require("../models/listing.js");
  
  module.exports.index = async (req,res) => {
  const allListings =  await Listing.find({});
  res.render("listings/index", {allListings});
    
};

module.exports.renderNewForm =  (req,res) => {
   
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req , res) => {
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({path:"reviews", populate : {path: "author"}}).populate("owner");
   if(!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res ,next) => {
   let url = req.file.path;
   let filename = req.file.filename;
   

    const newListing = new Listing( req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
       res.redirect("/listings");
     
    
  };

  module.exports.renderEditForm = async (req ,res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing) {
          req.flash("error", "Listing you requested for does not exist!");
          res.redirect("/listings");
         }
        let originalImageUrl = listing.image.url;
        originalImageUrl= originalImageUrl.replace("/upload", "/upload/h_300,w_250");
        res.render("listings/edit.ejs", {listing});
    };

    module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
      
        if (!req.body.listing) {
          return res.status(400).send("Invalid request: No listing data provided");
        }
      
        // Build updateData only from fields sent
        let updateData = req.body.listing;
      
        // Handle image update only if a new image is uploaded
        if (req.file) {
          updateData.image = {
            url: req.file.path,
            filename: req.file.filename,
          };
        }
      
        await Listing.findByIdAndUpdate(id, updateData, { new: true });
      
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
      };

    module.exports.destroyListing = async (req,res) => {
        let {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", " Listing  Deleted!");
        res.redirect("/listings");
    };