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

let drag = false;

export default {
  name: "SelectionMask",
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
    },
    selection: {
      type: Object,
      default: () => {
        return null;
      }
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
  computed: {
    maxLength() {
      let a_lengths = this.seqs.map(seq => seq.seq.length);
      return d3.max(a_lengths);
    }
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
        this.selection.startSeq &&
        this.selection.endSeq &&
        this.selection.startPos &&
        this.selection.endPos
      ) {
        let startSeq =
          this.selection.startSeq < 0 ? 0 : this.selection.startSeq;

        let endSeq =
          this.selection.endSeq >= this.seqs.length
            ? this.seqs.length - 1
            : this.selection.endSeq;

        let startPos =
          this.selection.startPos < 0 ? 0 : this.selection.startPos;

        let endPos =
          this.selection.endPos >= this.maxLength
            ? this.maxLength - 1
            : this.selection.endPos;

        var xScale = d3
          .scaleLinear()
          .range([1, this.width])
          .domain([0, this.maxLength]);
        var yScale = d3
          .scaleLinear()
          .range([10, this.height])
          .domain([0, this.seqs.length]);

        this.$set(this.rect, "startX", xScale(startPos));
        this.$set(this.rect, "startY", yScale(startSeq));

        this.$set(this.rect, "h", yScale(endSeq + 1) - this.rect.startY);
        this.$set(this.rect, "w", xScale(endPos + 1) - this.rect.startX);
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
        .domain([1, this.width]);

      var yScale = d3
        .scaleLinear()
        .range([0, this.seqs.length])
        .domain([10, this.height]);

      let startSeq = Math.floor(yScale(this.rect.startY));
      let endSeq = Math.floor(yScale(this.rect.startY + this.rect.h));
      let startPos = Math.floor(xScale(this.rect.startX));
      let endPos = Math.floor(xScale(this.rect.startX + this.rect.w));

      let selection = {
        startSeq: startSeq,
        endSeq: endSeq,
        startPos: startPos,
        endPos: endPos
      };

      this.$emit("select", selection);
    },
    mousedown(e) {
      let pos = this.mousePosition(e);

      this.$set(this.rect, "startX", pos.x);
      this.$set(this.rect, "startY", pos.y);
      drag = true;
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
