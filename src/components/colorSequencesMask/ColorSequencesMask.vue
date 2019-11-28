<template>
  <canvas ref="canvas" class="draw" :width="width" :height="height"></canvas>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ColorSequencesMask",
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
    }
  },
  computed: {
    maxLength() {
      let a_lengths = this.seqs.map(seq => seq.seq.length);
      return d3.max(a_lengths);
    }
  },
  watch: {
    seqs() {
      this.clear();
      this.drawMetadata();
    }
  },
  mounted() {
    this.drawMetadata();
  },
  updated() {
    this.drawMetadata();
  },
  methods: {
    drawMetadata() {
      let xScale = d3
        .scaleLinear()
        .range([0, this.width])
        .domain([0, this.maxLength]);
      let yScale = d3
        .scaleLinear()
        .range([0, this.height])
        .domain([0, this.seqs.length]);

      this.seqs.forEach((s, seqIndex) => {
        if (s.metadata) {
          s.metadata.map(e => {
            if (!e.positions || e.positions.length == 0) {
              e.positions = [[0, this.maxLength - 1]];
            }

            e.positions.forEach(pos => {
              let start = pos[0] < 0 ? 0 : pos[0];
              let end = pos[1] >= this.maxLength ? this.maxLength - 1 : pos[1];

              let startX = xScale(start);
              let startY = yScale(seqIndex);

              let h = yScale(seqIndex + 1) - startY;
              let w = xScale(end + 1) - startX;

              let color = e.color;

              this.drawRect({ startX, startY, h, w, color });
            });
          });
        }
      });
    },
    drawRect(o) {
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");
      context.beginPath();
      context.fillStyle = o.color;
      context.rect(o.startX, o.startY, o.w, o.h);
      context.fill();
      context.closePath();
    },
    clear() {
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};
</script>
