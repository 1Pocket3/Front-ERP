<template>
  <transition name="slide-top">
        <v-alert :type="type">{{message}}</v-alert>
  </transition>
</template>

<script>

export default {
  name: 'Alerts',
  props: {
    type: {
      type: String,
      required: true,
    },
    t: {
      type: Function,
      required: true
    }
  },
  computed: {
    message() {
      switch (this.type) {
        case 'success':
          return this.t('assign_success_text');
        case 'error':
          return this.t('unassign_success_text');
        case 'warning':
          return 'Warning alert!';
        default:
          return 'Notification';
      }
    }
  }
};
</script>
