<template>
    <scroll-view :style"{width: '100%'}">
            <view class="border" v-for="item in categories">
                <button :onPress='() => handleClick(item)' :title="item"></button>
            </view>
    </scroll-view>
</template>

<style>
    .border {
        border-bottom-width: 1;
        border-color: grey;
        width: 100%;
        padding: 15;
    }
    .text-color-primary {
        color: blue;
    }
</style>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                selectedCategory: "",
                categories: [],
                allCards: [],
            }
        },
        props: {
            item: String,
            navigation: Object
        },
        methods: {
            handleClick: function(category) {
                this.navigation.navigate("Question", { category: category, cards: this.allCards });
                console.log(typeof(item))
            }
        },

        created() {
            axios.get(`http://localhost:8050/categories`)
            .then(response => {
            // JSON responses are automatically parsed.
                this.categories = response.data
            })
            .catch(e => {
                this.errors.push(e)
            })

            axios.get(`http://localhost:8050/allcards`)
            .then(response => {
            // JSON responses are automatically parsed.
                this.allCards = response.data
                console.log(response.data.length)
            })
            .catch(e => {
                this.errors.push(e)
            })
            console.log("Created Category")
        },
        mounted() {
            console.log("Mounted Category")
        }
    }
</script>