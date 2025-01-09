import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class GetUserRepost extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Get User Repost",
    request: {
      query: z.object({
        secUid: Str({
          description:
            "Example MS4wLjABAAAAqB08cUbXaDWqbD6MCga2RbGTuhfO2EsHayBYx08NDrN7IE3jQuRDNNN6YwyfH6_6",
        }),
        count: Str({
          default: "30",
        }),
        cursor: Str({
          default: "0",
        }),
      }),
    },
    responses: {
      "200": {
        description: "Return User Repost",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                data: any(),
                message: Str(),
              }),
            }),
          },
        },
      },
      "404": {
        description: "Get user repost not found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                error: Str(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    const result = {
      success: false,
      data: undefined,
      message: undefined,
    };
    try {
      const data = await this.getValidatedData<typeof this.schema>();
      const { secUid, count, cursor } = data.query;
      const options = {
        method: "GET",
        url: c.env.URL + "/api/user/repost",
        params: {
          secUid,
          count,
          cursor,
        },
        headers: {
          "x-rapidapi-key": c.env.API_KEY,
          "x-rapidapi-host": c.env.HOST,
        },
      };
      const response = await axios.request(options);
      if (response?.data) {
        result.data = response.data;
        result.success = true;
      }
    } catch (error) {
      result.message = error.message;
    }

    return result;
  }
}
