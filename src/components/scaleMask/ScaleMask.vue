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
        let step = Math.ceil(this.maxLength / this.nbBins);

        for (let i = 0; i < this.nbBins; i++) {
          let pos = i == 0 ? (pos = null) : step * i;
          let label = pos;
          if (this.maxLength > 1000) {
            let pos5 = this.round(pos, 50);
            let pos10 = this.round(pos, 100);
            if (Math.abs(pos - pos5) < Math.abs(pos - pos10)) {
              label = pos5;
            } else {
              label = pos10;
            }
          } else if (this.maxLength > 100) {
            let pos5 = this.round(pos, 5);
            let pos10 = this.round(pos, 10);
            if (Math.abs(pos - pos5) < Math.abs(pos - pos10)) {
              label = pos5;
            } else {
              label = pos10;
            }
          }
          let x = this.xScale(pos);
          a_bins.push({ x, pos: label });
        }
        let final = { x: this.xScale(this.maxLength) - 2, pos: null };
        a_bins.push(final);
      }

      this.bins = a_bins;
    },
    round(x, v) {
      return Math.ceil(x / v) * v;
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
            bin.x,
            this.positionScale - this.heightTick - 2
          );
        }
      });
    }
  }
};
</script>

<style></style>
