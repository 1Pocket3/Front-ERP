<template>
  <transition name="slide-top">
        <v-alert :type="alertType">{{alertMessage || message}}</v-alert>
  </transition>
</template>

<script>
import { useCustomizerStore } from '@/stores/customizer'

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
  setup() {
    const customizer = useCustomizerStore()
    return {
      customizer
    }
  },
  computed: {
    alertType() {
      return this.customizer.getAlertType
    },
    alertMessage() {
      return this.customizer.getAlertMessage
    },
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
