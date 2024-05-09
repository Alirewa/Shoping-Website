
// selecting:
const productsDOM = document.querySelector(".product-list");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cartItems");
const cartContent = document.querySelector(".cart-list");

let cart = [];
import { productsData } from "./products.js";

var swiper = new Swiper(".mySwiper", {
     pagination: {
       el: ".swiper-pagination",
     },
   });

// get Products
   class Products {
    getProducts() {
      return productsData;
    }
  }
  // display Products
  class UI {
    displayProducts(products) {
      let results = "";
      products.forEach((item) => {
        results +=
        `
      <div class="product-item bg-slate-100 rounded-md">
              <img class="rounded-md" src=${item.imageUrl} alt=${item.id} />
        <div>
              <h2 class="text-xl font-semibold text-gray-900 p-2 text-center">${item.title}</h5>
            <div class="flex p-4 items-center justify-between gap-x-4">
              <span class="flex text-2xl font-bold text-gray-900">Price: ${item.price}</span>
              <button type="button" data-id=${item.id} class="addtocart-btn flex-1 text-white bg-blue-700 hover:bg-blue-800 rounded-md p-2 h-10">Add To Cart</button>
            </div>
        </div>
      </div>`;
      productsDOM.innerHTML = results;
      })
    }
    getAddToCartBtns() {
      const addToCartBtn = document.querySelectorAll(".addtocart-btn")
      const buttons = [...addToCartBtn];
      buttons.forEach(btn => {
        const id = btn.dataset.id;
        // check if this product id is in cart or not?
        const isInCart = cart.find(p => p.id === id);
        if (isInCart) {
          btn.innerText = "In Cart";
          btn.disabled = true;
        }
        btn.addEventListener("click" , (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          // get product from Products
          const addedProduct = {...Storage.getProduct(id) ,  quantity: 1};
          // add to cart
          cart = [...cart , addedProduct]
          // save cart to localStorage
          Storage.saveCart(cart);
          // update cart value
          this.setCartValue(cart);
          // add to cart item
          this.addCartitem(addedProduct);
          // get cart from storage
        })
      })
    }
    setCartValue(cart) {
      // cart items:

      // cart total price:
      let tempCartItems = 0;
      const totalPrice = cart.reduce((acc , curr) => {
        tempCartItems += curr.quantity;
        return acc + curr.quantity * curr.price;
      }, 0);
      cartTotal.innerText = `${totalPrice.toFixed(2)}`
      cartItems.innerHTML = tempCartItems;
    }
    addCartitem(cartItem) {
      const div = document.createElement("div");
      div.classList.add("cart-item" , "flex");
      div.innerHTML = 
      `<i data-id=${cartItem.id} class="far fa-trash-alt text-red-600 items-center p-2 flex cursor-pointer"></i>
       <img class="flex w-20 h-15 rounded-md" src=${cartItem.imageUrl}
       alt=${cartItem.id} />
       <h2 class="flex-1 text-xl font-bold text-gray-900 p-2 text-left">${cartItem.title}</h5>
       <span class="items-center justify-center text-right text-md p-2 font-semibold text-gray-900">Price: ${cartItem.price}</span>`
       cartContent.appendChild(div);
    }
    setupApp() {
      cart = Storage.getcart() || [];
      cart.forEach(cartItem => this.addCartitem(cartItem));
      // setValues:
      this.setCartValue(cart);
    }
    cartLogic() {
      cartContent.addEventListener("click" , (event) => {
        event.target.classList.contains("fa-trash-alt")
        const removeItem = event.target;
        const _removedItem = cart.find(c => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      })
    }
    removeItem(id) {
      cart = cart.filter((cItem) => cItem.id !== id);
      this.setCartValue(cart);
      Storage.saveCart(cart);
    }

  }
  // Storage
  class Storage {
    static saveProducts(products) {
      localStorage.setItem("products" , JSON.stringify(products));
    }
    static getProduct(id) {
      const _products = JSON.parse(localStorage.getItem("products"))
      return _products.find(p => p.id === parseInt(id));
    }
    static saveCart(cart) { 
      localStorage.setItem("cart" , JSON.stringify(cart));
    }
    static getcart() {
      return JSON.parse(localStorage.getItem("cart"))
    }
  }
  document.addEventListener("DOMContentLoaded" , () => {
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.setupApp();
    ui.cartLogic();
    ui.displayProducts(productsData)
    ui.getAddToCartBtns();
    Storage.saveProducts(productsData);
  })