/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Booking {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  propertyId?: number;
  userId?: string | null;
  user?: User;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format int32 */
  expectedPeople?: number;
}

export interface BookingWithUserDto {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  propertyId?: number;
  userId?: string | null;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format int32 */
  expectedPeople?: number;
  userFirstName?: string | null;
  userLastName?: string | null;
  userFullName?: string | null;
  /** @format double */
  totalPrice?: number;
  /** @format int32 */
  nights?: number;
}

export interface CreateBookingDto {
  /** @format int32 */
  propertyId?: number;
  userEmail?: string | null;
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format int32 */
  expectedPeople?: number;
}

export interface CreatePostDto {
  title?: string | null;
  content?: string | null;
  authorName?: string | null;
}

export interface InvitationCodeDto {
  /** @format int32 */
  id?: number;
  code?: string | null;
  /** @format date-time */
  createdDate?: string;
  /** @format date-time */
  expiryDate?: string;
  isUsed?: boolean;
  /** @format date-time */
  usedDate?: string | null;
  usedByUserId?: User;
  createdByUser?: string | null;
}

export interface LoginDto {
  email?: string | null;
  password?: string | null;
  rememberMe?: boolean;
}

export interface Payment {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  bookingId?: number;
  /** @format double */
  amount?: number;
  /** @format date-time */
  paymentDate?: string;
}

export interface Post {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  title: string;
  /** @minLength 1 */
  content: string;
  /** @minLength 1 */
  authorId: string;
  authorName?: string | null;
  attachmentFileName?: string | null;
  attachmentOriginalName?: string | null;
  attachmentContentType?: string | null;
  /** @format int64 */
  attachmentSize?: number | null;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface Property {
  /** @format int32 */
  id?: number;
  name?: string | null;
}

export interface UpdateUserDto {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface User {
  id?: string | null;
  userName?: string | null;
  normalizedUserName?: string | null;
  email?: string | null;
  normalizedEmail?: string | null;
  emailConfirmed?: boolean;
  passwordHash?: string | null;
  securityStamp?: string | null;
  concurrencyStamp?: string | null;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  /** @format date-time */
  lockoutEnd?: string | null;
  lockoutEnabled?: boolean;
  /** @format int32 */
  accessFailedCount?: number;
  firstName?: string | null;
  lastName?: string | null;
  bookings?: Booking[] | null;
}

export interface UserDto {
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  invitationCode?: string | null;
}

export interface UserListDto {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  /** @format date-time */
  nextBookingDate?: string | null;
  nextBookingPropertyName?: string | null;
}

export interface UserProfileDto {
  id?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  isAdmin?: boolean;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Risager API
 * @version v1
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Booking
     * @name BookingsList
     * @request GET:/api/Bookings
     */
    bookingsList: (params: RequestParams = {}) =>
      this.request<BookingWithUserDto[], any>({
        path: `/api/Bookings`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Booking
     * @name BookingsCreate
     * @request POST:/api/Bookings
     */
    bookingsCreate: (data: CreateBookingDto, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/Bookings`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Booking
     * @name BookingsPropertyDetail
     * @request GET:/api/Bookings/property/{propertyId}
     */
    bookingsPropertyDetail: (propertyId: number, params: RequestParams = {}) =>
      this.request<BookingWithUserDto[], any>({
        path: `/api/Bookings/property/${propertyId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Booking
     * @name BookingsFutureList
     * @request GET:/api/Bookings/future
     */
    bookingsFutureList: (params: RequestParams = {}) =>
      this.request<BookingWithUserDto[], any>({
        path: `/api/Bookings/future`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Booking
     * @name BookingsPropertyFutureList
     * @request GET:/api/Bookings/property/{propertyId}/future
     */
    bookingsPropertyFutureList: (
      propertyId: number,
      params: RequestParams = {},
    ) =>
      this.request<BookingWithUserDto[], any>({
        path: `/api/Bookings/property/${propertyId}/future`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Booking
     * @name BookingsDelete
     * @request DELETE:/api/Bookings/{id}
     */
    bookingsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Bookings/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Health
     * @name HealthList
     * @request GET:/api/Health
     */
    healthList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Health`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payment
     * @name PaymentsList
     * @request GET:/api/Payments
     */
    paymentsList: (params: RequestParams = {}) =>
      this.request<Payment[], any>({
        path: `/api/Payments`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payment
     * @name PaymentsCreate
     * @request POST:/api/Payments
     */
    paymentsCreate: (data: Payment, params: RequestParams = {}) =>
      this.request<Payment, any>({
        path: `/api/Payments`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostsList
     * @request GET:/api/Posts
     */
    postsList: (params: RequestParams = {}) =>
      this.request<Post[], any>({
        path: `/api/Posts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostsCreate
     * @request POST:/api/Posts
     */
    postsCreate: (data: CreatePostDto, params: RequestParams = {}) =>
      this.request<Post, any>({
        path: `/api/Posts`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostsWithFileCreate
     * @request POST:/api/Posts/with-file
     */
    postsWithFileCreate: (
      data: {
        title?: string;
        content?: string;
        authorName?: string;
        /** @format binary */
        file?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Post, any>({
        path: `/api/Posts/with-file`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostsDownloadDetail
     * @request GET:/api/Posts/download/{postId}
     */
    postsDownloadDetail: (postId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Posts/download/${postId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Post
     * @name PostsDelete
     * @request DELETE:/api/Posts/{id}
     */
    postsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Posts/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertysList
     * @request GET:/api/Propertys
     */
    propertysList: (params: RequestParams = {}) =>
      this.request<Property[], any>({
        path: `/api/Propertys`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertysCreate
     * @request POST:/api/Propertys
     */
    propertysCreate: (data: Property, params: RequestParams = {}) =>
      this.request<Property, any>({
        path: `/api/Propertys`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserRegisterCreate
     * @request POST:/api/User/register
     */
    userRegisterCreate: (data: UserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserLoginCreate
     * @request POST:/api/User/login
     */
    userLoginCreate: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserProfileList
     * @request GET:/api/User/profile
     */
    userProfileList: (params: RequestParams = {}) =>
      this.request<UserProfileDto, any>({
        path: `/api/User/profile`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserProfileUpdate
     * @request PUT:/api/User/profile
     */
    userProfileUpdate: (data: UpdateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/profile`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserAllList
     * @request GET:/api/User/all
     */
    userAllList: (params: RequestParams = {}) =>
      this.request<UserListDto[], any>({
        path: `/api/User/all`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserDebugBookingsList
     * @request GET:/api/User/debug-bookings
     */
    userDebugBookingsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/User/debug-bookings`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserInvitationCodesCreate
     * @request POST:/api/User/invitation-codes
     */
    userInvitationCodesCreate: (params: RequestParams = {}) =>
      this.request<InvitationCodeDto, any>({
        path: `/api/User/invitation-codes`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserInvitationCodesList
     * @request GET:/api/User/invitation-codes
     */
    userInvitationCodesList: (params: RequestParams = {}) =>
      this.request<InvitationCodeDto[], any>({
        path: `/api/User/invitation-codes`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
