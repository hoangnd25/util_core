import React from 'react';

export default {
  path: '(.*)',
  async action() {
    return {
      title: 'Page Not Found',
      description: '404',
      component: <h1>404</h1>,
      noIndex: true,
      status: 404,
    };
  },
};
