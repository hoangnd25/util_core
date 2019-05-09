import { RouteContext } from '../../types/route';

// The top-level (parent) route
export default {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [require('./home').default, require('./notFound').default],

  async action(props: RouteContext) {
    const { next } = props;

    // Execute each child route until one of them return the result
    const route = await next();

    return route;
  },
};
