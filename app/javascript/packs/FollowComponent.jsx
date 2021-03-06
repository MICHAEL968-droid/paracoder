import React from "react";
import ReactDOM from "react-dom";
import Axios from "axios";

class FollowComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isFollowing: props.isFollowing,
            numberFollowing: props.numberFollowing,
            investId: props.investId};

        this.followClicked = this.followClicked.bind(this);
    }

    followClicked() {
        // TODO: move this config somewhere else
        const tokenDom = document.querySelector("meta[name=csrf-token]");
        if (tokenDom) {
            const csrfToken = tokenDom.content;
            Axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
        }
        Axios.defaults.headers.common["Content-Type"] = "application/json";

        Axios.post("/invests/" + this.state.investId + "/follows")
            .then((response) => {
                this.setState({
                    isFollowing: response.data["is_following"],
                    numberFollowing: response.data["number_following"]
                });
            })
            .catch((error) => {
                // TODO: handle this error in some way
            });
    }

    render() {
        if (this.state.isFollowing) {
            return (
                <button onClick={this.followClicked} className="main-shadow-alt bg-near-white near-black ph2 pv1 f6 ttu p-font bw0 fr pointer">
                    <i className="far fa-check-square mr2 pl0 ml0"></i>
                    following <span className="bl b--near-black tr pl2 pr0 ml1 pl1">{ this.state.numberFollowing }</span>
                </button>
            );
        } else {
            return (
                <button onClick={this.followClicked} className="main-shadow-alt bg-near-white near-black ph2 pv1 f6 ttu p-font bw0 fr pointer">
                    <i className="far fa-square mr2 pl0 ml0"></i>
                    following <span className="bl b--near-black tr pl2 pr0 ml1 pl1">{ this.state.numberFollowing }</span>
                </button>
            );
        }
    }
}

document.addEventListener("turbolinks:load", () => {
    const dataTag = document.getElementById("followContainer");
    if (dataTag) {
        const isFollowing = JSON.parse(dataTag.getAttribute("data-isfollowing"));
        const numberFollowing = JSON.parse(dataTag.getAttribute("data-numfollowing"));
        const investId = JSON.parse(dataTag.getAttribute("data-investid"));

        ReactDOM.render(
            <FollowComponent investId={investId} numberFollowing={numberFollowing} isFollowing={isFollowing}/>,
            document.getElementById("followContainer"),
        );
    }
});

document.addEventListener("turbolinks:before-render", () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("followContainer"));
}); 
