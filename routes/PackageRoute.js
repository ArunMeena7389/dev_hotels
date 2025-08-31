const express = require("express");
const router = express.Router();
const Package = require("../Schema/PackageItem");
const uploads = require("../Config/multer");
const { jwtAuthMiddleware } = require("../jwt");

// Create package
var typeUpload = uploads.single("image");

router.post("/create", jwtAuthMiddleware, typeUpload, async (req, res) => {
  try {
    const data = req.body;

    if (data.items) {
      if (typeof data.items === "string") {
        data.items = data.items.includes(",")
          ? data.items.split(",").map((i) => i.trim())
          : [data.items];
      }
    }

    if (req.file && req.file.path) {
      data.image_url = req.file.path;
    }

    data.business_id = req.user.id;
    const newPackage = new Package(data);
    await newPackage.save();

    res.status(200).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all packages
router.get("/get", jwtAuthMiddleware, async (req, res) => {  
  try {
    const businessId = req.user.id;
    const PackageResponse = await Package.find({ business_id: businessId });
    res.status(200).json(PackageResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-customer", async (req, res) => {
  try {
    const businessId = req.headers.business_id;
    if (!businessId) {
      return res
        .status(404)
        .json({ success: false, message: "There no bussiness for that" });
    }
    const PackageResponse = await Package.find({ business_id: businessId });
    res.status(200).json(PackageResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.put("/update/:id", jwtAuthMiddleware, typeUpload, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.items) {
      if (typeof data.items === "string") {
        data.items = data.items.includes(",")
          ? data.items.split(",").map((i) => i.trim())
          : [data.items];
      }
    }

    if (req.file && req.file.path) {
      data.image_url = req.file.path;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    res.status(200).json({ success: true, data: updatedPackage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
