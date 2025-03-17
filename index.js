const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDb = require("./Config/db");
const authRoutes = require("./Routes/AuthRoutes");
const SubjectRoutes = require("./Routes/SubjectRoutes");
const ChapterRoutes = require("./Routes/ChapterRoutes");
const TopicRoutes = require("./Routes/TopicRoutes");
const McqRoutes = require("./Routes/McqRoutes");
const StudyMaterialRoutes = require("./Routes/StudyMaterialRoutes");
const CategoryRoutes = require("./Routes/CategoryRoutes");
const SubscriptionRoutes = require("./Routes/SubscriptionRoutes");
const path = require('path');
const BannerRoutes = require("./Routes/BannerRoutes")
const BulkImportRoutes = require('./Routes/BulkImportRoutes')
const AttemptRoutes = require("./Routes/AttemptRoutes")
const TestSessionRoutes = require("./Routes/TestSessionRoutes")
const TestRoutes = require("./Routes/TestRoutes")
const QuizRoutes = require("./Routes/QuizRoutes")
 require('./Utils/SubscriptionExpiration');

// database config
connectDb();

//rest object
const app = express();

//midwares
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "*",  
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subject", SubjectRoutes);
app.use("/api/v1/chapter", ChapterRoutes);
app.use("/api/v1/topic", TopicRoutes);
app.use("/api/v1/mcqs", McqRoutes);
app.use("/api/v1/material", StudyMaterialRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/subscription", SubscriptionRoutes);
app.use('/api/v1/banner', BannerRoutes);
app.use('/api/v1/bulk-import', BulkImportRoutes);
app.use('/api/v1/attempts', AttemptRoutes);
app.use('/api/v1/test-session', TestSessionRoutes);
app.use('/api/v1/test', TestRoutes);
app.use('/api/v1/quiz', QuizRoutes);

//rest api
app.get("/", (req, res) => {
    res.send("<h1>first route is here</h1>");
  });
  
  //port
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server started successfully at port ${PORT}`);
  });
