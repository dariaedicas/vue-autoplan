
<template>
  <div class="hello">
    <input v-model="message" placeholder="отредактируй меня">
    <p>Введённое сообщение: {{ message }}</p>
    <select v-model="selected">
      <option v-for="option in options" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
    <span>Выбрано: {{ selected }}</span>
    <input v-model.number="age" type="number">
    <n3-datetimepicker v-model="datetime" format="yyyy-MM-dd hh:mm" ></n3-datetimepicker>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'hello',
  data () {
    return {
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ],
      selected: 'A',
      message: '',
      age: 0,
      datetime: moment()
    }
  },
  methods: {
    moment: function () {
      return moment()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import './hello/hello.css';
</style>
