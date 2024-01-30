export async function streamToBuffer(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export function calculateMetrics(octoberStats) {
  const occupancyRate = (octoberStats.daysBooked / 31) * 100;
  const averageDailyRate =
    octoberStats.totalTripPrice / octoberStats.daysBooked;
  return { occupancyRate, averageDailyRate };
}

export function calculateOctoberStats(data) {
  const textLines = data.text.split("\n");
  let daysBooked = 0;
  let tripPrice = 0;

  for (let i = 0; i < textLines.length; i++) {
    if (textLines[i] != null && textLines[i].match("TRIP STARTTRIP END")) {
      const dateString = textLines[i + 1].split("EDT");
      const startDate = new Date(dateString[0]);
      const endDate = new Date(dateString[1]);

      daysBooked += calculateDaysInOctober(startDate, endDate);
    } else if (textLines[i] != null && textLines[i].match("TRIP PRICE")) {
      const priceString = textLines[i].split("$")[1];
      const totalTripPrice = parseFloat(priceString);
      const oneDayCost = textLines[i + 1].split("$")[1].split("/")[0];
      const totalDays = parseFloat(textLines[i + 1].split(" ")[0]);
      const perDayCost = parseFloat(oneDayCost);
      tripPrice += perDayCost * daysBooked;
    }
  }

  return { daysBooked, tripPrice };
}

function calculateDaysInOctober(startDate, endDate) {
  const startDateMonth = startDate.getMonth();
  const endDateMonth = endDate.getMonth();

  const MONTH_OCTOBER = 9;
  const startDateInOctober = startDateMonth === MONTH_OCTOBER;
  const endDateInOctober = endDateMonth === MONTH_OCTOBER;

  if (startDateInOctober && endDateInOctober) {
    const timeDifference = endDate - startDate;
    const dayCount = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return dayCount;
  } else if (startDateInOctober) {
    // Calculate the remaining days in October, including the start day

    const remaining = Math.min(31, Math.max(0, 30 - startDate.getDate() + 1));
    return remaining;
  } else if (endDateInOctober) {
    // Calculate the remaining days in October, including the end day
    const remainingDays = Math.min(31, endDate.getDate());
    return remainingDays;
  } else if (startDateMonth < MONTH_OCTOBER && endDateMonth > MONTH_OCTOBER) {
    // The trip spans the entire month of October
    return 31;
  }
  // ... other logic for different cases ...
}
