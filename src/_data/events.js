const fetch = require('node-fetch');

// Get any environment variables we need
// With public fallbacks for happier onboarding
require('dotenv').config();
const {
  TRELLO_BOARD_URL=`https://trello.com/b/K8GWYeLn/countess-wear-village-hall`,
  EVENTS_LIST_ID='5f21ef33df846c32e242465f',
  BRANCH } = process.env;


module.exports = () => {

  // Fetch the JSON data about this board
  console.log(TRELLO_BOARD_URL + '.json')
  let plop = TRELLO_BOARD_URL + '.json'
  return fetch(plop)
    .then(res => res.json())
    .then(json => {

      json.cards.forEach((card) => console.log(card))
      // Just focus on the cards which are in the list we want
      // and do not have a closed status
      let contentCards = json.cards.filter(card => {
        return card.idList == EVENTS_LIST_ID && !card.closed;
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
          card.imageUrl = card.attachments[0].url
        }
        card.time = card.customFieldItems.filter(field => { return field.id == "5f2b2be1503bb32efc16f750" })[0].value.text
        card.date = card.customFieldItems.filter(field => { return field.id == "5f2b2bc66af2c67825cb5135" })[0].value.text
        card.price = card.customFieldItems.filter(field => { return field.id == "5f2b2bab748b2c2bfba5cbcc" })[0].value.text
        
      })

      // return our data
      return contextCards;
  });
};
