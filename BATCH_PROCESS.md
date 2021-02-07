# Batch Processing Task

For batch processing I can think of two solution

1. Cloud based solution
2. Node.js based solution

I assume that user will upload csv file for thousands of new prices.

## 1. Cloud based solution

1. Our API server will stream/upload CSV file to s3 bucket.
2. After that API server will trigger one lambda function, or may be s3 bucket can trigger lambda function.
3. That lambda function will read the csv file and add those records into SQS.
4. SQS will trigger second lamda function which will process data and Insert into database.

### Pros

- Lambda is auto scalable.
- SQS is fully managed message queuing service.
- Both services are faster, reliable and scalable.

### Cons

- If you want to migrate from AWS to Google or any other cloud service, you may need think to revamp this process.
- You may need to pay little bit more for using Lamda, SQS, S3.
- There is 15 minutes time limit for executing task in Lambda. You can not run longer running process in Lambda.

## 2. Node.js based solution

I want to use Node.js Stream here, it very powerful tool of Node.js

1. Our API server will store file in Temporary folder.
2. We will read CSV file line by line.
3. After that we will insert data into database.
4. Once the operation is completed we can remove that CSV file or upload it to s3 bucket for backup purpose if needed.

### Pros

- Using stream we are loading only 64kb at a time not whole CSV file in memory.
  For example: If you have 5GB csv file, stream will not load 5GB data in memory instead it will load 64kb data from that CSV file at a time.
- We can deploy this solution to any cloud service like AWS, Google, Digital Ocean etc
- You can also spawn new process in Node.js so it will not block main thread, it is not neccessory but you can do it if you want.
- In Node.js you can create longer running process for this task
- Using Node.js you can use RabbitMQ, redis-queue as messaging queue service

### Cons

- We need to scale application manually, or may be we can use AWS load balancer for auto scaling
