import ExcelParser from "../../src/utils/excelParser";
import request from "supertest";
import app from "../../src/app";
import { expect } from "chai";
import path from "path";

describe("Shopify test", function () {
  describe("Product", function () {
    it("import in REST", async function () {
      this.timeout(0);
      this.slow(60000);
      const excelParser = new ExcelParser();
      await excelParser.readFile(path.join(__dirname, "../jewelery.xlsx"));
      let lines = await excelParser.parse("jewelery");
      let lineMap: { [key: string]: any } = {};
      lines.forEach((item) => {
        if (!lineMap[item["Handle"]]) {
          lineMap[item["Handle"]] = [];
        }

        lineMap[item["Handle"]].push(item);
      });
      const products: any[] = [];

      for (let key in lineMap) {
        products.push(ExcelParser.formateProduct(lineMap[key]));
      }
      const res = await request(app).post("/product").send({ products });
      expect(res.status).equal(200);
    });
  });
});
