# Developer Take Home Test

## Installation
1. Clone the repository:

```bash
git clone https://github.com/Sm-Ashraful/3d-art-gallery-test.git
cd 3d-art-gallery-test
``` 
Install dependencies:
```bash
npm install
```
## Usage
The PDF file is stored in a publicly accessible Amazon S3 bucket,
File URLs for Testing: 
```bash
https://3d-developer-task.s3.ap-south-1.amazonaws.com/26774801.pdf
https://3d-developer-task.s3.ap-south-1.amazonaws.com/26899435.pdf
https://3d-developer-task.s3.ap-south-1.amazonaws.com/26926135.pdf
https://3d-developer-task.s3.ap-south-1.amazonaws.com/27082060.pdf
https://3d-developer-task.s3.ap-south-1.amazonaws.com/27270383.pdf
https://3d-developer-task.s3.ap-south-1.amazonaws.com/27401957.pdf
https://3d-developer-task.s3.ap-south-1.amazonaws.com/27486932.pdf
```
Live url: API END Point
```bash
https://ashraful-greentest-1-five.vercel.app/calculate
```
Test Input:
```bash
curl -X POST -H "Content-Type: application/json" -d "{\"file_urls\":[\"https://3d-developer-task.s3.ap-south-1.amazonaws.com/27082060.pdf\",\"https://3d-developer-task.s3.ap-south-1.amazonaws.com/27401957.pdf\",\"https://3d-developer-task.s3.ap-south-1.amazonaws.com/26774801.pdf\",\"https://3d-developer-task.s3.ap-south-1.amazonaws.com/26899435.pdf\",\"https://3d-developer-task.s3.ap-south-1.amazonaws.com/26926135.pdf\",\"https://3d-developer-task.s3.ap-south-1.amazonaws.com/27270383.pdf\", \"https://3d-developer-task.s3.ap-south-1.amazonaws.com/27486932.pdf\"]}" https://ashraful-greentest-1-five.vercel.app/calculate
```
Add env file: You can change it by your own configuration
```bash
AWS_ACCESS_KEY_ID=AKIATCKANG5RQWCC65NR
AWS_SECRET_ACCESS_KEY=3jjXqx/1VMPaX9lZVde8J4V17h94GXQr4e09ySBs
REGION=ap-south-1
```
