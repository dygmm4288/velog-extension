/* chrome.history.onVisited.addListener((historyItem) => {
  const { url } = historyItem;
  const { pathname } = new URL(url);
  if(pathname === '/write') {
    chrome.tabs.sendMessage()
  }

}); */
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
chrome.history.onVisited.addListener(async (historyItem) => {
  const { url } = historyItem;
  const pattern = /https:\/\/velog.io\/write/;
  const isMatched = !!url.match(pattern);

  console.log({ url }, url.match(pattern));
  const { id } = await getCurrentTab();
  chrome.tabs.sendMessage(id, { isMatched });
});
