import React, { Component } from "react";
import queryString from "query-string";
import Grid from "../../common/Grid";
import P from "../../common/P";
import styled from "styled-components";
import { ReactMic } from "react-mic";

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  padding: 0 20px;
  border: 0.5px solid gray;
  :focus {
    outline-width: 0;
  }
`;

const AudioSearch = styled.button`
  width: 90%;
  height: 100%;
  border-radius: 50px;
  color: white;
  margin: auto;
  font-size: ${props => props.theme.font.xxl};
  background: ${props => props.theme.color.greenGradient};
  padding: 0 20px;
  border: none;
  :focus {
    outline-width: 0;
  }
`;
class Search extends Component {
  state = {
    searchInput: "",
    recording: false,
    file: {}
  };

  getAccessToken = () => {
    const hash = queryString.parse(window.location.hash);
    return hash.access_token;
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getPlayer = e => {
    e.preventDefault();
    const access_token = this.getAccessToken();

    fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(data => data.json())
      .then(result => console.log(result))
      .catch(error => console.error(error));
  };

  toggleRecording = () => {
    const { recording } = this.state;
    // console.log("Recording", recording);
    this.setState({ recording: !recording });
  };

  onData = recordedBlob => {
    // console.log("chunk of real-time data is: ", recordedBlob);
  };
  onStop = recordedBlob => {
    // console.log("stopped");
    this.setState({ file: recordedBlob });
    console.log("Making req");
    // this.props.audioSearch(recordedBlob);
  };

  render() {
    const { searchInput, recording } = this.state;
    const { handleSearch } = this.props;

    return (
      <Grid direction="row" space={4}>
        <Grid direction="column" templateColumn="4fr 1fr">
          <form onSubmit={e => handleSearch(e, searchInput)}>
            <SearchInput
              placeholder="Search track..."
              type="text"
              value={searchInput}
              onChange={this.handleChange}
              name="searchInput"
            />
          </form>

          <AudioSearch onClick={this.toggleRecording}>
            {recording ? (
              <ReactMic
                className="recorder"
                record={this.state.recording}
                onStop={this.onStop}
                onData={this.onData}
              />
            ) : (
              <P font="xxl">Search Audio</P>
            )}
          </AudioSearch>
          {/* <audio controls src={this.state.file.blobURL}></audio> */}
        </Grid>
      </Grid>
    );
  }
}
export default Search;
