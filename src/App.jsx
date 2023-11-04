// dependencies
import { useEffect, useState } from "react";

// css
import "./styles/index.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loadProfile, setLoadProfile] = useState(false);
  const [profileContent, setProfileContent] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);

    const usernamePattern = /^[a-zA-Z0-9-]{1,39}$/;
    const hyphenPattern = /^(.*[a-zA-Z0-9].*)$/;
    const noLeadingHyphenPattern = /^[^-].*$/;
    const noTrailingHyphenPattern = /^(.*[^-])$/;
    const noConsecutiveHyphensPattern = /^(?!.*--).*$/;

    const isUsernameValid = usernamePattern.test(event.target.value) &&
      hyphenPattern.test(event.target.value) &&
      noLeadingHyphenPattern.test(event.target.value) &&
      noTrailingHyphenPattern.test(event.target.value) &&
      noConsecutiveHyphensPattern.test(event.target.value);

    if (!isUsernameValid) {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(false);
    }
  };

  function handleSearchClick() {
    event.preventDefault();

    if (!showErrorMessage) {
      setLoadProfile(true);

      fetch(`https://api.github.com/users/${inputValue}`)
        .then((response) => response.json())
        .then((data) => {
          setProfileContent(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <main className="flex items-center h-screen justify-center">
      {!loadProfile && (
        <div className="block h-[200px] w-[300px] sm:h-[400px] w-[400px]">
          <form className="p-4" onSubmit={handleSearchClick}>
            <label
              htmlFor="profile-name"
              className="text-white pb-4 block text-center"
            >
              Search for a username on Github
            </label>
            <input
              id="profile-name"
              type="text"
              className="text-black p-2 mb-2 text-center w-full border border-gray-300 focus:border-indigo-500 invalid:border-red-500 focus:invalid:border-red-500"
              value={inputValue}
              onChange={handleInputChange}
              required
            />
            <button className="p-4 my-2 w-full bg-white text-black uppercase hover:bg-sky-200">
              Search
            </button>
          </form>

          {showErrorMessage && (
            <div className="text-red-400 p-4">
              <ul>
                <li className="pb-4">
                  Usernames can only contain alphanumeric characters or hyphens.
                </li>
                <li className="pb-4">
                  Usernames cannot begin or end with a hyphen.
                </li>
                <li className="pb-4">
                  Usernames must be at least one character long and cannot
                  exceed 39 characters.
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {loadProfile && (
        <div className="p-4 text-center">
          <div className="w-full p-2 bg-sky-50">
            <img
              src={profileContent.avatar_url}
              alt={`${profileContent.login} profile picture`}
            />
          </div>
          <h2 className="text-white text-xl">{profileContent.name}</h2>
          <p className="text-white">{profileContent.bio}</p>
          <a
            href={profileContent.html_url}
            className="text-white underline underline-offset-4 hover:text-sky-200"
          >
            GitHub profile link
          </a>
        </div>
      )}
    </main>
  );
}

export default App;
