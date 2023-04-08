import { Product } from "entities";
import { UpdateProductRequestBody } from "services/request-bodies";
import { Api } from "shared/api/lib";

export class ProductsApi extends Api<Product, UpdateProductRequestBody> {
    protected override baseURL = "/products";
}
