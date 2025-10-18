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

export interface LoginDto {
  username?: string | null;
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

export interface Property {
  /** @format int32 */
  id?: number;
  name?: string | null;
  address?: string | null;
  /** @format double */
  price?: number;
}

export interface UpdateUserDto {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface UserDto {
  username?: string | null;
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  invitationCode?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title My API
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
      this.request<void, any>({
        path: `/api/Bookings`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Booking
     * @name BookingsCreate
     * @request POST:/api/Bookings
     */
    bookingsCreate: (data: Booking, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Bookings`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
      this.request<void, any>({
        path: `/api/Bookings/property/${propertyId}`,
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
     * @tags Payment
     * @name PaymentsList
     * @request GET:/api/Payments
     */
    paymentsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Payments`,
        method: "GET",
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
      this.request<void, any>({
        path: `/api/Payments`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
      this.request<void, any>({
        path: `/api/Posts`,
        method: "GET",
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
      this.request<void, any>({
        path: `/api/Posts`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
      this.request<void, any>({
        path: `/api/Posts/with-file`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
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
      this.request<void, any>({
        path: `/api/Propertys`,
        method: "GET",
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
      this.request<void, any>({
        path: `/api/Propertys`,
        method: "POST",
        body: data,
        type: ContentType.Json,
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
      this.request<void, any>({
        path: `/api/User/profile`,
        method: "GET",
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
      this.request<void, any>({
        path: `/api/User/all`,
        method: "GET",
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
      this.request<void, any>({
        path: `/api/User/invitation-codes`,
        method: "POST",
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
      this.request<void, any>({
        path: `/api/User/invitation-codes`,
        method: "GET",
        ...params,
      }),
  };
}
