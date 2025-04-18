import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { BusinessResult } from "@/types/models/responses/business-result";
import { User } from "@/types/user";
import { BaseService } from "./_base/base-service";
import { UserUpdatePasswordCommand } from "@/types/models/commands/users/user-update-password-command";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { cleanQueryParams } from "@/lib/utils";
import UserCreateByManagerCommand from "@/types/models/commands/users/user-create-by-manager-command";

class UserService extends BaseService<User> {
  constructor() {
    super(Const.USERS);
  }

  public updatePassword = async (
    command: UserUpdatePasswordCommand
  ): Promise<BusinessResult<null>> => {
    return axiosInstance
      .put<BusinessResult<null>>(`${this.endpoint}/password`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getAllByCouncilWithIdeaRequestPending = (
    query?: UserGetAllQuery
  ): Promise<BusinessResult<QueryResult<User>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<User>>>(
        `${this.endpoint}/council/pending-ideas?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getUserByUsernameOrEmail = async (
    keyword: string
  ): Promise<BusinessResult<User>> => {
    try {
      const response = await axiosInstance.get<BusinessResult<User>>(
        `${this.endpoint}/username-or-email`,
        { params: { key: keyword } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };

  public getUserByUsername = async (
    username: string
  ): Promise<BusinessResult<User>> => {
    try {
      const response = await axiosInstance.get<BusinessResult<User>>(
        `${this.endpoint}/${username}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };

  public updateCache = async (
    newCache: object
  ): Promise<BusinessResult<null>> => {
    try {
      const response = await axiosInstance.put<BusinessResult<null>>(
        `${this.endpoint}/update-cache`,
        {
          cache: JSON.stringify(newCache),
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };


  public findAccountRegisteredByGoogle = async (
    token: string
  ): Promise<BusinessResult<null>> => {
    try {
      const response = await axiosInstance.post<BusinessResult<null>>(
        `${this.endpoint}/find-account-registered-by-google`,
        { token: token }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };

  public getAllReviewer = async (): Promise<BusinessResult<User[]>> => {
    const response = await axiosInstance.get<BusinessResult<User[]>>(
      `${this.endpoint}/role/reviewer`
    );
    return response.data;
  };

  public getByEmail = async (
    email: string
  ): Promise<BusinessResult<User>> => {
    try {
      const response = await axiosInstance.get<BusinessResult<User>>(
        `${this.endpoint}/email/${email}`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public createOneStudentByManager = async (command : UserCreateByManagerCommand) : Promise<BusinessResult<User | null>> => {
    const response = await axiosInstance.post<BusinessResult<User | null>>(
        `${this.endpoint}/import/students/one`,
        {
          ...command
        }
    )
    return response.data
  }

  public createManyStudentByManager = async (file: File) : Promise<BusinessResult<User[]>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post<BusinessResult<User[]>>(
        `${this.endpoint}/import/students/many`, formData
    )

    return response.data
  }

  public createOneLecturerByManager = async (command : UserCreateByManagerCommand) : Promise<BusinessResult<User | null>> => {
    const response = await axiosInstance.post<BusinessResult<User | null>>(
        `${this.endpoint}/import/lecturers/one`,
        {
          ...command
        }
    )
    return response.data
  }

  public createManyLecturersByManager = async (file: File) : Promise<BusinessResult<User[]>> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post<BusinessResult<User[]>>(
        `${this.endpoint}/import/lecturers/many`, formData
    )

    return response.data
  }

  public updateExistedUser = async ({users} : {users: User[]}) => {
    const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/import/students/update-existed`, [
        ...users,
    ]);
    return response.data;
  }
}

export const userService = new UserService();
