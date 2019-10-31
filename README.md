
# GO1 Base React App [![build status](https://code.go1.com.au/apps/go1-base-react-app/badges/master/build.svg)](https://code.go1.com.au/apps/go1-base-react-app/commits/master) [![coverage report](https://code.go1.com.au/apps/go1-base-react-app/badges/master/coverage.svg)](https://code.go1.com.au/apps/go1-base-react-app/commits/master)  
  
## Overview  
  
A base for GO1 React applications to be cloned off of. It is based on Next.js, so please familiarize yourself with it before starting anything.  
  
##Demo  
https://qa.go1.cloud/r/app/base-app-demo  
  
## Maintainers  
- Cian O'Leary (cian.oleary@go1.com)  
- Stephen Mudra (stephen.mudra@go1.com)  
- Shangzhi Pan (shangzhi.pan@go1.com)  
  
## Features  
- Sever Side Rendering  
- Authorization with cookies, localstorage and one time login tokens  
- Linting  
- Testing  
- Redux  
- Routing  
- Meta tags on routing  
- Redirection  
  
## INSTALLATION  
  
```sh  
npm install  
```  
  
## .env file for local development  
Create a .env file in your root folder with following content:  
```  
ENV=local  
API_ENDPOINT=https://api-dev.go1.co  
LOCAL_JWT=[YOUR JWT]  
```  
  
## RUN  
```sh  
npm run dev  
```  
  
## BUILD  
  
```sh  
npm run build  
```  
  
## HOW TO TEST  
  
```sh  
npm run test  
```  
  
## HOW TO LINT  
  
```sh  
npm run lint  
```  
  
## DEVELOPER INFO  
- An alias has been setup for the `/src` folder. You can use `@src` to reference it anywhere in your folder structure. e.g. use `import abc from '@src/components/abc'` instead of `import abc from '../../../../components/abc'`  
- This base app was created with the ability, to merge micro-apps into one, in mind. So if we need to merge two or more micro-apps which are based off the base app, we can do it more easily.  
-- Here are few things to keep in mind when you develop a new app:  
-- 1.  Change/Add the name of your module and adjust the path in the modulesInApp variable. `const modulesInApp = { "base-app-demo": { baseUrl: "/r/app/base-app-demo" } };`
This variable can be found in the  in the `/src/config.ts` folder. 
-- 2. To retrieve the baseUrl for the your module, you can easily use the `getBaseUrl(module_name)` function of `/src/config.ts` if only one module is in this app, the module_name parameter is optional. Some examples how to get the baseUrl and how to use it with the LinkComponent can be found here: [https://qa.go1.cloud/r/app/base-app-demo/examples/linkComponent](https://qa.go1.cloud/r/app/base-app-demo/examples/linkComponent)
-- 3. Keep micro-app specific components in an extra folder under components. You can use the app name as folder name for instance. This makes it easier to merge projects in the future.

## HOW TO CREATE A REPO FROM THIS TEMPLATE  
  
- Create a repo that you want the new project to live in.  
- Clone this template repo and `rm -rf node_modules`  
- Run `cp -r go1-react-base-app [NEW_REPO_NAME]` replacing `[NEW_REPO_NAME]` with the name of the repo you created in the first step  
- Update the origin of the repo using `git remote set-url origin [NEW_REPO_URL]` replacing `[NEW_REPO_URL]` with the URL of the repo you created in the first step  
- Update the Dockerfile copy command to have the correct directory location  
- Change/Add the name of your module and adjust the path in the modulesInApp variable. `const modulesInApp = { "base-app-demo": { baseUrl: "/r/app/base-app-demo" } };`
- Update the package.json to have the homepage
- Push the new repo  
  
## CONTRIBUTE  
  
Before any pull requests ensure all changed files are run though eslint which should automatically correct most code styling errors
