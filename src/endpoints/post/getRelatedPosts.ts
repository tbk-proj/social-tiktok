import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class GetRelatedPosts extends OpenAPIRoute {
  schema = {
    tags: ["Post"],
    summary: "Get Related Posts",
    request: {
      query: z.object({
        videoId: Str({
          description: "Video ID",
        }),
        count: Str({
          default: "30",
        }),
        cursor: Str({
          default: 0,
        }),
      }),
    },
    responses: {
      "200": {
        description: "Return Related Posts",
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
        description: "Get related posts not found",
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
      const { videoId, count, cursor } = data.query;
      const options = {
        method: "GET",
        url: c.env.URL + "/api/post/related",
        params: {
          videoId,
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
