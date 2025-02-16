import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

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

export function getEnumOptions(enumObject: any) {
  return Object.keys(enumObject)
    .filter((key) => isNaN(Number(key))) // Lọc để chỉ lấy tên (không lấy số index)
    .map((key) => ({
      label: key,
      value: enumObject[key].toString(),
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

export const formatDate = (date: Date | string | undefined | null) => {
  if (!date) return "Không có ngày"; // Xử lý khi giá trị không tồn tại
  const validDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(validDate.getTime())) return "Ngày không hợp lệ"; // Xử lý ngày không hợp lệ

  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(validDate);
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
