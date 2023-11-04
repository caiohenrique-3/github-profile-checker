// dependencies
import { useState } from "react";

// css
import "./styles/index.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loadProfile, setLoadProfile] = useState(false);
  const [profileContent, setProfileContent] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

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

  function handleSearchClick(event) {
    event.preventDefault();

    if (!showErrorMessage) {
      setLoadProfile(true);

      fetch(`https://api.github.com/users/${inputValue}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.message === "Not Found") {
            throw new Error("User not found");
          }
          setProfileContent(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoadProfile(false);
          setShowErrorMessage(true);
          setShowPopup(true);
          resetApp();
        });
    }
  }

  function resetApp() {
    setInputValue("");
    setShowErrorMessage(false);
    setLoadProfile(false);
    setShowPopup(true);
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

      {showPopup && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      User Not Found
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        The username you entered does not exist on GitHub.
                        Please try again with a different username.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
