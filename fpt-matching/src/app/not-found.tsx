"use client"
import ErrorHttp from "@/components/_common/errors/error-http";

export default function Page() {
  return <ErrorHttp statusCode={404} />;
}
