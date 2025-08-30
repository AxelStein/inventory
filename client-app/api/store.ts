import {configureStore} from "@reduxjs/toolkit";
import {inventoryApi} from "./inventory/inventory.api";
import {setupListeners} from "@reduxjs/toolkit/query";
import {categoryApi} from "./category/category.api";
import { tagApi } from "./tag/tag.api";
import { authApi } from "./auth/auth.api";

export const store = configureStore({
    reducer: {
        [inventoryApi.reducerPath]: inventoryApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [tagApi.reducerPath]: tagApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        inventoryApi.middleware,
        categoryApi.middleware,
        tagApi.middleware,
        authApi.middleware
    ),
});

setupListeners(store.dispatch);