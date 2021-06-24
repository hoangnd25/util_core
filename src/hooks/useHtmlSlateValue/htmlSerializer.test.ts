import { stripTabsAndNewLines } from './htmlSerializer';

it('Should strip tabs & newlines for html content', () => {
  expect(
    stripTabsAndNewLines(`
<p>Test tag:</p>

<ul>
	<li><strong>Tab indent <a href="http://go1.com">GO1</a></li>
</ul>

<p>Another tag.</p>
    `)
  ).toStrictEqual('<p>Test tag:</p><ul><li><strong>Tab indent <a href="http://go1.com">GO1</a></li></ul><p>Another tag.</p>');
});
