import {ProductCategory} from "entities/product-category";

export type Product = {
    id: string
    deleted: boolean
    leftover: number
    name: string
    retailPrice: number
    wholesalePrice: number
    isByWeight: boolean
    marketId: number
    category: ProductCategory
}