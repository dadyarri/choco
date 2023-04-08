import { Product } from "entities";
import { UpdateProductRequestBody } from "services/request-bodies";
import { ModelApi } from "shared/api/lib";

export class ProductsApi extends ModelApi<Product, UpdateProductRequestBody> {
    protected override baseURL = "/products";
}
