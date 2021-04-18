import { h, render } from 'preact';
import { IntlProvider } from 'react-intl';

import getLastComments from 'common/api.getLastComments';
import { BASE_URL } from 'common/constants.config';
import { loadLocale } from 'utils/loadLocale';
import { getLocale } from 'utils/getLocale';
import ListComments from 'components/list-comments';

const LAST_COMMENTS_NODE_CLASSNAME = 'remark42__last-comments';
const DEFAULT_LAST_COMMENTS_MAX = 15;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}

async function init(config = window.remark_config): Promise<void> {
  window.REMARK42 = window.REMARK42 || {};
  window.REMARK42.createLastComment = init;

  if (!config) {
    return;
  }

  __webpack_public_path__ = `${BASE_URL}/web/`;

  const nodes = document.getElementsByClassName(LAST_COMMENTS_NODE_CLASSNAME);

  if (!nodes) {
    throw new Error("Remark42: Can't find last comments nodes.");
  }

  const { site_id, max_last_comments } = config;

  if (!site_id) {
    throw new Error('Remark42: Site ID is undefined.');
  }

  (Array.from(nodes) as HTMLElement[]).forEach((node) => {
    const max = (node.dataset.max && parseInt(node.dataset.max, 10)) || max_last_comments || DEFAULT_LAST_COMMENTS_MAX;
    const locale = getLocale(config);

    Promise.all([getLastComments(site_id, max), loadLocale(locale)]).then(([comments, messages]) => {
      try {
        render(
          <IntlProvider locale={locale} messages={messages}>
            <ListComments comments={comments} />
          </IntlProvider>,
          node
        );
      } catch (e) {
        console.error('Remark42: Something went wrong with last comments rendering');
        console.error(e);
      }
    });
  });
}
