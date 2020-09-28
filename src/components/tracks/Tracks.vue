<template>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Tracks",
  props: {
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    },
    tracks: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: Number,
      default: 100
    },
    maxTrackHeight: {
      type: Number,
      default: 20
    }
  },
  computed: {
    xScale() {
      return d3
        .scaleLinear()
        .range([0, this.width])
        .domain([0, this.maxLength]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .range([0, this.height])
        .domain([0, this.tracks.length]);
    }
  },
  watch: {
    tracks() {
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
    randomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },
    draw() {
      this.clear();
      this.tracks.forEach((track, trackIndex) => {
        if (track.features) {
          track.features.map(feature => {
            if (feature.positions) {
              feature.positions.forEach(pos => {
                let start = pos[0] < 0 ? 0 : pos[0] - 1;
                let end =
                  pos[1] >= this.maxLength ? this.maxLength - 1 : pos[1] - 1;

                let startX = this.xScale(start);
                let startY = this.yScale(trackIndex);

                let h = this.yScale(trackIndex + 1) - startY;

                let w = this.xScale(end + 1) - startX;

                let color = feature.color ? feature.color : this.randomColor();
                this.drawRect({ startX, startY, h, w, color });
              });
            }
          });
        }
      });
    },
    drawRect(o) {
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");
      context.globalAlpha = 0.5;

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
