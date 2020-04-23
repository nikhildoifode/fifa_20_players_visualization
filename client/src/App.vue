<template>
    <div id="app">
        <b-container fluid>
            <b-row>
                <b-col cols="5"> <h3>FIFA 20 Players Data Visualization</h3> </b-col>
                <b-col cols="7">
                    <v-select style="width: 45%;"></v-select>
                </b-col>
            </b-row>
            <b-row class="mainRow">
                <b-col cols="6" style="border: ridge;"> <HelloWorld msg="1 of 2"/> </b-col>
                <b-col cols="6" style="border: ridge;"> <HelloWorld msg="2 of 2"/> </b-col>
            </b-row>
            <b-row class="secondRow">
                <b-col cols="4" style="border: ridge;"> <HelloWorld msg="1 of 3"/> </b-col>
                <b-col cols="4" style="border: ridge;"> <HelloWorld msg="2 of 3"/> </b-col>
                <b-col cols="4" style="border: ridge;"> <HelloWorld msg="3 of 3"/> </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
}

.mainRow {
    height: 400px;
}

.secondRow {
    height: 150px;
}

</style>
