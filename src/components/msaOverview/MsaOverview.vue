<template>
  <div id="msa-overview" ref="msa-overview" :style="`height:${height}px`">
    <tracks
      v-if="displayTracks && tracks.length > 0"
      class="tracks"
      :tracks="tracks"
      :max-length="maxLength"
      :width="width"
      :height="heightTracks"
      :display-labels="false"
    ></tracks>
    <scale-mask
      v-if="displayScale"
      :style="`top:${positionScale}px;`"
      class="scaleMask"
      :seqs="seqs"
      :width="width"
      :height="heightScale"
    ></scale-mask>
    <div :style="`position:absolute;top:${positionMasks}px;`">
      <letters-mask
        v-if="displayLettersMask"
        :seqs="seqs"
        :width="width"
        :height="heightMask"
      ></letters-mask>
      <color-sequences-mask
        v-if="displayMetadataMask"
        :seqs="seqs"
        :width="width"
        :height="heightMask"
      ></color-sequences-mask>
      <selection-mask
        v-if="displaySelectionMask"
        :seqs="seqs"
        :width="width"
        :height="heightMask"
        :selection="selection"
        :movable="selectable"
        @select="emitSelect"
      ></selection-mask>
    </div>
  </div>
</template>

<script>
import LettersMask from "@/components/lettersMask/LettersMask.vue";
import SelectionMask from "@/components/selectionMask/SelectionMask.vue";
import ColorSequencesMask from "@/components/colorSequencesMask/ColorSequencesMask.vue";
import ScaleMask from "@/components/scaleMask/ScaleMask.vue";

import Tracks from "@/components/tracks";

export default {
  name: "MsaOverview",

  components: {
    LettersMask,
    SelectionMask,
    ColorSequencesMask,
    ScaleMask,
    Tracks
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
    heightScale: {
      type: Number,
      default: 30
    },
    selection: {
      type: Object,
      default: () => {
        return null;
      }
    },
    tracks: {
      type: Array,
      default: () => []
    },
    heightTracks: {
      type: Number,
      default: 50
    },
    displayLettersMask: { type: Boolean, default: true },
    displayMetadataMask: { type: Boolean, default: true },
    displaySelectionMask: { type: Boolean, default: true },
    displayTracks: { type: Boolean, default: true },
    displayScale: { type: Boolean, default: true }
  },
  computed: {
    maxLength() {
      return Math.max(...this.seqs.map(s => s.seq.length));
    },
    heightMask() {
      return (
        this.height -
        (this.displayScale ? this.heightScale : 0) -
        (this.displayTracks ? this.heightTracks : 0)
      );
    },
    positionMasks() {
      let pos = 5;
      if (this.displayTracks && this.tracks.length > 0) {
        pos += this.heightTracks;
      }
      if (this.displayScale) {
        pos += this.heightScale;
      }
      return pos;
    },
    positionScale() {
      let pos = 0;
      if (this.displayTracks && this.tracks.length > 0) {
        pos += this.heightTracks;
      }
      return pos;
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
  border-style: solid;
  border-width: 1px;
  box-shadow: 5px 5px 2px 1px rgba(50, 50, 51, 0.2);
}
#msa-overview {
  position: relative;
}

.scaleMask {
  position: absolute;
  left: 0%;
  top: 0%;
  border-width: 1px;
}

.tracks {
  position: absolute;
  left: 0%;
  top: 0%;
  margin: 0px 0px 5px 0px;
}
</style>
