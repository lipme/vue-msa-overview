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
      :movable="selectable"
      @select="emitSelect"
    ></selection-mask>
    <scale-mask
      class="scaleMask"
      :seqs="seqs"
      :width="width"
      :height="heightMask"
    ></scale-mask>
  </div>
</template>

<script>
import LettersMask from "@/components/lettersMask/LettersMask.vue";
import SelectionMask from "@/components/selectionMask/SelectionMask.vue";
import ColorSequencesMask from "@/components/colorSequencesMask/ColorSequencesMask.vue";
import ScaleMask from "@/components/scaleMask/ScaleMask.vue";

export default {
  name: "MsaOverview",

  components: {
    LettersMask,
    SelectionMask,
    ColorSequencesMask,
    ScaleMask
  },

  props: {
    selectable: {
      type: Boolean,
      default: true
    },
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
    heightMask: {
      type: Number,
      default: 30
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
  border-style: solid;
  border-width: 1px;
  box-shadow: 5px 5px 2px 1px rgba(50, 50, 51, 0.2);
}
#msa-overview {
  position: relative;
}

.scaleMask {
  margin: -35px 0 0 0;
  position: absolute;
  left: 0%;
  top: 0%;
  border-width: 1px;
}
</style>
