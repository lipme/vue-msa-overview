<template>
  <div id="msa-overview" ref="msa-overview">
    <letters-mask :seqs="seqs" :width="width" :height="height"></letters-mask>
    <selection-mask
      :seqs="seqs"
      :width="width"
      :height="height"
      :selection="selection"
      @select="emitSelect"
    ></selection-mask>
  </div>
</template>

<script>
import LettersMask from "@/components/lettersMask/LettersMask.vue";
import SelectionMask from "@/components/selectionMask/SelectionMask.vue";

export default {
  name: "MsaOverview",

  components: {
    LettersMask,
    SelectionMask
  },

  props: {
    seqs: {
      type: Array,
      default: () => {
        return null;
      }
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    },
    selection: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  methods: {
    emitSelect(selection) {
      this.$emit("select", selection);
    }
  }
};
</script>

<style scoped>
.draw {
  position: absolute;
  left: 0%;
  top: 0%;
}
#msa-overview {
  position: relative;
}
</style>
