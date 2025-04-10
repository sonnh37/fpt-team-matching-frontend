import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { vi } from "date-fns/locale";
import * as XLSX from "xlsx"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

export const getFileNameFromUrl = (url: string) => {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];

  const fileName = lastPart.split("?")[0];

  return fileName.split("#")[0];
};

export const getPreviewUrl = (fileUrl: string) => {
  if (fileUrl.includes("cloudinary.com")) {
    return fileUrl.replace("/raw/", "/image/");
  }
  return fileUrl;
};

export const sheet2arr = (sheet) => {
  const result = [];
  let row;
  let rowNum;
  let colNum;
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    row = [];
    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const nextCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
      if (typeof nextCell === "undefined" || nextCell == "") {
      } else row.push(nextCell.w);
    }
    if (row.length > 0) {
      result.push(row);
    }
  }
  return result;
};

export const convertToISODate = (
  date: Date | string | null | undefined
): string | null => {
  if (!date) return null;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.error("Invalid date:", date);
    return null;
  }

  return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
};

export const isValidImage = async (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

export const formatTimeSpan = (time: string): string => {
  const [hours, minutes] = time.split(":");

  return `${hours}:${minutes}:00.0000000`;
};

export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// export function getEnumOptions(enumObject: any) {
//   return Object.keys(enumObject)
//     .filter((key) => isNaN(Number(key)))
//     .map((key) => ({
//       label: key,
//       value: key,
//     }));
// }

export function getEnumOptions(enumObject: any) {
  return Object.keys(enumObject)
    .filter((key) => isNaN(Number(key))) // Lọc ra các key không phải số
    .map((key) => ({
      label: key, // Sử dụng key làm label
      value: enumObject[key], // Sử dụng giá trị thực của enum làm value
    }));
}

type EnumType = { [key: string]: string | number };

export function getEnumLabel<T extends EnumType>(
  enumObj: T,
  value?: T[keyof T]
): string {
  const enumValues = Object.entries(enumObj).filter(([key]) =>
    isNaN(Number(key))
  ); // Lấy các giá trị không phải số
  const found = enumValues.find(([_, enumValue]) => enumValue === value);
  return found ? found[0] : "Unknown";
}

export const formatDate = (
  date: Date | string | undefined | null,
  isShowTime: boolean = false
) => {
  if (!date) return "Không có ngày";
  // 0:00
  const validDate = typeof date === "string" ? new Date(date) : date;
  // 7:00
  if (isNaN(validDate.getTime())) return "Ngày không hợp lệ";

  const formatString = isShowTime ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy";
  return format(validDate, formatString);
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0, // Loại bỏ phần thập phân
  }).format(price);
};

export const convertHtmlToPlainText = (description: string): string => {
  try {
    // Sử dụng DOMParser để chuyển đổi HTML sang text
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, "text/html");
    return doc.body.textContent || ""; // Lấy text thuần từ nội dung HTML
  } catch (error) {
    console.error("Error converting HTML to plain text:", error);
    return ""; // Trả về chuỗi rỗng nếu xảy ra lỗi
  }
};

export function toLocalISOString(date: Date) {
  const tzOffset = date.getTimezoneOffset() * 60000; // Chuyển phút lệch sang milliseconds
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export const cleanQueryParams = (query: BaseQueryableQuery) => {
  const cleanedQuery: Record<string, any> = {};

  for (const key in query) {
    const value = query[key as keyof BaseQueryableQuery];

    // Xử lý trường hợp các giá trị boolean
    if (key.startsWith("is")) {
      if (Array.isArray(value)) {
        // Nếu chứa cả true và false, đặt là undefined
        if (value.includes(true) && value.includes(false)) {
          // cleanedQuery[key] = null;
        } else {
          cleanedQuery[key] = value
            .filter((item) => item !== null)
            .map((item) => item.toString());
        }
      } else if (value !== undefined && value !== null) {
        cleanedQuery[key] = value.toString();
      }
    }
    // Xử lý giá trị array thông thường
    else if (Array.isArray(value)) {
      const filteredArray = value.filter((item) => item !== null);
      if (filteredArray.length > 0) {
        filteredArray.forEach((item, index) => {
          cleanedQuery[`${key}[${index}]`] = item;
        });
      }
    }
    // Xử lý đối tượng: chuyển thành chuỗi JSON
    else if (typeof value === "object" && value !== null) {
      // Convert object to JSON string
      cleanedQuery[key] = JSON.stringify(value); // Convert object to string
    }
    // Xử lý giá trị không phải array hay object
    else if (value !== undefined && value !== null) {
      cleanedQuery[key] = value;
    }
  }

  // Convert object cleanedQuery to query string
  const params = new URLSearchParams();

  for (const key in cleanedQuery) {
    const value = cleanedQuery[key];
    if (Array.isArray(value)) {
      value.forEach((val) => {
        params.append(key, val);
      });
    } else {
      params.append(key, value.toString());
    }
  }

  return params.toString(); // Return as query string
};
