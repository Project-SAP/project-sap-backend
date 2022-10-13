# project-sap-backend

Backend piece for project.

# Prerequisites

-   NodeJS
-   Visual Studio Code (Highly recommedned!)

# Installing and Running Locally

Once the repository is pulled down, run `npm install` to download and install all node dependencies.

Create `.env` in root repository directory if `.env` not created yet. Copy all updated environment variables in Discord channel #important to `.env`.

Once installation has finished run `npm run start` to run the API.

# Visual Studio Code Recommended Plugins

There are a few plugins to make development easier for nodeJS projects. The plugins should be recommended when opening the folder in VScode, but for reference, here are the same plugins:

-   JS and TS support: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next
-   Auto Import: https://marketplace.visualstudio.com/items?itemName=NuclleaR.vscode-extension-auto-import
-   Prettier: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
-   Jest Runner: https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner
-   Jest Snippets: https://marketplace.visualstudio.com/items?itemName=andys8.jest-snippets

Optional, but still recommended

-   TODO tree: https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree
-   Markdown All In One: https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one

### Making API Calls

For the purposes of testing locally, we can use `curl` to touch the endpoints and get their responses. Long term we might find use for testing suites like [Postman](https://www.postman.com/) to simplify the more complex endpoints.

### Controller setup

Endpoints will lie within controller classes. These classes are defined with the help of decorators.
See: https://www.npmjs.com/package/@decorators/express for examples of how this is done.
They are then attached to the main application in the ServerApplication class.
