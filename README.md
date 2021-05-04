
# GO1 Portal App [![build status](https://code.go1.com.au/apps/go1-base-react-app/badges/master/build.svg)](https://code.go1.com.au/apps/go1-base-react-app/commits/master) [![coverage report](https://code.go1.com.au/apps/go1-base-react-app/badges/master/coverage.svg)](https://code.go1.com.au/apps/go1-base-react-app/commits/master)  
  
## Overview  
  
This app is for GO1 admin portal settings.

Visit [http://localhost:3000/r/app/portal](http://localhost:3000/r/app/portal) to see how the app works
Alternative in case the above link does not work, visit [http://localhost:3000/r/app/portal/settings/theme](http://localhost:3000/r/app/portal/settings/theme)
  
## Maintainers  
- Trung Luu (trung.luu@go1.com)
- Thuat Le (thuat.le@go1.com)

## SYSTEM REQUIREMENTS
- Node v10.13 or later
  
## INSTALLATION  
  
```sh  
npm install  
```  
  
## .env file for local development  
Create a .env file in your project root folder with following content:  
```  
ENV=local  
API_URL=https://api-dev.go1.co  
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

## TRANSLATIONS

```sh  
npm run add-locale en-US // Add new languages
npm run extract // Extract translatable text
npm run compile // Compile the translations into JS
``` 
  
## DEVELOPER INFO  
- An alias has been setup for the `/src` folder. You can use `@src` to reference it anywhere in your folder structure. e.g. use `import abc from '@src/components/abc'` instead of `import abc from '../../../../components/abc'`  
- This base app was created with the ability, to merge micro-apps into one, in mind. So if we need to merge two or more micro-apps which are based off the base app, we can do it more easily.  
-- Here are few things to keep in mind when you develop a new app:  
-- 1.  Change/Add the name of your module and adjust the path in the modulesInApp variable. `const modulesInApp = { "base-app-demo": { baseUrl: "/r/app/base-app-demo" } };`
This variable can be found in the  in the `/src/config.ts` folder. Remove the demo from your apps config.
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
