import { asyncHandler } from "../utils/asyncHandler.js";
import { s3Client } from "../lib/aws-s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import pdf from "@stevemao/pdf-extraction";
import { ApiError } from "../utils/ApiError.js";
import {
  calculateMetrics,
  calculateOctoberStats,
  streamToBuffer,
} from "../utils/Helper.js";

const CalculateController = asyncHandler(async (req, res) => {
  const octoberStats = {
    daysBooked: 0,
    totalTripPrice: 0,
  };
  const fileUrls = req.body.file_urls;
  if (!fileUrls) {
    throw new ApiError(400, "Bad Request. Can not find file_urls");
  }
  for (let fileUrl of fileUrls) {
    const urlObject = new URL(fileUrl);
    const bucketName = urlObject.hostname.split(".")[0];
    const key = urlObject.pathname.slice(1);
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentType: "application/pdf",
    });
    try {
      const response = await s3Client.send(command);
      const pdfInstance = await streamToBuffer(response.Body);
      const data = await pdf(pdfInstance);
      const { daysBooked, tripPrice } = calculateOctoberStats(data);

      octoberStats.daysBooked += daysBooked;
      octoberStats.totalTripPrice += tripPrice;
    } catch (error) {
      throw new ApiError(400, "Something went wrong");
    }
  }
  const { occupancyRate, averageDailyRate } = calculateMetrics(octoberStats);
  await res.status(200).send(
    JSON.stringify(
      {
        "Days Booked": octoberStats.daysBooked.toString(),
        "Occupancy Rate": occupancyRate.toFixed(2) + "%",
        "Average Daily Rate": "$" + averageDailyRate.toFixed(2),
      },
      null,
      2
    )
  );
});

export { CalculateController };
