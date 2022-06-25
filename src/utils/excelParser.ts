import ExcelJS from "exceljs";

type Line = { [key: string | number]: unknown } & { Handle: string };

class ExcelParser {
  __WorkBook__: ExcelJS.Workbook;

  constructor() {
    this.__WorkBook__ = new ExcelJS.Workbook();
  }

  static formateProduct(lines: Line[]) {
    const keyMap: { [key: string]: string } = {
      Handle: "handle",
      Title: "title",
      "Body (HTML)": "body_html",
      Type: "product_type",
    };
    const product: { [key: string]: any } = {
      images: [],
      options: [],
      variants: [],
    };
    lines.forEach((line) => {
      ["Handle", "Title", "Body (HTML)", "Type"].forEach((key) => {
        if (line[key]) {
          product[keyMap[key]] = line[key];
        }
      });
      if (line["Image Src"]) {
        product.images.push({ src: line["Image Src"] });
      }
      if (line["Option1 Name"]) {
        product.options[0] = product.options[0] || {};
        product.options[0].name = line["Option1 Name"];
      }
      if (line["Option1 Value"]) {
        product.options[0] = product.options[0] || {};
        product.options[0].values = product.options[0].values || [];
        if (!product.options[0].values.includes(line["Option1 Value"])) {
          product.options[0].values.push(line["Option1 Value"]);
        }
      }
      if (line["Option1 Value"]) {
        let variant: { [key: string]: any } = {};

        variant.option1 = line["Option1 Value"];

        if (line["Variant Price"]) {
          variant.price = line["Variant Price"];
        }
        if (line["Variant Compare At Price"]) {
          variant.compare_at_price = line["Variant Compare At Price"];
        }
        product.variants.push(variant);
      }
    });
    return product;
  }
  async readFile(file: string) {
    await this.__WorkBook__.xlsx.readFile(file);
  }

  parse(sheet: string | number): Line[] {
    const worksheet = this.__WorkBook__.getWorksheet(sheet);
    const res: Line[] = [];
    let header: ExcelJS.CellValue[];
    worksheet.eachRow(function (row, rowNumber) {
      if (rowNumber == 1) {
        header = <ExcelJS.CellValue[]>row.values;
        return;
      }
      const item: { [key: string]: any } = {};
      row.eachCell(function (cell, colNumber) {
        item[<string>header[colNumber]] = cell.value;
      });
      res.push(item as Line);
    });

    return res;
  }
}

export default ExcelParser;
