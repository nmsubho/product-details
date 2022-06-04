import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProduct = createAsyncThunk(
  "product/fetchProduct",
  async () => {
    const response = await axios.get(
      "https://moveon-api-server.sbox.ali2bd.net/api/v1/customer/dummy-product"
    );
    return response.data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: {},
    variation: [],
    cart: {},
  },
  reducers: {
    selectedVariation: (state, { payload }) => {
      state.variation = state?.variation?.filter(
        (oldData) => JSON.parse(oldData)?.name !== JSON.parse(payload)?.name
      );
      if (Object.keys(JSON.parse(payload).value).length !== 0) {
        state.variation.push(payload);
      }
    },
    addToCart: (state, { payload }) => {
      console.log("payload:::", payload);
      if (Object.keys(state.cart).length === 0) {
        console.log("payload in if:::", payload);
        state.cart[payload] = 1;
      } else {
        if (state.cart[payload]) {
          const newCount = state.cart[payload] + 1;
          state.cart[payload] = newCount;
        } else {
          state.cart[payload] = 1;
        }
      }
    },
    removeFromCart: (state, { payload }) => {
      state.cart = Object.keys(state.cart)
        .filter((key) => key.includes(payload))
        .reduce((obj, key) => {
          return Object.assign(obj, {
            [key]: state.cart[key],
          });
        }, {});
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.product = action.payload;
    });
  },
});

export const {
  // showProduct,
  selectedVariation,
  addToCart,
  removeFromCart,
} = productSlice.actions;

export default productSlice.reducer;
