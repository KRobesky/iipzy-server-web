import React from "react";

import Navigator from "./navigator";

let app = null;

class DownloadWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("DownloadWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("DownloadWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  componentWillUnmount() {
    console.log("DownloadWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  /*
              <br />The NanoPi R4S can be found at{" "}
            <a href="https://www.amazon.com/FriendlyElec-OpenWRT-Dual-Gbps-Ethernet-Gateway/dp/B08PV4228F/ref=sxts_rp_s_a_1_0?content-id=amzn1.sym.3432eb1a-1558-4445-9430-9bb3e7f7b9b7%3Aamzn1.sym.3432eb1a-1558-4445-9430-9bb3e7f7b9b7&crid=30OJGJPB4KYEQ&cv_ct_cx=nanopi%2Br4s&keywords=nanopi%2Br4s&pd_rd_i=B08PV4228F&pd_rd_r=4f14af91-d9b7-4809-a181-4382d2cc190e&pd_rd_w=z6Fcw&pd_rd_wg=4uEXm&pf_rd_p=3432eb1a-1558-4445-9430-9bb3e7f7b9b7&pf_rd_r=SNZJW1ZHJW7CP6K9EHRV&qid=1683063967&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=nanopi%2Br4s%2Caps%2C135&sr=1-1-5985efba-8948-4f09-9122-d605505c9d1e&ufe=app_do%3Aamzn1.fos.18ed3cb5-28d5-4975-8bc7-93deae8f9840&th=1">
              here
            </a>
            <br />
            <br />You'll also need a power supply.  A good choice is{" "}
            <a href="https://www.amazon.com/CanaKit-Raspberry-Power-Supply-USB-C/dp/B07TYQRXTK/ref=pd_bxgy_vft_none_sccl_1/145-5946572-5530057?pd_rd_w=Hci82&content-id=amzn1.sym.26a5c67f-1a30-486b-bb90-b523ad38d5a0&pf_rd_p=26a5c67f-1a30-486b-bb90-b523ad38d5a0&pf_rd_r=HJDVY0011YS55XSD4DT3&pd_rd_wg=i0zEH&pd_rd_r=ddd24b26-2410-4359-b5ba-7dc5b2ccb416&pd_rd_i=B07TYQRXTK&psc=1">
              here
            </a>
            <br />
            <br />A good choice for a Micro SD Card is{" "}
            <a href="https://www.amazon.com/Transcend-MicroSDHC-Memory-Adapter-TS8GUSDU1/dp/B00BDS426G/ref=sr_1_1?crid=20GSBJO9DI9GY&keywords=transcend+8gb+micro+sd+card&qid=1683064793&sprefix=transcend+8gb+micro+sd+card%2Cspecialty-aps%2C122&sr=8-1">
              here
            </a>
            <br />
            <br />
            Download the Sentinel NanoPi R4s image{" "}
            <a href="https://iipzy.net:8001/api/clientupdate//bacec2a221264e32bdc3aa886e80a1b1">
              here
            </a>
            <br />
  */

  render() {
    console.log("DownloadWindow.render");

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>
            Download iipzy Sentinel Nano Pi R4S Image
          </p>
        </div>
        <div style={{ marginLeft: 20, textAlign: "left", fontWeight: "normal" }}>
          <p>
            You'll need a NanoPi R4S with 4GB (or more) of memory and
            an 8 GB (or larger) Micro SD Memory Card. <br />
            <br />The NanoPi R4S can be found at{" "}
            <a href="https://www.amazon.com/FriendlyElec-OpenWRT-Dual-Gbps-Ethernet-Gateway/dp/B08PV4228F/ref=sxts_rp_s_a_1_0?content-id=amzn1.sym.3432eb1a-1558-4445-9430-9bb3e7f7b9b7%3Aamzn1.sym.3432eb1a-1558-4445-9430-9bb3e7f7b9b7&crid=30OJGJPB4KYEQ&cv_ct_cx=nanopi%2Br4s&keywords=nanopi%2Br4s&pd_rd_i=B08PV4228F&pd_rd_r=4f14af91-d9b7-4809-a181-4382d2cc190e&pd_rd_w=z6Fcw&pd_rd_wg=4uEXm&pf_rd_p=3432eb1a-1558-4445-9430-9bb3e7f7b9b7&pf_rd_r=SNZJW1ZHJW7CP6K9EHRV&qid=1683063967&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=nanopi%2Br4s%2Caps%2C135&sr=1-1-5985efba-8948-4f09-9122-d605505c9d1e&ufe=app_do%3Aamzn1.fos.18ed3cb5-28d5-4975-8bc7-93deae8f9840&th=1">
              here
            </a>
            <br />
            <br />You'll also need a power supply.  A good choice is{" "}
            <a href="https://www.amazon.com/CanaKit-Raspberry-Power-Supply-USB-C/dp/B07TYQRXTK/ref=pd_bxgy_vft_none_sccl_1/145-5946572-5530057?pd_rd_w=Hci82&content-id=amzn1.sym.26a5c67f-1a30-486b-bb90-b523ad38d5a0&pf_rd_p=26a5c67f-1a30-486b-bb90-b523ad38d5a0&pf_rd_r=HJDVY0011YS55XSD4DT3&pd_rd_wg=i0zEH&pd_rd_r=ddd24b26-2410-4359-b5ba-7dc5b2ccb416&pd_rd_i=B07TYQRXTK&psc=1">
              here
            </a>
            <br />
            <br />A good choice for a Micro SD Card is{" "}
            <a href="https://www.amazon.com/Transcend-MicroSDHC-Memory-Adapter-TS8GUSDU1/dp/B00BDS426G/ref=sr_1_1?crid=20GSBJO9DI9GY&keywords=transcend+8gb+micro+sd+card&qid=1683064793&sprefix=transcend+8gb+micro+sd+card%2Cspecialty-aps%2C122&sr=8-1">
              here
            </a>
            <br />
            <br />
            Download the Sentinel NanoPi R4s image{" "}
            <a href="https://iipzy.net:8001/api/clientupdate//bacec2a221264e32bdc3aa886e80a1b1">
              here
            </a>
            <br />
            <br />
            I recommend you use balenaEtcher to burn the Sentinel NanoPi R4S
            image to the Micro SD Card.
            <br />
            You can find balanaEtcher{" "}
            <a href="https://www.balena.io/etcher/">here</a>
            <br />
            <br />
            Install the Micro SD Card with the image into the NanoPi R4S.
            &nbsp;&nbsp; Connect the NanoPi to the power
            supply.&nbsp;&nbsp;The red PWR led, that can be seen from the top,
            will light if power is on.&nbsp;&nbsp;Connect the Nano Pi to
            your local network.&nbsp;&nbsp;The iipzy Sentinel will then
            connect to the iipzy service.&nbsp;&nbsp;Once you have registered
            and logged in, you can connect to the iipzy Sentinel by
            clicking on <strong>Sentinel</strong> above.
          </p>
        </div>
      </div>
    );
  }
}

export default DownloadWindow;
