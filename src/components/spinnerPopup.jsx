import React from "react";
import Spinner from "react-bootstrap/Spinner";

import Navigator from "./navigator";

let app = null;

class SpinnerPopup extends React.Component {
  constructor(props) {
    super(props);
    console.log("SpinnerPopup.constructor");
    app = this;

    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log("SpinnerPopup.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("SpinnerPopup render");

    return (
      <div>
        <Navigator />
        <div className="popup_spinner">
          <div className="popup_spinner_inner" alignItems="center">
            {/*             <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>{this.props.title}</p>
            </div> */}
            {/* <div style={{ marginLeft: "-60px" }}> */}
            <div>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpinnerPopup;
