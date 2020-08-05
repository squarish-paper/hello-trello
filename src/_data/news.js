const fetch = require('node-fetch');

// Get any environment variables we need
// With public fallbacks for happier onboarding
require('dotenv').config();
const {
  TRELLO_BOARD_URL=`https://trello.com/b/K8GWYeLn/countess-wear-village-hall`,
  NEWS_LIST_ID='5f21ef33df846c32e242465e',
  BRANCH } = process.env;


module.exports = () => {

  // Fetch the JSON data about this board
  console.log(TRELLO_BOARD_URL + '.json')
  let plop = TRELLO_BOARD_URL + '.json'
  return fetch(plop)
    .then(res => res.json())
    .then(json => {

      json.cards.forEach((card) => console.log(card.idList))
      // Just focus on the cards which are in the list we want
      // and do not have a closed status
      let contentCards = json.cards.filter(card => {
        return card.idList == NEWS_LIST_ID && !card.closed;
      });

      // only include cards labelled with "live" or with
      // the name of the branch we are in
      let contextCards = contentCards.filter(card => {
        return card.labels.filter(label => (
          label.name.toLowerCase() == 'live' ||
          label.name.toLowerCase() == BRANCH
        )).length;
      });

      // If a card has an attachment, add it as an image in the descriotion markdown
      contextCards.forEach(card => {
        if(card.attachments.length) {
          card.name = "";
          card.desc = card.desc + `\n![${card.name}](${card.attachments[0].url} '${card.name}')`;
        }
      })

      // return our data
      return contextCards;
  });
};
