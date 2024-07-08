const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ap2290731:ap2290731@cluster0.ut9ocut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define schema and model
const fileSchema = new mongoose.Schema({
  filename: String,
  uploadDate: { type: Date, default: Date.now },
});

const serviceSchema = new mongoose.Schema({
  heading: String,
  description: String,
  image: String, // to store the filename of the uploaded image
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);
const Service = mongoose.model("Service", serviceSchema);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}


app.get("/latest-image", async (req, res) => {
  try {
    const latestFile = await File.findOne().sort({ uploadDate: -1 }).exec();
    if (latestFile) {
      res.json({ filename: latestFile.filename });
    } else {
      res.status(404).json({ error: "No image found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload endpoint for File
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ error: "No file selected" });
      } else {
        const newFile = new File({ filename: req.file.filename });
        newFile
          .save()
          .then(() =>
            res.json({
              message: "File uploaded and saved to DB",
              filename: req.file.filename,
            })
          )
          .catch((err) => res.status(500).json({ error: err }));
      }
    }
  });
});

  // Delete endpoint
  app.delete("/delete", async (req, res) => {
    try {
      const latestFile = await File.findOne().sort({ uploadDate: -1 }).exec();
      if (latestFile) {
        const filePath = path.join(__dirname, "uploads", latestFile.filename);
        await fs.remove(filePath);
        await File.deleteOne({ _id: latestFile._id });
        res.json({ message: "File deleted from server and DB" });
      } else {
        res.status(404).json({ error: "No file found to delete" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update endpoint
  app.put("/update", async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        if (req.file == undefined) {
          res.status(400).json({ error: "No file selected" });
        } else {
          try {
            const latestFile = await File.findOne().sort({ uploadDate: -1 }).exec();
            if (latestFile) {
              const filePath = path.join(__dirname, "uploads", latestFile.filename);
              await fs.remove(filePath);
              latestFile.filename = req.file.filename;
              latestFile.uploadDate = Date.now();
              await latestFile.save();
              res.json({
                message: "File updated and DB record updated",
                filename: req.file.filename,
              });
            } else {
              res.status(404).json({ error: "No file found to update" });
            }
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        }
      }
    });
  });

// CRUD endpoints for Services
app.post("/services", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      const { heading, description } = req.body;
      if (req.file == undefined) {
        res.status(400).json({ error: "No file selected" });
      } else {
        const newService = new Service({
          heading,
          description,
          image: req.file.filename,
        });
        newService
          .save()
          .then((service) => res.json(service))
          .catch((err) => res.status(500).json({ error: err }));
      }
    }
  });
});

app.get("/services", (req, res) => {
  Service.find()
    .then((services) => res.json(services))
    .catch((err) => res.status(500).json({ error: err }));
});

app.get("/services/:id", (req, res) => {
  Service.findById(req.params.id)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

app.put("/services/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      const { heading, description } = req.body;
      const updateData = {
        heading,
        description,
        uploadDate: Date.now(),
      };
      if (req.file != undefined) {
        updateData.image = req.file.filename;
      }
      Service.findByIdAndUpdate(req.params.id, updateData, { new: true })
        .then((service) => {
          if (!service) {
            return res.status(404).json({ error: "Service not found" });
          }
          res.json(service);
        })
        .catch((err) => res.status(500).json({ error: err }));
    }   
  });
});

app.delete("/services/:id", (req, res) => {
  Service.findByIdAndDelete(req.params.id)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      const filePath = path.join(__dirname, "uploads", service.image);
      fs.remove(filePath)
        .then(() => res.json({ message: "Service deleted" }))
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => res.status(500).json({ error: err }));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
