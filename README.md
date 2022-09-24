# project-sap-backend
Backend piece for project.

# Prerequisites
- NodeJS
- Visual Studio Code (Highly recommedned!)

# Installing and Running Locally
Once the repository is pulled down, run `npm install` to download and install all node dependencies.

Create `.env` in root repository directory if `.env` not created yet. Copy all updated environment variables in Discord channel #important to `.env`.

Once installation has finished run `npm run start` to run the API. 

### Making API Calls
For the purposes of testing locally, we can use `curl` to touch the endpoints and get their responses. Long term we might find use for testing suites like [Postman](https://www.postman.com/) to simplify the more complex endpoints.

# TODOs (move to Jira later???)
- Add testing
  - Jest is a popular node based test package. But needs to be compatible with Express.
- Determine proper proper file layout