<template>
  <div id="msa-overview" ref="msa-overview">
    <letters-mask
      v-if="displayLettersMask"
      :seqs="seqs"
      :width="width"
      :height="height"
    ></letters-mask>
    <color-sequences-mask
      v-if="displayMetadataMask"
      :seqs="seqs"
      :width="width"
      :height="height"
    ></color-sequences-mask>
    <selection-mask
      v-if="displaySelectionMask"
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
import ColorSequencesMask from "@/components/colorSequencesMask/ColorSequencesMask.vue";

export default {
  name: "MsaOverview",

  components: {
    LettersMask,
    SelectionMask,
    ColorSequencesMask
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
    },
    displayLettersMask: { type: Boolean, default: true },
    displayMetadataMask: { type: Boolean, default: true },
    displaySelectionMask: { type: Boolean, default: true }
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
