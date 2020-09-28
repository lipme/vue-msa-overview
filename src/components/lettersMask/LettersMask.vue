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
      default: "nt"
    }
  },
  computed: {
    lettersData() {
      let a_letterData = [];

      this.seqs.forEach((seq, indexSeq) => {
        let a_letters = seq.seq.split("");

        a_letters.forEach((letter, index) => {
          let color = "white";
          if (letter in this.colors) {
            color = this.colors[letter];
          }

          a_letterData.push({
            x: index,
            y: indexSeq,
            color: color
          });
        });
      });

      return a_letterData;
    },
    colors() {
      const a_allColors = {
        nt: {
          A: "green",
          C: "orange",
          G: "red",
          T: "steelblue",
          U: "steelblue",
          N: "white",
          ".": "white",
          "-": "white"
        },
        // Clustal colors found in
        // http://www.jalview.org/help/html/colourSchemes/index.html
        aa: {
          A: "#80a0f0",
          R: "#f01505",
          N: "#00ff00",
          D: "#c048c0",
          C: "#f08080",
          Q: "#00ff00",
          E: "#c048c0",
          G: "#f09048",
          H: "#15a4a4",
          I: "#80a0f0",
          L: "#80a0f0",
          K: "#f01505",
          M: "#80a0f0",
          F: "#80a0f0",
          P: "#ffff00",
          S: "#00ff00",
          T: "#00ff00",
          W: "#80a0f0",
          Y: "#15a4a4",
          V: "#80a0f0",
          ".": "white",
          "-": "white",
          B: "grey",
          X: "grey",
          Z: "grey"
        }
      };

      return a_allColors[this.colorStyle];
    }
  },
  watch: {
    seqs() {
      this.drawAlignment();
    },
    colorStyle() {
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
    getColor(letter) {
      if (!(letter in this.colors)) {
        return "white";
      }

      return this.colors[letter];
    },

    drawAlignment() {
      const canvas = this.$refs["canvas"];

      let context = canvas.getContext("2d");
      context.globalAlpha = 0.5;

      context.clearRect(0, 0, this.width, this.height);

      let a_letterData = this.lettersData;

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
