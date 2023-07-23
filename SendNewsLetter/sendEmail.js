const express = require('express');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const cors = require('cors');
const multer = require('multer');
const app = express();
app.use(cors());
app.use(express.json());
//const s3 = new S3Client({region: 'ap-south-1'});
const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
//const client = new SESClient({region: 'ap-south-1'});
const client = new SESClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
//const dynamodbClient = new DynamoDBClient({region: 'ap-south-1'});
const dynamodbClient = new DynamoDBClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const storage = multer.memoryStorage();
const upload = multer({ storage });
//const upload = multer({ dest: 'uploads/' });
app.get('/getEmail', async (req, res) => {
    const getItemCommand = new ScanCommand({
      TableName: 'Table',
    });
  
    try {
      const response = await dynamodbClient.send(getItemCommand);
      console.log('Response from DynamoDB:', response.Items);
      const emailId = response.Items.map(item => item.userid.S);
      const mailId = emailId.join((', '));
      id = `'${mailId}'`;
      console.log(id);
    } catch (error) {
      console.error('Error response from DynamoDB:', error);
    }
  });
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/upload',upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file selected.' });
    }
    const file = req.file;
    const command = new PutObjectCommand({
        Bucket: 'devops-newsletter-storage',
        Key: file.originalname,
        Body: file.buffer
      });
    
      try {
        const response = await s3.send(command);
        //console.log(response);
        res.send('File uploaded successfully!');
      } catch (err) {
        console.error(err);
      }
});

app.post('/sendEmail', async (req, res) => {
 // const {mailId,objectUrl} = req.body;
  try {
    const params = {
      Destination: {
        ToAddresses: ['varunparab7@gmail.com'] // Replace with recipient email address
      },
      Message: {
        Body: {
          Text: {
            Data: 'hii' // Replace with the email body
          }
        },
        Subject: {
          Data: 'Newsletter' // Replace with the email subject
        }
      },
      Source: 'varunparab7@gmail.com' // Replace with sender email address
    };

    const command = new SendEmailCommand(params);
    await client.send(command);

    res.send('Email sent successfully!');
  } catch (err) {
    console.error('Unable to send email:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(4001, () => {
  console.log('Serverrr started on port 4001');
});
