chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ blocked: [] });
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(event => {
  const entry = {
    time: new Date().toLocaleTimeString(),
    url: event.request.url,
    ruleId: event.rule.ruleId
  };

  chrome.storage.local.get("blocked", data => {
    const updated = [entry, ...(data.blocked || [])].slice(0, 50);
    chrome.storage.local.set({ blocked: updated });
  });
});
