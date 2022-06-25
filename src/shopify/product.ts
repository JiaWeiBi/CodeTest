import { Response, Request } from "express";
import Shopify, { DataType } from "@shopify/shopify-api";

const ShopUrl: string = process.env.ShopUrl || "";
const AccessToken: string = process.env.AccessToken || "";

const client = new Shopify.Clients.Rest(ShopUrl, AccessToken);

export const importProducts = async (req: Request, res: Response) => {
  const products = req.body.products;

  for (let index in products) {
    try {
      await client.post({
        path: "products",
        data: { product: products[index] },
        type: DataType.JSON,
      });
    } catch (e) {
      console.log("err====", e, products[index], products[index].variants);
      return res.status(400).end();
    }
  }

  return res.status(200).end();
};
