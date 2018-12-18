# GO1 Base React App [![build status](https://code.go1.com.au/apps/go1-base-react-app/badges/master/build.svg)](https://code.go1.com.au/apps/go1-base-react-app/commits/master) [![coverage report](https://code.go1.com.au/apps/go1-base-react-app/badges/master/coverage.svg)](https://code.go1.com.au/apps/go1-base-react-app/commits/master)

## Requirements

- Node v8
- Yarn

## Overview

A base for GO1 React applications to be cloned off of.

## Maintainers

- Stephen Mudra (stephen.mudra@go1.com)

## INSTALLATION

```sh
brew install yarn
yarn install
```

## RUN

Create an `.env.local` file at the root level with the following content `REACT_APP_JWT="enter your jwt.token"`
Add a `REACT_APP_API_URL` (eg "http://localhost/GO1" for monolith dev) if you want to change the url

```sh
yarn start
```

## BUILD

```sh
yarn build
```

## HOW TO TEST

```sh
yarn test
```

## HOW TO CREATE A REPO FROM THIS TEMPLATE

- Create a repo that you want the new project to live in.
- Clone this template repo and `rm -rf node_modules`
- Run `cp -r go1-react-base-app [NEW_REPO_NAME]` replacing `[NEW_REPO_NAME]` with the name of the repo you created in the first step
- Update the origin of the repo using `git remote set-url origin [NEW_REPO_URL]` replacing `[NEW_REPO_URL]` with the URL of the repo you created in the first step
- Update the Dockerfile copy command to have the correct directory location
- Update the nginx file to have the correct location (including try_files)
- Update the package.json to have the homepag
- Push the new repo

## CONTRIBUTE

Before any pull requests ensure all changed files are run though tslint which should automatically correct most code styling errors
