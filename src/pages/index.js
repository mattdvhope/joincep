import React from "react"
import { Link } from "gatsby"

export default () => (
  <div>
    <p>In Join CEP!!</p>
    <Link to="/account/">Go to your account</Link>

    <h2>
      <a
        href={`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1654045933&redirect_uri=${process.env.GATSBY_API_URL}&state=${makeState(10)}&scope=profile%20openid&max_age=360000&ui_locales=th&bot_prompt=aggressive`}
        style={{
          color: `rgb(45, 49, 121)`,
          fontFamily: `Athiti`,
        }}
      >
        Click here to enter via LINE
      </a>
    </h2>
  </div>
)

function makeState(length) {
   let result           = '';
   let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}