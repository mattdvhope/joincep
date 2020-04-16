import auth0 from "auth0-js"

export const isBrowser = typeof window !== "undefined"

const tokens = {
  idToken: false,
  accessToken: false,
}

let protectedRoutes;
let user = {}

export const isAuthenticated = () => {
  return tokens.idToken !== false
}


// LINE info
// {
//   "sub": "line|U1322cdfc6d9326c022e807508314c569",
//   "nickname": "Matt",
//   "name": "Matt",
//   "picture": "https://profile.line-scdn.net/0hFu18iD4fGVoMQTJ5Dm1mDTAEFzd7bx8SdHNWOS0UFWl2JA5ZMndfOyARQj4lcVlfOCMEOS4STm4l",
//   "updated_at": "2020-04-11T13:25:33.876Z"
// }


const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN,
      clientID: process.env.GATSBY_AUTH0_CLIENTID,
      redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
      responseType: "token id_token",
      scope: "openid profile email",
    })
  : {}

export const login = () => {
  if (!isBrowser) {
    return
  }

  auth.authorize()
}

export const logout = () => {
  tokens.accessToken = false
  tokens.idToken = false
  user = {}
  window.localStorage.setItem("isLoggedIn", false)
  auth.logout({
    returnTo: window.location.origin,
  })
}

const setSession = (cb = () => {}) => (err, authResult) => {
  if (err) {
    if (err.error === "login_required") {
      login()
    }
  }
  if (authResult && authResult.accessToken && authResult.idToken) {
    tokens.idToken = authResult.idToken
    tokens.accessToken = authResult.accessToken

    auth.client.userInfo(tokens.accessToken, (_err, userProfile) => {
      user = userProfile
      window.localStorage.setItem("isLoggedIn", true)

      cb()
    })
  }
}

export const checkSession = callback => {
  console.log("in checkSession");
  const isLoggedIn = window.localStorage.getItem("isLoggedIn")

  if (isLoggedIn === "false" || isLoggedIn === null) {
    protectedRoutes = [`/account`, `/callback`];
    callback()
  } else {
    protectedRoutes = [`/account`, `/callback`, `/`];
  }
  console.log("current protectedRoutes: ", protectedRoutes);
  const isProtectedRoute = protectedRoutes
    .map(route => window.location.pathname.includes(route))
    .some(route => route)
  console.log("isProtectedRoute: ", isProtectedRoute);
  if (isProtectedRoute) {
    auth.checkSession({}, setSession(callback))
  }
}

export const handleAuthentication = () => {
  auth.parseHash(setSession())
}

export const getProfile = () => {
  return user
}
