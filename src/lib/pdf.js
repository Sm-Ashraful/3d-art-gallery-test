import { streamToBuffer } from "../utils/Helper.js";
import { s3Client } from "./aws-s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export { processPdf };
