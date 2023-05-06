import { configureStore } from "@reduxjs/toolkit";
import { postsReducers } from "./slices/posts";

const store = configureStore({
  reducer: { posts: postsReducers },
});

export default store;
