/* eslint-disable react/no-unknown-property */
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    productObj: {},
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  increaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  getObj = obj => ({
    id: obj.id,
    imageUrl: obj.image_url,
    title: obj.title,
    brand: obj.brand,
    totalReviews: obj.total_reviews,
    rating: obj.rating,
    price: obj.price,
    availability: obj.availability,
    description: obj.description,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const objDetails = this.getObj(data)
      const similarProductsList = data.similar_products.map(each =>
        this.getObj(each),
      )
      const obj = {objDetails, similarProductsList}
      this.setState({productObj: obj, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  successView = () => {
    const {productObj, quantity} = this.state
    const {objDetails, similarProductsList} = productObj
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      price,
      description,
      availability,
    } = objDetails

    return (
      <>
        <Header />
        <img src={imageUrl} alt="product" />
        <h1>{title}</h1>
        <p>Rs.{price}/-</p>
        <p className="rating">{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
        <p>{totalReviews} Reviews</p>
        <p>{description}</p>
        <p>Available: {availability}</p>
        <p>Brand: {brand}</p>
        <button type="button" testid="minus" onClick={this.decreaseQuantity}>
          <BsDashSquare />
        </button>
        <p>{quantity}</p>
        <button type="button" testid="plus" onClick={this.increaseQuantity}>
          <BsPlusSquare />
        </button>
        <button type="button">Add to Cart</button>
        <div>
          <h1>Similar Products</h1>
          <ul>
            {similarProductsList.map(each => (
              <SimilarProductItem key={each.id} productDetails={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  returnToProducts = () => {
    const {history} = this.props
    history.replace('/products/')
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <p>Product Not Found</p>
      <button type="button" onClick={this.returnToProducts}>
        Continue Shopping
      </button>
    </div>
  )

  loadingView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.successView()
      case apiConstants.failure:
        return this.failureView()
      case apiConstants.loading:
        return this.loadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
