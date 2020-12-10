<!-- Copyright 2020 [LIPM]
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
   limitations under the License.
-->
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
        }px;left:${rect.startX}px;background-color:${rect.color};opacity:${
          rect.opacity
        };`
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
        const trackLabel = track.trackLabel;
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

                let color = feature.color ? feature.color : "black";
                let title = `${trackLabel}-${feature.type}(${pos[0]}:${
                  pos[1]
                })`;

                let opacity = 0.3;
                if ("fill-opacity" in feature) {
                  opacity = feature["fill-opacity"];
                }

                i++;
                const rect = {
                  startX: startX,
                  startY: startY,
                  height: h,
                  width: w,
                  color: color,
                  title: title,
                  id: `rect${i}`,
                  opacity: opacity
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
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }
};
</script>
