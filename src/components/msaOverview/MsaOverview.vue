<template>
  <div id="msa-overview" ref="msa-overview">
    <canvas
      ref="msa-overview-canvas"
      class="draw"
      :width="width"
      :height="height"
    >
    </canvas>
    <canvas
      ref="msa-overview-selection"
      class="draw"
      :width="width"
      :height="height"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mousemove="mousemove"
    >
    </canvas>
  </div>
</template>

<script>
import * as d3 from "d3";

let drag = false;

export default {
  name: "MsaOverview",

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
      this.drawAlignment();
      this.setSelection();
    },
    selection() {
      this.setSelection();
    }
  },
  mounted() {
    this.drawAlignment();
    this.setSelection();
  },
  updated() {
    this.drawAlignment();
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
    getMaxLength() {
      let a_lengths = this.seqs.map(seq => seq.seq.length);
      return d3.max(a_lengths);
    },

    getLetterData() {
      let a_letterData = [];

      this.seqs.forEach((seq, indexSeq) => {
        let a_letters = seq.seq.split("");

        a_letters.forEach((letter, index) => {
          a_letterData.push({
            x: index,
            y: indexSeq,
            color: this.getColor(letter.toUpperCase())
          });
        });
      });

      return a_letterData;
    },

    getColor(letter) {
      const a_colors = {
        A: "red",
        C: "green",
        G: "blue",
        T: "orange",
        U: "orange",
        ".": "grey"
      };

      return a_colors[letter];
    },

    drawAlignment() {
      const canvas = this.$refs["msa-overview-canvas"];

      let context = canvas.getContext("2d");
      context.clearRect(0, 0, this.width, this.height);

      let a_letterData = this.getLetterData();

      var letterWholeWidth = this.width / this.maxLength;
      var letterWidth = (9 * letterWholeWidth) / 10;

      var xScale = d3
        .scaleLinear()
        .range([1, this.width])
        .domain([0, this.maxLength]);
      var yScale = d3
        .scaleLinear()
        .range([10, this.height])
        .domain([0, this.seqs.length]);

      var wholeHeight = this.height / this.seqs.length;

      let height = (9 * wholeHeight) / 10;

      a_letterData.forEach(letter => {
        context.beginPath();
        context.fillStyle = letter.color;
        context.rect(xScale(letter.x), yScale(letter.y), letterWidth, height);
        context.fill();
        context.closePath();
      });
    },
    mousemove(e) {
      if (drag) {
        const div = this.$refs["msa-overview"];
        this.$set(this.rect, "w", e.pageX - div.offsetLeft - this.rect.startX);
        this.$set(this.rect, "h", e.pageY - div.offsetTop - this.rect.startY);
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
      const div = this.$refs["msa-overview"];
      this.$set(this.rect, "startX", e.pageX - div.offsetLeft);
      this.$set(this.rect, "startY", e.pageY - div.offsetTop);
      drag = true;
    },
    drawSelection() {
      const canvas = this.$refs["msa-overview-selection"];
      let context = canvas.getContext("2d");

      this.clearSelection();
      context.setLineDash([6]);
      context.fillStyle = "rgba(206, 193, 225, 0.6)";
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
      const canvas = this.$refs["msa-overview-selection"];
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, this.width, this.height);
    }
  }
};
</script>

<style scoped>
.draw {
  position: absolute;
  left: 0%;
  top: 0%;
}
#msa-overview {
  position: relative;
}
</style>
