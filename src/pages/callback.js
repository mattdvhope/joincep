import React from "react"
import { Link } from "gatsby"
import { logout } from "../utils/auth"

export default class Callback extends React.Component {
  constructor(props) {
    super();
    this.state = { 
      data: [],
      window: undefined
    };


  }

  async componentDidMount() {   
    this.setState({ window: window });

    if (!sessionStorage.getItem("person") || sessionStorage.getItem("person") === "null") {
      // 1. getting id_token
      const code = window.location.search.match(/(?<=code=)(.*)(?=&state)/)[0]
      const params = `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.GATSBY_API_URL}&client_id=1654045933&client_secret=fada8f346cb8e9092ad92d7ff4b10675`;
      const response = await fetch(`https://api.line.me/oauth2/v2.1/token`, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: params
      })
      const json = await response.json();
      // 2. getting user info with id_token
      const personal_data = await fetch(`https://api.line.me/oauth2/v2.1/verify`, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `id_token=${json.id_token}&client_id=1654045933`
      });
      const person = await personal_data.json()
      // 3. personal data from LINE login
      sessionStorage.setItem("person", JSON.stringify(person))
      console.log("personal_data in componentDidMount: ", person)
      this.setState({ data: person });
    }
  }

  render() {
    if (this.state.window) {
      const personal_data = JSON.parse(sessionStorage.getItem("person"));

      console.log("this.state.data: ", personal_data)
      console.log("this.state.data: ", this.state.data)

      return(
        <>
        <p>Callback</p>
        <nav>
            <Link to="/">Home</Link>{" "}
            <Link to="/account/">My Account</Link>{" "}
            <div>
              <p>
                name: {personal_data ? personal_data.name : "Name not known"}
              </p>
            </div>
            <a
                  href="#logout"
                  onClick={e => {
                    logout()
                    e.preventDefault()
                  }}
                >
                  Log Out
                </a>
        </nav>
        </>
      )
    } else {
      return <span />
    }
  }


}