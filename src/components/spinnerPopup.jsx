import React from "react";
import Spinner from "react-bootstrap/Spinner";

import Navigator from "./navigator";

let app = null;

class SpinnerPopup extends React.Component {
  constructor(props) {
    super(props);
    app = this;
  }

  getInfoMessage() {
    return this.props.getInfoMessage();
  }

  handleSubmitClick(ev) {
    console.log("...Popup handleSubmitClick");
    this.props.closePopup();
  }

  render() {
    console.log("SpinnerPopup render");

    return (
      <div>
        <Navigator />
        {/*         <div className="popup_spinner"> */}
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
        {/*         </div> */}
      </div>
    );
  }
}

export default SpinnerPopup;
