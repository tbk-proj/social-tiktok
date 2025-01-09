import { Bool, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class GetUserInfo extends OpenAPIRoute {
  schema = {
    tags: ["User"],
    summary: "Get user info",
    request: {
      query: z.object({
        uniqueId: Str({
          description: "Example taylorswift",
        }),
      }),
    },
    responses: {
      "200": {
        description: "Return User Info",
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
        description: "Info user not found",
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
      const { uniqueId } = data.query;
      const options = {
        method: "GET",
        url: c.env.URL + "/api/user/info",
        params: {
          uniqueId,
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
