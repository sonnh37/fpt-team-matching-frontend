"use client"
import Error404 from "@/components/_common/errors/error-404";
import ErrorHttp from "@/components/_common/errors/error-http";

export default function Page() {
  return <ErrorHttp statusCode={404} />;
}
