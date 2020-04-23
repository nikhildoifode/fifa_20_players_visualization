<template>
    <div class="hello">
        <h3>{{ msg }}</h3>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    }
}
</script>

<style scoped>
h3 {
    margin: 40px 0 0;
}
</style>
