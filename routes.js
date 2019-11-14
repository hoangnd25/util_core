const routes = require('next-routes');
const PAGES = {
  SCORM_AND_XAPI: 'integrations/scormAndXApi',
  USER_DATA_FEED: 'integrations/userDataFeed',
};
const appUrlPrefix = process.env.NODE_ENV !== 'production' ? '' : '/r/app/portal';

module.exports = routes()
  // .add(NAME, PATTERN, PATH_TO_CHILD_FOLDER_INSIDE_PAGES)
  .add('home', `${appUrlPrefix}`, PAGES.USER_DATA_FEED)
  .add('integrations', `${appUrlPrefix}/integrations`, PAGES.USER_DATA_FEED)
  .add('integrations.scormAndXapi', `${appUrlPrefix}/integrations/scorm-and-xapi`, PAGES.SCORM_AND_XAPI)
  .add('integrations.userDataFeed', `${appUrlPrefix}/integrations/user-data-feed`, PAGES.USER_DATA_FEED)
  ;
