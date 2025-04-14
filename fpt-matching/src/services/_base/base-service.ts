import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import {
  CreateCommand,
  UpdateCommand,
} from "@/types/models/commands/_base/base-command";

export class BaseService<T> {
  public endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public fetchAll = async (
    query?: BaseQueryableQuery
  ): Promise<BusinessResult<QueryResult<T>>> => {
    try {
      const cleanedQuery = cleanQueryParams(query);
      const response = await axiosInstance.get<BusinessResult<QueryResult<T>>>(
        `${this.endpoint}?${cleanedQuery}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public fetchById = async (id: string): Promise<BusinessResult<T>> => {
    try {
      const response = await axiosInstance.get<BusinessResult<T>>(
        `${this.endpoint}/${id}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public create = async (command: CreateCommand): Promise<BusinessResult<T>> => {
    try {
      const response = await axiosInstance.post<BusinessResult<T>>(
        this.endpoint,
        command
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public update = async (command: UpdateCommand): Promise<BusinessResult<T>> => {
    try {
      const response = await axiosInstance.put<BusinessResult<T>>(
        this.endpoint,
        command
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public restore = async (command: UpdateCommand): Promise<BusinessResult<T>> => {
    try {
      const response = await axiosInstance.put<BusinessResult<T>>(
        `${this.endpoint}/restore`,
        command
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public delete = async (id: string): Promise<BusinessResult<null>> => {
    try {
      const response = await axiosInstance.delete<BusinessResult<null>>(
        `${this.endpoint}?id=${id}&isPermanent=false`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public deletePermanent = async (id: string): Promise<BusinessResult<null>> => {
    try {
      const response = await axiosInstance.delete<BusinessResult<null>>(
        `${this.endpoint}?id=${id}&isPermanent=true`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  protected handleError(error: any) {
    console.error(`${this.endpoint} API Error:`, error);
    return Promise.reject(error);
  }
}