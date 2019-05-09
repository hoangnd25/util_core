import { CourseCard } from '@go1d/go1d';
import React from 'react';

export default {
  path: '',
  async action() {
    return {
      title: 'Homepage',
      description: 'Homepage',
      component: (
        <React.Fragment>
          <p>Server Side Rendering</p>
          <CourseCard
            typeIcon="Course"
            type="Course"
            duration={74}
            author="GO1"
            title="Test Title"
            courseImage="https://res.cloudinary.com/go1/image/fetch/w_1024,h_300,c_thumb,g_auto/https://udemy-images.udemy.com/course/750x422/435262_c617.jpg"
            itemList={[
              {
                title: 'Test',
              },
            ]}
            status={{
              type: 'inProgress',
              text: 'In progress',
            }}
            passive={false}
          />
        </React.Fragment>
      ),
    };
  },
};
