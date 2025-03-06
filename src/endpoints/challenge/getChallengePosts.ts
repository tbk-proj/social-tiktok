import { Bool, Num, OpenAPIRoute, Str } from "chanfana";
import { any, z } from "zod";
import axios from "axios";

export class GetChallengePosts extends OpenAPIRoute {
  schema = {
    tags: ["Challenge"],
    summary: "Get Challenge Posts",
    request: {
      query: z.object({
        challengeId: Str({
          description: "Challenge ID"
        }),
        count: Str({
          default: "30"
        }),
        cursor: Str({
          default: "0"
        })
      })
    },
    responses: {
      "200": {
        description: "Return Challenge Posts",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                data: any(),
                message: Str()
              })
            })
          }
        }
      },
      "404": {
        description: "Get challenge posts not found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                error: Str()
              })
            })
          }
        }
      }
    }
  };

  async handle(c) {
    const result = {
      success: false,
      data: undefined,
      message: undefined
    };
    try {
      const data = await this.getValidatedData<typeof this.schema>();
      const { challengeId, count, cursor } = data.query;
      const options = {
        method: "GET",
        url: c.env.URL + "/api/challenge/posts",
        params: {
          challengeId,
          count,
          cursor
        },
        headers: {
          "x-rapidapi-key": c.env.API_KEY,
          "x-rapidapi-host": c.env.HOST
        }
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
