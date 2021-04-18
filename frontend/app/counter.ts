import { COUNTER_NODE_CLASSNAME, BASE_URL, API_BASE } from 'common/constants.config';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}

function init(config = window.remark_config): void {
  window.REMARK42 = window.REMARK42 || {};
  window.REMARK42.createCounter = init;

  if (!config) {
    return;
  }

  const nodes = Array.from(document.getElementsByClassName(COUNTER_NODE_CLASSNAME)) as HTMLElement[];

  if (!nodes) {
    throw new Error("Remark42: Can't find counter nodes.");
  }

  if (!config.site_id) {
    throw new Error('Remark42: Site ID is undefined.');
  }

  const map = nodes.reduce<{ [key: string]: HTMLElement[] }>((acc, node) => {
    const id = node.dataset.url || config.url || `${window.location.origin}${window.location.pathname}`;
    if (!acc[id]) acc[id] = [];
    acc[id].push(node);
    return acc;
  }, {});

  const oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function (this: XMLHttpRequest) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      try {
        const res = JSON.parse(this.responseText) as { url: string; count: number }[];
        res.forEach((item) => map[item.url].map((n) => (n.innerHTML = item.count.toString(10))));
      } catch (e) {}
    }
  };
  oReq.open('POST', `${BASE_URL}${API_BASE}/counts?site=${config.site_id}`, true);
  oReq.setRequestHeader('Content-Type', 'application/json');
  oReq.send(JSON.stringify(Object.keys(map)));
}
