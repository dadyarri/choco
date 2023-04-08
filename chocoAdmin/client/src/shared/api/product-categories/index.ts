import { ProductCategory } from "entities";
import { UpdateProductCategoryRequestBody } from "services/request-bodies";
import { ModelApi } from "shared/api/lib";

export class ProductCategoriesApi extends ModelApi<ProductCategory, UpdateProductCategoryRequestBody> {
    protected override baseURL = "/productCategories";
}
