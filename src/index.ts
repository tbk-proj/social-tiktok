import { fromHono } from "chanfana";
import { Hono } from "hono";
import { GetUserInfo } from "endpoints/user/getUserInfo";
import { GetUserInfoByID } from "endpoints/user/getUserInfoByID";
import { GetUserFollowers } from "endpoints/user/getUserFollowers";
import { GetUserFollowings } from "endpoints/user/getUserFollowings";
import { GetUserPosts } from "endpoints/user/getUserPosts";
import { GetUserLikedPosts } from "endpoints/user/getUserLikedPosts";
import { GetUserPlaylist } from "endpoints/user/getUserPlaylist";
import { GetUserRepost } from "endpoints/user/getUserRepost";
import { GetUserPopularPosts } from "endpoints/user/getUserPopularPosts";
import { GetUserOldestPosts } from "endpoints/user/getUserOldestPosts";
import { GetPostDetail } from "endpoints/post/getPostDetail";
import { GetCommentsOfPost } from "endpoints/post/getCommentsOfPost";
import { GetRelatedPosts } from "endpoints/post/getRelatedPosts";
import { GetTrendingPosts } from "endpoints/post/getTrendingPosts";
import { GetExplorePosts } from "endpoints/post/getExplorePosts";
import { SearchGeneralTop } from "endpoints/search/searchGeneralTop";
import { SearchVideo } from "endpoints/search/searchVideo";
import { SearchAccount } from "endpoints/search/searchAccount";
import { SearchLive } from "endpoints/search/searchLive";
import { OthersSearchedForSuggestSearch } from "endpoints/search/othersSearchedForSuggestSearch";
import { GetChallengeInfo } from "endpoints/challenge/getChallengeInfo";
import { GetChallengePosts } from "endpoints/challenge/getChallengePosts";
import { basicAuth } from "hono/basic-auth";

export interface Env {
  BASIC_AUTH_USERNAME: string;
  BASIC_AUTH_PASSWORD: string;
}
const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", (c, next) => {
  const username = c.env.BASIC_AUTH_USERNAME;
  const password = c.env.BASIC_AUTH_PASSWORD;
  return basicAuth({ username, password })(c, next);
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// Register OpenAPI endpoints
// User
openapi.get("/api/user/info", GetUserInfo);
openapi.get("/api/user/info-by-id", GetUserInfoByID);
openapi.get("/api/user/followers", GetUserFollowers);
openapi.get("/api/user/followings", GetUserFollowings);
openapi.get("/api/user/posts", GetUserPosts);
openapi.get("/api/user/liked-posts", GetUserLikedPosts);
openapi.get("/api/user/playlist", GetUserPlaylist);
openapi.get("/api/user/repost", GetUserRepost);
openapi.get("/api/user/popular-posts", GetUserPopularPosts);
openapi.get("/api/user/oldest-posts", GetUserOldestPosts);

// Post
openapi.get("/api/post/detail", GetPostDetail);
openapi.get("/api/post/comments", GetCommentsOfPost);
openapi.get("/api/post/related", GetRelatedPosts);
openapi.get("/api/post/trending", GetTrendingPosts);
openapi.get("/api/post/explore", GetExplorePosts);

// Search
openapi.get("/api/search/general", SearchGeneralTop);
openapi.get("/api/search/video", SearchVideo);
openapi.get("/api/search/account", SearchAccount);
openapi.get("/api/search/live", SearchLive);
openapi.get("/api/search/others-searched-for", OthersSearchedForSuggestSearch);

// Challenge
openapi.get("/api/challenge/info", GetChallengeInfo);
openapi.get("/api/challenge/posts", GetChallengePosts);

// Export the Hono app
export default app;
