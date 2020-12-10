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
  <canvas ref="canvas" class="draw" :width="width" :height="height"></canvas>
</template>

<script>
import { maskMixin } from "@/mixins/maskMixin.js";

export default {
  name: "ColorSequencesMask",
  mixins: [maskMixin],

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
      this.seqs.forEach((s, seqIndex) => {
        if (s.metadata) {
          s.metadata.map(e => {
            if (e.positions && e.positions.length >= 0) {
              e.positions.forEach(pos => {
                let start = pos[0] < 0 ? 0 : pos[0];
                let end =
                  pos[1] >= this.maxLength ? this.maxLength - 1 : pos[1];

                let startX = this.xScale(start);
                let startY = this.yScale(seqIndex);

                let h = this.yScale(seqIndex + 1) - startY;
                let w = this.xScale(end + 1) - startX;

                let color = e.color;
                let opacity = e.opacity;

                this.drawRect({ startX, startY, h, w, color, opacity });
              });
            }
          });
        }
      });
    },
    drawRect(o) {
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");
      // context.globalAlpha = 0.5;

      context.beginPath();
      context.fillStyle = o.color;
      context.globalAlpha = o.opacity;
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
