const testMessageData = (unread, text = 'Текст cообщения', author = 'Moderator') => {
  return {
    avatar: '',
    author,
    messageShort: text,
    unreadCount: unread,
    // clearHistory: (this.id) => {//нет функционала}
  };
};

const testArray = [
  testMessageData(0),
  testMessageData(
    0,
    'Очень длинный текст 111111111111111111112222222222222fghjdfelirfglierjgerjglierjgoierjgoijrg'
  ),
  testMessageData(100, 'Текст с непрочитанными'),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
  testMessageData(0),
];

export default testArray;
