<template>
    <view class="flex-container">
        <view class="question">
                <view class="meta">
                        <text class="text-category">{{category}}</text>
                        <text class="text-category">Q: {{cardsToSolve.length}} F: {{cardsFailed.length}}</text>
                </view>
            
            
            <text>{{currentCard.question}}</text></view>
        <view class="solution" v-if="showSolution"><text>{{currentCard.solution}}</text></view>
        <view class="answer-container" v-if="showSolution">
            <view class="btn-answer">
                <button
                    :on-press="onPressIncorrect"
                    title="Wrong Answer"
                    color="#841584"
                    accessibility-label="Learn more about this purple button"
                />
            </view>
            <view class="btn-answer">
                <button
                    :on-press="onPressCorrect"
                    title="Correct Answer"
                    color="#841584"
                    accessibility-label="Learn more about this purple button"
                />
            </view> 
        </view>

        <!-- Show solution box -->
        <view class="solution-container" v-if="!showSolution">
            <view class="btn-showsolution">
                <button
                    :on-press="toggleSolution"
                    title="Display solution"
                    color="#841584"
                    accessibility-label="Learn more about this purple button"
                />
            </view> 
        </view>
    </view> 
</template>

<style>
    .flex-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .solution {
        padding: 10;
    }
    .answer-container {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 20%;
        margin-top: auto;
    }
    
    .btn-answer {
        border-width: 0.5;
        padding: 10;
        padding-top: 55;
        height: 100%;
        width: 50%;
        
    }
    .question {
        border-bottom-color: grey;
        border-bottom-width: 1px;
        padding: 10;
        margin-top: 0;
    }
    .text-category {
        font-weight: bold;
    }
    .meta {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
        padding-bottom: 10px;
    }
</style>
    
<script>
    import axios from 'axios';
    import handleArray from '../manipulate-arrays';


    export default {
        data() {
            return {
                category: this.navigation.state.params.category,
                allCards: this.navigation.state.params.cards,
                maxNumberQuestions: 10,
                cardsToSolve: [],
                cardsFailed: [],
                currentCard: {},
                showSolution: false,
                cardsToUpdate: [],
            }
        },
        props: {
        item: {
            Type: Object
        },
        navigation: {
            Type: Object
        },
        value: ""
        },
        methods: {
            onPressLearnMore: function() {
            },
            updateValue: function (value) {
                //console.log(this.value)
                this.$emit('input', value);
                //console.log(this.value)
            },
            onPressCorrect: function() {
                this.toggleSolution()
                this.lowerDifficulty(true)
                this.pushCardToUpdateArray()
                
                if (this.cardsToSolve.length == 1 && this.cardsFailed.length > 0) {
                    // Fill cardsToSolve with failed cards
                    this.pushFailedToSolve()
                } else if (this.cardsToSolve.length > 1) {
                    // Remove the card because you answered correct and no need to try again
                    this.cardsToSolve.splice(0, 1);
                } else {
                    // Else game is complete, do complete logic here
                    this.onCompleteGame()
                }
                this.newCurrentCard()
                
                
            },
            onPressIncorrect: function() {
                this.toggleSolution()
                this.lowerDifficulty(false)
                this.pushCardToUpdateArray()
                this.sendCardToFailed()
                
                if (this.cardsToSolve.length == 1) {
                    this.pushFailedToSolve()
                } else if (this.cardsToSolve.length > 1) {
                    this.cardsToSolve.splice(0, 1);
                }

                this.currentCard = this.cardsToSolve[0]
            },
            pushFailedToSolve: function () {
                this.cardsToSolve = []
                this.cardsFailed.forEach((obj) => {
                    this.cardsToSolve.push(obj)
                })
                this.cardsFailed = []
            },
            newCurrentCard: function() {
                this.currentCard = this.cardsToSolve[0]
            },
            toggleSolution: function() {
                this.showSolution = !this.showSolution
            },
            onCompleteGame: function() {
                axios.post(`http://localhost:8050/updatearray`, this.cardsToUpdate)
                .then(response => {
                    console.log(response.data)
                })
                .then(() => {
                    this.cardsToUpdate = []
                    this.navigation.navigate("Category");
                })
                .catch(e => {
                    this.errors.push(e)
                })
            },
            sendCardToFailed: function () {
                this.cardsFailed.push(this.currentCard)
            },
            lowerDifficulty: function (boolean) {  // false if wrong answer
                console.log("start: " + this.currentCard)
                if (this.cardsToUpdate === undefined || this.cardsToUpdate.length == 0 && boolean == true) {
                    console.log("inside 1: " + this.currentCard)
                    
                    this.currentCard.difficulty += 1
                    this.cardsToUpdate.push(this.currentCard)
                    console.log(this.cardsToUpdate)
                } else if (this.cardsToUpdate === undefined || this.cardsToUpdate.length == 0 && boolean == false) {
                    console.log("inside 2")
                    
                    this.currentCard.difficulty -= 1
                    this.cardsToUpdate.push(this.currentCard)
                }

                const ids = this.cardsToUpdate.map(card => card._id)

                // update difficulty if card is not in cardstoupdate
                if (!ids.includes(this.currentCard._id) && boolean == true) {
                    console.log("inside 3")
                    this.currentCard.difficulty += 1
                    this.cardsToUpdate.push(this.currentCard)
                    console.log(this.cardsToUpdate)
                } else if (!ids.includes(this.currentCard._id) && boolean == false && this.currentCard.difficulty != 0) {
                    console.log("inside 4")
                    this.currentCard.difficulty -= 1
                    this.cardsToUpdate.push(this.currentCard)
                }
            },
            pushCardToUpdateArray: function () {
                // TODO: Not sure if this IF statement is really needed as we have the logic below it
                if (this.cardsToUpdate === undefined || this.cardsToUpdate.length == 0) {
                    this.cardsToUpdate.push(this.currentCard)
                }

                const ids = this.cardsToUpdate.map(card => card._id)

                // Push to cardsToUpdate array only if the card is not already there
                if (!ids.includes(this.currentCard._id)) {
                    this.cardsToUpdate.push(this.currentCard)
                }             
            }
        },
        mounted: function () {
            let oneCategoryOfCardsArray = []
            let filteredArray = []

            // grab only cards with correct category
            this.allCards.forEach((card) => {
                if (card.category == this.category) {
                    //console.log("found 1!")
                    oneCategoryOfCardsArray.push(card)
                }
            })

            // mix the cards in the array
            shuffledOneCategoryArray = handleArray.shuffleArray(oneCategoryOfCardsArray)

            // populate filtered array with n cards (n = maxNumberCards)
            shuffledOneCategoryArray.forEach(function(card) {
                let is_swap = handleArray.changeCard(card.difficulty)
                if (is_swap) {
                    // do nothing
                } else if (!is_swap && filteredArray.length < 10) {
                    // push card to filtered array
                    filteredArray.push(card)       
                }
            })
        this.cardsToSolve = filteredArray;

        // move back to category if there is no cards to do
        if (filteredArray === undefined || filteredArray.length == 0) {
            this.navigation.navigate("Category");
            return;
        }
        this.currentCard = filteredArray[0];
        
    },
    };
</script>