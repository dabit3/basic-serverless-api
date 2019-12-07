## Basic serverless API

Building a basic serverless API with DynamoDB, API Gateway, and AWS Lambda

## Getting started

Create the React project, install dependencies

```sh
$ npx create-react-app serverless-api

$ cd serverless-api

$ npm install aws-amplify
```

Next, create the amplify project and add the database:

```sh
$ amplify init

$ amplify add storage

? Please select from one of the below mentioned services: NoSQL Database
```

Create a database with the following columns:

```
id: string
name: string
description: string
price: number

? Please choose partition key for the table: id
? Do you want to add a sort key to your table? Y
? Please choose sort key for the table: name
? Do you want to add global secondary indexes to your table? N
? Do you want to add a Lambda Trigger for your Table? N
```

Next, create the API:

```sh
$ amplify add api

? Please select from one of the below mentioned services: REST
? Provide a friendly name for your resource to be used as a label for this category in the project: productapi
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
? Would you like to restrict API access? N
? Would you like to add another path? N
```

Next, update the function with the following changes:

```javascript
// region and table name available in comments of lambda function
const region = process.env.REGION
const ddb_table_name = process.env.<YOUR_STORAGE_NAME>

const AWS = require('aws-sdk')
const uuid = require('uuid/v4')
const docClient = new AWS.DynamoDB.DocumentClient({region})

// update the /products "get" and "post" endpoints
 
app.get('/products', async function(req, res) {
  try {
    var params = {
      TableName: ddb_table_name,
    }
    const data = await docClient.scan(params).promise()
    res.json({
      data: data
    })
  } catch (err) {
    res.json({
      error: err
    })
  }
})

app.post('/products', async function(req, res) {
  const { body } = req
  try {
    const input = { ...body, id: uuid() }
    var params = {
      TableName: ddb_table_name,
      Item: input
    }
    await docClient.put(params).promise()
    res.json({
      success: 'item saved to database..'
    })
  } catch (err) {
    res.json({
      error: err
    })
  }
})
```

Next, update the dependencies in the lambda function to include uuid:

__my-app/amplify/backend/function/<function_name>/src/index.js__

```json
"dependencies": {
  "aws-serverless-express": "^3.3.5",
  "body-parser": "^1.17.1",
  "express": "^4.15.2",
  "uuid": "^3.3.3"
},
```

Next, deploy the back end:

```sh
$ amplify push
```

### Client-side code

Next, open __src/index.js__ and add the following:

```javascript
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

Next, open __src/App.js__ and add the following code:

```javascript
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { API } from 'aws-amplify'

const initialState = {
  name: '',
  description: '',
  price: ''
}

function App() {
  const [products, setProducts] = useState([])
  const [product, updateProduct] = useState(initialState)
  async function fetchProducts() {
    const products = await API.get('productapi', '/products')
    setProducts(products.data.Items)
  }
  async function createProduct() {
    const { name, description, price } = product
    if (!name || !description || !price) return
    const data = {
      body: { ...product, price: parseInt(product.price) }
    }
    await API.post('productapi', '/products', data)
    console.log('product successfully created...')
    updateProduct(initialState)
    fetchProducts()
  }
  const updateProductInput = key => event => {
    updateProduct({ ...product, [key]: event.target.value })
  }
  useEffect(() => {
    fetchProducts()
  }, [])
  return (
    <div className="App">
      {
        products.map((product, index) => (
          <div key={index}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <h4>${product.price}</h4>
          </div>
        ))
      }
      <div style={form}>
        <input
          placeholder="Product name"
          value={product.name}
          onChange={updateProductInput("name")}
          style={input}
        />
        <input
          placeholder="Product description"
          value={product.description}
          onChange={updateProductInput("description")}
          style={input}
        />
        <input
          placeholder="Product price"
          value={product.price}
          onChange={updateProductInput("price")}
          style={input}
        />
        <button style={button} onClick={createProduct}>Create Product</button>
      </div>
    </div>
  );
}

const button = {
  padding: '10px 40px',
  width: 400,
  margin:  '0px auto'
}

const input = {
  padding: 7,
  width: 400,
  margin: '0px auto 6px'
}

const form = {
  display: 'flex', flexDirection: 'column', padding: 60
}

export default App;
```

### Test everything out

```sh
$ npm start
```