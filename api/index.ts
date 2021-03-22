import express, { Request, Response } from "express";
import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from "http-status";
import path from "path";
import dayjs from "dayjs";

import { storage } from "../utils/firebase";

// Initializations
const app = express();

// Settings
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.get("/", async (req: Request, res: Response) => {
  try {
    const [files] = await storage()
      .bucket("sanble-app.appspot.com")
      .getFiles({ directory: "downloads" });

    const file = files.find((y) => y.name === "downloads/sanble.apk");

    const signedUrls = await file.getSignedUrl({
      action: "read",
      expires: dayjs().add(1, "d").format("MM-DD-YYYY"), // The link will be available for 24 hours
    });

    const urlFile = signedUrls[0] || null;

    res.render("index", {
      urlFile: urlFile ? urlFile : "",
    });
  } catch (error) {
    console.error(error);

    res.status(INTERNAL_SERVER_ERROR).json({
      statusCode: INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    });
  }
});

export default app;
