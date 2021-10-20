const express = require("express");
const router = express.Router();
const StyleModel = require("./../model/Style");
const protectAdminRoute = require("./../middlewares/protectAdminRoute");
// router.use(protectAdminRoute);


router.get("/", protectAdminRoute, async (req, res, next) => {
  try {
    // try to find all documents stored in styles collection
    const styles = await StyleModel.find();
    console.log(styles);
    // if succes, send the found array as a view parameter
    res.render("dashboard/styles", { styles }); // we are ready now to loop through each style and display @view
  } catch (err) {
    // else if error thrown by StyleModel, pass the error to the next function
    // next() is provided by express
    // the next will display the error on error.hbs view
    next(err);
  }
});

router.get("/create", (req, res, next) => {
  res.render("dashboard/styleCreate");
});

router.get("/update/:id", async (req, res, next) => {
  try {
    const style = await StyleModel.findById(req.params.id); // fetch the style to update
    console.log(style);
    res.render("dashboard/styleUpdate", { style });
  } catch (err) {
    next(err); // if an error occurs, display it on error.hbs page
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    // use the model to delete one label by id
    await StyleModel.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard/style"); // then redirect to labels full list
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await StyleModel.create(req.body);
    res.redirect("/dashboard/style");
  } catch (err) {
    next(err); // express will display the error on the provided error page (error.hbs) (check the www file for details ....)
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    await StyleModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/dashboard/style");
  } catch (err) {
    next(err); // express will display the error on the provided error page (error.hbs) (check the www file for details ....)
  }
});

module.exports = router;
