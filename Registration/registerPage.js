const express = require("express");
const cors = require("cors");
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
//const dynamodbClient = new DynamoDBClient({region: 'ap-south-1'}); 
const dynamodbClient = new DynamoDBClient({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
}); 
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/register', async(req, res) => {
  const { email } = req.body;

  const putItemCommand = new PutItemCommand({
    TableName: 'Table',
    Item: {
      'userid': { S: email }
    }
  });
  try {
    await dynamodbClient.send(putItemCommand);
    console.log('Email ID saved successfully');
    res.status(200).json({ message: 'Email ID saved successfully' });
  } catch (error) {
    console.error('Error saving email ID to DynamoDB:', error);
    res.status(500).json({ error: 'Failed to save email ID' });
  }
});

app.listen(4000, () => {
    console.log("Listening on 4000");
});