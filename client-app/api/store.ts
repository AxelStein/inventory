import { configureStore } from "@reduxjs/toolkit";
import { inventoryApi } from "./inventory/inventory.api";
import { setupListeners } from "@reduxjs/toolkit/query";
import { categoryApi } from "./category/category.api";
import { tagApi } from "./tag/tag.api";
import { authApi } from "./auth/auth.api";
import { appApi } from "./app/app.api";
import { itemApi } from "./item/item.api";
import { localeApi } from "./app/locale.api";
import authReducer from 'api/slice/auth.slice';
import { itemLikeApi } from "./item/item.like.api";
import { customIdApi } from "./custom_id/custom.id.api";

export const store = configureStore({
    reducer: {
        [inventoryApi.reducerPath]: inventoryApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [tagApi.reducerPath]: tagApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [appApi.reducerPath]: appApi.reducer,
        [itemApi.reducerPath]: itemApi.reducer,
        [localeApi.reducerPath]: localeApi.reducer,
        [itemLikeApi.reducerPath]: itemLikeApi.reducer,
        [customIdApi.reducerPath]: customIdApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        inventoryApi.middleware,
        categoryApi.middleware,
        tagApi.middleware,
        authApi.middleware,
        appApi.middleware,
        itemApi.middleware,
        localeApi.middleware,
        itemLikeApi.middleware,
        customIdApi.middleware
    ),
});

setupListeners(store.dispatch);