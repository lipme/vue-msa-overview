<template>
  <canvas ref="canvas" :width="width" :height="height"> </canvas>
</template>

<script>
import { maskMixin } from "@/mixins/maskMixin.js";

export default {
  name: "ScaleMask",
  mixins: [maskMixin],

  props: {
    nbBins: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      bins: []
    };
  },

  computed: {
    heightTick() {
      return this.height / 5;
    },
    positionScale() {
      return this.height - 2;
    },
    heightScale() {
      return this.height / 10;
    },
    step() {
      return Math.round(this.closestRoundLength / this.nbBins);
    },
    closestRoundLength() {
      let roundVal = 1;
      if (this.maxLength > 10000) {
        roundVal = 10000;
      } else if (this.maxLength > 1000) {
        roundVal = 1000;
      } else if (this.maxLength > 100) {
        roundVal = 100;
      } else if (this.maxLength > 10) {
        roundVal = 10;
      }

      return this.closest(this.maxLength, roundVal);
    },
    actualNbBins() {
      let remain = this.maxLength - this.closestRoundLength;

      let remainBins = Math.round(remain / this.step);

      return this.nbBins + remainBins;
    }
  },
  watch: {
    seqs() {
      this.draw();
    }
  },

  mounted() {
    this.draw();
  },
  updated() {
    this.draw();
  },
  methods: {
    createBins() {
      let a_bins = new Array();

      if (this.seqs != null) {
        for (let i = 0; i < this.actualNbBins; i++) {
          let pos = i == 0 ? (pos = null) : this.step * i;
          let label = pos;
          let x = this.xScale(pos);
          a_bins.push({ x, pos: label });
        }
        let final = { x: this.xScale(this.maxLength) - 2, pos: null };
        a_bins.push(final);
      }

      this.bins = a_bins;
    },
    closest(x, v) {
      return Math.floor(x / v) * v;
    },
    draw() {
      this.createBins();
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");

      context.clearRect(0, 0, this.width, this.height);

      context.rect(0, this.positionScale, this.width, this.heightScale);
      context.fill();
      context.closePath();

      context.font = `${this.heightTick * 2}px serif`;

      this.bins.forEach(bin => {
        context.beginPath();
        context.rect(bin.x, this.positionScale, 2, -this.heightTick);
        context.fill();
        context.closePath();
        if (bin.pos != null) {
          context.fillText(
            bin.pos,
            bin.x - 10,
            this.positionScale - this.heightTick - 2
          );
        }
      });
    }
  }
};
</script>

<style></style>
