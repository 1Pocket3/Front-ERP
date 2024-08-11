<template>
  <div class="process-bar">
    <div
      class="step"
      v-for="step in steps"
      :key="step.id"
      :class="{ active: isActiveStep(step.id) }"
    >
      {{ step.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    statuses: {
      type: Array,
      required: true,
    },
    currentProjectId: {
      required: true,
    },
  },
  data() {
    return {
      steps: this.statuses,
      currentStep: this.currentProjectId,
    };
  },
  mounted() {
		console.log('STEPS TABLE');
    console.table(this.steps);
  },
  watch: {
    statuses: "extractSteps",
  },
  methods: {
    isActiveStep(id) {
      return id <= this.currentStep;
    },
  },
};
</script>

<style scoped lang="scss">
.process-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px;

  .step {
    flex: 1;
    padding: 10px;
    text-align: center;
    position: relative;
    background-color: #ccc;
    color: #fff;
    border-radius: 5px;
    margin: 0 5px;

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -10px;
      width: 20px;
      height: 20px;
      background-color: inherit;
      transform: translateY(-50%) rotate(45deg);
      z-index: -1;
    }

    &.active {
      background-color: #142b3d;

      &:not(:last-child)::after {
        background-color: #142b3d;
      }
    }
  }
}
</style>
