<template>
  <canvas ref="canvas" class="draw" :width="width" :height="height"> </canvas>
</template>

<script>
import { maskMixin } from "@/mixins/maskMixin.js";

export default {
  name: "LettersMask",
  mixins: [maskMixin],

  props: {
    colorStyle: {
      type: String,
      default: "nucleotide"
    }
  },
  watch: {
    seqs() {
      this.drawAlignment();
    }
  },
  mounted() {
    this.drawAlignment();
  },
  updated() {
    this.drawAlignment();
  },
  methods: {
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
      const a_allColors = {
        nucleotide: {
          A: "green",
          C: "orange",
          G: "red",
          T: "steelblue",
          U: "steelblue",
          N: "white",
          ".": "white",
          "-": "white"
        }
      };

      const a_colors = a_allColors[this.colorStyle];

      if (!(letter in a_colors)) {
        return "white";
      }

      return a_colors[letter];
    },

    drawAlignment() {
      const canvas = this.$refs["canvas"];

      let context = canvas.getContext("2d");
      context.globalAlpha = 0.5;

      context.clearRect(0, 0, this.width, this.height);

      let a_letterData = this.getLetterData();

      var letterWidth = this.width / this.maxLength;

      let height = this.height / this.seqs.length;

      a_letterData.forEach(letter => {
        context.beginPath();
        context.fillStyle = letter.color;
        context.rect(
          this.xScale(letter.x),
          this.yScale(letter.y),
          letterWidth,
          height
        );
        context.fill();
        context.closePath();
      });
    }
  }
};
</script>
