## Basic serverless API

Building a basic serverless API with DynamoDB, API Gateway, and AWS Lambda

## Getting started

Create the React project, install dependencies

```sh
$ npx create-react-app serverless-api

$ cd  serverless-api

$ npm install aws-amplify
```

Next, create the amplify project and add the database:

```sh
amplify init

amplify add storage
```

Create a database with the following fields:

```
id: string
name: string
description: string
price: number

? Please choose partition key for the table: id
? Do you want to add a sort key to your table? Yes
? Please choose sort key for the table: name
```

Next, create the API:

```sh
$ amplify add api

? Please select from one of the below mentioned services: REST
? Provide a friendly name for your resource to be used as a label for this category in the project: <api_name>
? Provide a path (e.g., /items) /products
? Choose a Lambda source: Create a new Lambda function
? Provide a friendly name for your resource to be used as a label for this category in the project: <function_name>
? Provide the AWS Lambda function name: <function_name>
? Choose the function template that you want to use: Serverless express function (Integration with Amazon API Gateway)
? Do you want to access other resources created in this project from your Lambda function? Yes
? Select the category storage
Storage category has a resource called <table_name>
? Select the operations you want to permit for <table_name> create, read, update, delete
? Do you want to edit the local lambda function now? Yes
Please edit the file in your editor: my-app/amplify/backend/function/<function_name>/src/index.js
? Press enter to continue
```
