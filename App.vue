<template>
    <app-navigation></app-navigation>
</template>
 
<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>

<script>
  import axios from 'axios';
  import handleArray from './manipulate-arrays';
  import { StackNavigator } from "vue-native-router";
  import Category from "./components/Category";
  import Question from "./components/Question";
  
  const AppNavigation = StackNavigator(
    {
      Category: Category,
      Question: Question,
    },
    {
      initialRouteName: 'Category',
    }
  );


  export default {
  components: { Category , Question, AppNavigation },
  data() {
    return {
      userId: "bomarkandre@gmail.com",
      categories: [],
      cards: [],
      filteredDeck: [],
      questionRender: false,
      categoryRender: true,
      currentCard: [],
      numberOfQuestions: 10
    }
  },
  methods: {
    onClickCategory (value) {
      //console.log(value) // true
    },
    handleBtnPress: function() {

      // get random card
      let unfilteredCards = handleArray.getRandom(this.cards, 10)
      let f = []
      
      unfilteredCards.forEach(function(card) {
        //console.log(card.difficulty)
        let is_swap = handleArray.changeCard(card.difficulty)
        //console.log(is_swap)
        if (is_swap) {
          // do nothing
        } else {
          // push card to filtered array
          f.push(card)

          // end if 10 cards
          if (f > numberOfQuestions) {
            this.filteredDeck = f;
            //alert('filled')
            return 
          }
        
        }
      })
      this.filteredDeck = f;
    },
    showFdeck: function() {
      //console.log(this.filteredDeck[0].question)
    }
  },

  // Fetches posts when the component is created.
  created() {
    axios.get(`http://localhost:8050/categories`)
    .then(response => {
      // JSON responses are automatically parsed.
      //console.log(response.data)
      this.categories = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })

    // get all cards
    axios.get(`http://localhost:8050/allcards`)
    .then(response => {
      // JSON responses are automatically parsed.
      //console.log(response.data)
      this.cards = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  }
}

</script>