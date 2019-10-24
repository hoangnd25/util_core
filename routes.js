const routes = require('next-routes');
const PAGES = {
  USER_DATA_FEED: 'integrations/userDataFeed',
};

module.exports = routes()
  // .add(NAME, PATTERN, PATH_TO_CHILD_FOLDER_INSIDE_PAGES)
  .add('home', '/', PAGES.USER_DATA_FEED)
  .add('integrations', '/integrations', PAGES.USER_DATA_FEED)
  .add('integrations.userDataFeed', '/integrations/user-data-feed', PAGES.USER_DATA_FEED)
  ;
