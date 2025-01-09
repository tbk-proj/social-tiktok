import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class GetExplorePosts extends OpenAPIRoute {
  schema = {
    tags: ["Post"],
    summary: "Get Explore Posts",
    request: {
      query: z.object({
        count: Str({
          default: "16",
        }),
        categoryType: Str({
          description: "Category Type",
          default: "119",
        }),
      }),
    },
    responses: {
      "200": {
        description: "Return Explore Posts",
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
        description: "Get explore posts not found",
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
      const { categoryType, count } = data.query;
      const options = {
        method: "GET",
        url: c.env.URL + "/api/post/explore",
        params: {
          categoryType,
          count,
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
