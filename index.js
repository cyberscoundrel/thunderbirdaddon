console.log('hello')
browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then(tabs => {
    let tabId = tabs[0].id;
    console.log(tabId)
    browser.messageDisplay.getDisplayedMessages(tabId).then(([message]) => {
      document.body.textContent = JSON.stringify(message);
      console.log('here')
      browser.messages.getFull(message.id).then((e) => {
        console.log('now')
        console.log(e)
        document.body.innerHTML = e.parts[0].body
      }).then(() => {
        console.log('real shit')
      })


    });
  });