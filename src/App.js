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
    const products = await API.get('api7d641705', '/products')
    setProducts(products.data.Items)
  }
  async function createProduct() {
    const { name, description, price } = product
    if (!name || !description || !price) return
    const data = {
      body: { ...product, price: parseInt(product.price) }
    }
    await API.post('api7d641705', '/products', data)
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
            <h4>{product.price}</h4>
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
