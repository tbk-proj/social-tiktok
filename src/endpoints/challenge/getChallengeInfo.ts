import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class GetChallengeInfo extends OpenAPIRoute {
  schema = {
    tags: ["Challenge"],
    summary: "Get Challenge Info",
    request: {
      query: z.object({
        challengeName: Str({
          description: "Example xh",
        }),
      }),
    },
    responses: {
      "200": {
        description: "Return Challenge Info",
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
        description: "Get challenge info not found",
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
      const { challengeName } = data.query;
      const options = {
        method: 'GET',
        url: c.env.URL + '/api/challenge/info',
        params: {
          challengeName
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
