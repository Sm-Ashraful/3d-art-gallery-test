import { asyncHandler } from "../utils/asyncHandler.js";
import { s3Client } from "../lib/aws-s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import pdf from "@stevemao/pdf-extraction";
import { ApiError } from "../utils/ApiError.js";
import { streamToBuffer } from "../utils/Helper.js";

const cURLHandler = asyncHandler(async (req, res) => {

  let daysBookedInOctober = 0;
  let daysBookedInNovember = 0;
  let daysBookedInDecember = 0;
  let totalTripPriceInOctober = 0;
  let totalTripPriceInNovember = 0;
  let totalTripPriceInDecember = 0;
      let perDayCost=0;

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
      const textLines = data.text.split("\n");
      const reservationId = textLines[2].split(" ")[3];
  
      for (let i = 0; i <= textLines.length; i++) {
         if (textLines[i] != null && textLines[i].match("TRIP PRICE")) {
          // const tripPriceString = textLines[i].split("$")[1];
          const oneDayCost = textLines[i + 1].split("$")[1].split("/")[0];
          perDayCost = parseFloat(oneDayCost)
         
          // const tripPrice = parseFloat(tripPriceString);
          // totalTripPrice += tripPrice;
        }
        if (textLines[i] != null && textLines[i].match("TRIP STARTTRIP END")) {
          const combineDate = textLines[i + 1];
          const dateTime = combineDate.split("EDT");
          const tripStartDate = new Date(dateTime[0]);
          const tripEndDate = new Date(dateTime[1]);
          const tripStartDateMonth = tripStartDate.getMonth();
      const tripEndDateMonth = tripEndDate.getMonth();
    
      const timeDifference = tripEndDate - tripStartDate;
      const dayCount = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      
     
      if (tripStartDateMonth === 9) {
        if(tripEndDate ===9){
          daysBookedInOctober += dayCount
        }else{
          daysBookedInOctober += Math.min(31, Math.max(0, 31 - tripStartDate.getDate()));
        }
        totalTripPriceInOctober += perDayCost * parseFloat(daysBookedInOctober)
      } 
      if (tripStartDateMonth === 10 || tripEndDateMonth === 10) {
        // Trip fully within November
        if(tripStartDateMonth === 10 && tripEndDateMonth===10)
        {
          daysBookedInNovember += dayCount
        }else{
          daysBookedInNovember += Math.min(30, Math.max(0, 30 - tripStartDate.getDate()));
        }
        totalTripPriceInNovember += perDayCost * parseFloat(daysBookedInNovember)
      }
      if (tripStartDateMonth === 11 || tripEndDateMonth === 11) {
        // Trip fully within December
        if(tripStartDateMonth === 11 || tripEndDateMonth === 11){
          daysBookedInDecember += dayCount
        }else{
          daysBookedInDecember += Math.min(31, Math.max(0, 31 - tripStartDate.getDate()));
        }
         totalTripPriceInDecember += perDayCost * parseFloat(daysBookedInDecember)
      } 
    }     
      }
    } catch (error) {
      throw new ApiError(400, "Something went wrong");
    }
  }
  const occupancyRateOctober = (daysBookedInOctober * 100) / 31;
  const occupancyRateNovember = (daysBookedInNovember * 100) / 30;
  const occupancyRateDecember = (daysBookedInDecember * 100) / 31;

  const averageDailyRateOctober = totalTripPriceInOctober / daysBookedInOctober;
  const averageDailyRateNovember = totalTripPriceInNovember / daysBookedInNovember;
  const averageDailyRateDecember = totalTripPriceInDecember / daysBookedInDecember;
  await res.status(200).send(
    JSON.stringify(
      {
        
        "Occupancy Rate October": occupancyRateOctober.toFixed(2) + "%",
      "Occupancy Rate November": occupancyRateNovember.toFixed(2) + "%",
      "Occupancy Rate December": occupancyRateDecember.toFixed(2) + "%",
      "Average Daily Rate October": "$" + averageDailyRateOctober.toFixed(2),
      "Average Daily Rate November": "$" + averageDailyRateNovember.toFixed(2),
      "Average Daily Rate December": "$" + averageDailyRateDecember.toFixed(2),
      },
      null,
      2
    )
  );
});

export { cURLHandler };