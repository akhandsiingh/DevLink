const profileReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      }
    case "GET_PROFILE":
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: action.payload,
        loading: false,
      }
    case "GET_PROFILES":
      return {
        ...state,
        profiles: action.payload,
        loading: false,
      }
    case "GET_GITHUB_STATS":
      return {
        ...state,
        githubStats: action.payload,
        loading: false,
      }
    case "GET_MEDIUM_ARTICLES":
      return {
        ...state,
        mediumArticles: action.payload,
        loading: false,
      }
    case "GET_LEETCODE_STATS":
      return {
        ...state,
        leetcodeStats: action.payload,
        loading: false,
      }
    case "GET_HACKERRANK_STATS":
      return {
        ...state,
        hackerrankStats: action.payload,
        loading: false,
      }
    case "GET_LINKEDIN_PROFILE":
      return {
        ...state,
        linkedinProfile: action.payload,
        loading: false,
      }
    case "GET_TWITTER_TWEETS":
      return {
        ...state,
        twitterTweets: action.payload,
        loading: false,
      }
    case "PROFILE_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_PROFILE":
      return {
        ...state,
        profile: null,
        githubStats: null,
        mediumArticles: null,
        leetcodeStats: null,
        hackerrankStats: null,
        linkedinProfile: null,
        twitterTweets: null,
        loading: false,
      }
    default:
      return state
  }
}

export default profileReducer
