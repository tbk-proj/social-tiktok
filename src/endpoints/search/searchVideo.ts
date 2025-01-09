import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class SearchVideo extends OpenAPIRoute {
  schema = {
    tags: ["Search"],
    summary: "Search Video",
    request: {
      query: z.object({
        keyword: Str({
          description: "Example cat",
        }),
        cursor: Str({
          default: "0",
        }),
        search_id: Str({
          default: "0",
        }),
      }),
    },
    responses: {
      "200": {
        description: "Return Search Video",
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
        description: "Search video not found",
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
      const { keyword, cursor, search_id } = data.query;
      const options = {
        method: "GET",
        url: c.env.URL + c.env.URL + c.env.URL + "/api/search/video",
        params: {
          keyword,
          cursor,
          search_id,
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
