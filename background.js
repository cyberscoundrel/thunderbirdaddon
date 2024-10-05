
browser.messageDisplay.onMessagesDisplayed.addListener((tab, message) => {
    console.log(`Message displayed in tab ${tab.id}: ${message.subject}`);
  });