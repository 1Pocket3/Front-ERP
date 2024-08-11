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
          return this.t('success_create_proj');
        case 'error':
          return this.t('success_delete_proj_text');
        case 'warning':
          return 'Warning alert!';
        default:
          return 'Notification';
      }
    }
  }
};
</script>
