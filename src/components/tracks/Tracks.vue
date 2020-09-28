<template>
  <div
    ref="draw"
    :style="`position:relative;height:${height}px;width:${width}px;`"
  >
    <div
      v-for="rect in rects"
      :id="rect.id"
      :key="rect.id"
      :style="
        `position:absolute;height:${rect.height}px;width:${rect.width}px;top:${
          rect.startY
        }px;left:${rect.startX}px;background-color:${rect.color}`
      "
      :title="rect.title"
    ></div>
  </div>
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
    },
    rects() {
      let rects = [];
      let i = 0;
      this.tracks.forEach((track, trackIndex) => {
        if (track.features) {
          track.features.map(feature => {
            if (feature.positions) {
              feature.positions.forEach(pos => {
                let start = pos[0] < 1 ? 0 : pos[0] - 1;
                let end =
                  pos[1] >= this.maxLength ? this.maxLength - 1 : pos[1] - 1;

                let startX = this.xScale(start);
                let startY = this.yScale(trackIndex);

                let h = this.yScale(trackIndex + 1) - startY;

                let w = this.xScale(end + 1) - startX;

                let color = feature.color ? feature.color : this.randomColor();
                let title = `${feature.type}(${pos[0]}-${pos[1]})`;

                i++;
                const rect = {
                  startX: startX,
                  startY: startY,
                  height: h,
                  width: w,
                  color: color,
                  title: title,
                  id: `rect${i}`
                };
                rects.push(rect);
              });
            }
          });
        }
      });
      return rects;
    }
  },
  methods: {
    randomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    }
  }
};
</script>
