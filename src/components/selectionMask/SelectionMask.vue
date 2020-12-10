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
  <canvas
    ref="canvas"
    class="draw"
    :width="width"
    :height="height"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mousemove="mousemove"
    @mouseleave="mouseleave"
  >
  </canvas>
</template>

<script>
import * as d3 from "d3";
import { maskMixin } from "@/mixins/maskMixin.js";

let drag = false;

export default {
  name: "SelectionMask",
  mixins: [maskMixin],

  props: {
    selection: {
      type: Object,
      default: () => {
        return null;
      }
    },
    movable: {
      type: Boolean,
      default: true
    },
    maxSelection: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      rect: {
        type: Object,
        default: () => {
          return {};
        }
      }
    };
  },
  watch: {
    seqs() {
      this.setSelection();
    },
    selection() {
      this.setSelection();
    }
  },
  mounted() {
    this.setSelection();
  },
  updated() {
    this.setSelection();
  },
  methods: {
    setSelection() {
      if (this.selection == null || this.seqs == null) {
        return;
      }

      if (
        "startSeq" in this.selection &&
        "endSeq" in this.selection &&
        "startPos" in this.selection &&
        "endPos" in this.selection
      ) {
        let startSeq =
          this.selection.startSeq < 0 ? 0 : this.selection.startSeq;

        let endSeq =
          this.selection.endSeq >= this.seqs.length
            ? this.seqs.length - 1
            : this.selection.endSeq;

        if (startSeq > endSeq) {
          let tmp = startSeq;
          startSeq = endSeq;
          endSeq = tmp;
        }

        let startPos =
          this.selection.startPos < 0 ? 0 : this.selection.startPos;

        let endPos =
          this.selection.endPos >= this.maxLength
            ? this.maxLength - 1
            : this.selection.endPos;

        this.$set(this.rect, "startX", this.xScale(startPos));
        this.$set(this.rect, "startY", this.yScale(startSeq));

        this.$set(this.rect, "h", this.yScale(endSeq + 1) - this.rect.startY);
        this.$set(this.rect, "w", this.xScale(endPos + 1) - this.rect.startX);

        this.drawSelection();
      }
    },
    mousemove(e) {
      if (drag) {
        let pos = this.mousePosition(e);

        this.$set(this.rect, "w", pos.x - this.rect.startX);
        this.$set(this.rect, "h", pos.y - this.rect.startY);
      }
      this.drawSelection();
    },
    mouseup() {
      drag = false;
      var xScale = d3
        .scaleLinear()
        .range([0, this.maxLength])
        .domain([0, this.width]);

      var yScale = d3
        .scaleLinear()
        .range([0, this.seqs.length])
        .domain([0, this.height]);

      let startSeq = Math.floor(yScale(this.rect.startY));
      let endSeq = Math.floor(yScale(this.rect.startY + this.rect.h));
      let startPos = Math.floor(xScale(this.rect.startX));
      let endPos = Math.floor(xScale(this.rect.startX + this.rect.w));

      if (startSeq > endSeq) {
        let tmp = startSeq;
        startSeq = endSeq;
        endSeq = tmp;
      }

      if (startPos > endPos) {
        let tmp = startPos;
        startPos = endPos;
        endPos = tmp;
      }

      let selection = {
        startSeq: startSeq,
        endSeq: endSeq,
        startPos: startPos,
        endPos: endPos
      };

      this.$emit("select", selection);
    },
    mousedown(e) {
      if (this.movable) {
        let pos = this.mousePosition(e);

        this.$set(this.rect, "startX", pos.x);
        this.$set(this.rect, "startY", pos.y);
        drag = true;
      }
    },
    drawSelection() {
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");

      this.clearSelection();
      context.setLineDash([6]);
      context.fillStyle = "rgba(206, 193, 225, 0.15)";
      context.strokeStyle = "black";
      context.fillRect(
        this.rect.startX,
        this.rect.startY,
        this.rect.w,
        this.rect.h
      );
      context.strokeRect(
        this.rect.startX,
        this.rect.startY,
        this.rect.w,
        this.rect.h
      );
    },
    clearSelection() {
      const canvas = this.$refs["canvas"];
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, this.width, this.height);
    },
    mousePosition(event) {
      var totalOffsetX = 0,
        totalOffsetY = 0,
        coordX = 0,
        coordY = 0,
        currentElement = this.$refs["canvas"],
        mouseX = 0,
        mouseY = 0;

      // Traversing the parents to get the total offset
      do {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
      } while ((currentElement = currentElement.offsetParent));
      // Use pageX to get the mouse coordinates
      if (event.pageX || event.pageY) {
        mouseX = event.pageX;
        mouseY = event.pageY;
      }
      // IE8 and below doesn't support event.pageX
      else if (event.clientX || event.clientY) {
        mouseX =
          event.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        mouseY =
          event.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      // Subtract the offset from the mouse coordinates
      coordX = mouseX - totalOffsetX;
      coordY = mouseY - totalOffsetY;

      return {
        x: coordX,
        y: coordY
      };
    },
    mouseleave() {
      if (drag == true) {
        this.mouseup();
      }
    }
  }
};
</script>

<style></style>
