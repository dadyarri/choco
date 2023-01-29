export type UpdateProductRequestBody = {
    name: string,
    wholesalePrice: string | number,
    retailPrice: string | number,
    category: string,
    marketId: string | number,
    isByWeight: boolean
}