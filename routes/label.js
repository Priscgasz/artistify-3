const express = require("express");
const router = new express.Router();
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
// router.use(protectAdminRoute);

// GET - /dashboard/label
router.get("/", protectAdminRoute, async (req, res, next) => {
  try {
    // try to find all labels stored in labels collection
    const labels = await LabelModel.find();
    // if succes, send the found array as a view parameter
    res.render("dashboard/labels", { labels }); // we are ready now to loop through each label and display @view
  } catch (err) {
    // else if error thrown by LabelModel, pass the error to the next function
    // next() is provided by express
    // the next will display the error on error.hbs view
    next(err);
  }
});

// GET - /dashboard/label/create
router.get("/create", (req, res) => {
  res.render("dashboard/labelCreate");
});


// GET /dashboard/label/update/:id
router.get("/update/:id", async (req, res, next) => {
  try {
    const label = await LabelModel.findById(req.params.id); // fetch the label to update
    res.render("dashboard/labelUpdate", label); // pass the found label to the view
  } catch (err) {
    next(err); // if an error occurs, display it on error.hbs page
  }
});

// GET /dashboard/label/delete/:id
router.get("/delete/:id", async (req, res, next) => {
  try {
    // use the model to delete one label by id
    await LabelModel.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/label"); // then redirect to labels full list
  } catch (err) {
    next(err);
  }
});

// POST - /dashboard/label/create
router.post("/create", uploader.single("logo"), async (req, res, next) => {
  // if all good, multer will expose the uploaded object in req.file
  // req.file.path leads to an URL hosting the image @cloudinary
  const newLabel = { ...req.body };

  if (req.file) {
    newLabel.logo = req.file.path;
  } else {
    newLabel.logo = undefined;
  }

  try {
    await LabelModel.create(newLabel);
    res.redirect("/dashboard/label");
  } catch (err) {
    next(err); // express will display the error on the provided error page (error.hbs) (check the www file for details ....)
  }
});

router.post("/:id", uploader.single("logo"), async (req, res, next) => {
  const labelToUpdate = { ...req.body };

  if (req.file && req.file.path) {
    // this will be done ONLY if we uploaded a new image, else, let's keep the previous logo
    labelToUpdate.logo = req.file.path; // req.file.path leads to an URL hosting the image @cloudinary
  }

  try {
    await LabelModel.findByIdAndUpdate(req.params.id, labelToUpdate, {
      new: true,
    });
    res.redirect("/dashboard/label");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
