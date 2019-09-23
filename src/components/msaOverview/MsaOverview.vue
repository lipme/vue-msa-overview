<template>
  <div id="msa-overview">
    <canvas id="msa-overview-canvas" :width="width" :height="height"> </canvas>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "MsaOverview",

  props: {
    seqs: {
      type: Array,
      default: () => {
        return [];
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
  watch: {
    seqs() {
      this.drawCustom();
    }
  },

  methods: {
    getMaxLength() {
      let a_lengths = this.seqs.map(seq => seq.seq.length);
      return d3.max(a_lengths);
    },

    getLetterData() {
      let a_letterData = [];

      this.seqs.forEach((seq, indexSeq) => {
        let a_letters = seq.split_seq;

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

    drawCustom() {
      const canvas = d3.select("#msa-overview-canvas");
      let context = canvas.node().getContext("2d");
      context.clearRect(0, 0, this.width, this.height);

      const maxLength = this.getMaxLength(this.seqs);

      let a_letterData = this.getLetterData(this.seqs);

      var letterWholeWidth = this.width / maxLength;
      var letterWidth = (9 * letterWholeWidth) / 10;

      var xScale = d3
        .scaleLinear()
        .range([1, this.width])
        .domain([1, maxLength]);
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
    }
  }
};
</script>

<style></style>
