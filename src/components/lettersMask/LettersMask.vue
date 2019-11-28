<template>
  <canvas ref="canvas" class="draw" :width="width" :height="height"> </canvas>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "LettersMask",

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
    colorStyle: {
      type: String,
      default: "nucleotide"
    }
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
          ".": "grey",
          "-": "grey"
        }
      };

      const a_colors = a_allColors[this.colorStyle];

      if (!(letter in a_colors)) {
        return "grey";
      }

      return a_colors[letter];
    },

    drawAlignment() {
      const canvas = this.$refs["canvas"];

      let context = canvas.getContext("2d");
      context.clearRect(0, 0, this.width, this.height);

      let a_letterData = this.getLetterData();

      var letterWidth = this.width / this.maxLength;
      var xScale = d3
        .scaleLinear()
        .range([1, this.width])
        .domain([0, this.maxLength]);
      var yScale = d3
        .scaleLinear()
        .range([10, this.height])
        .domain([0, this.seqs.length]);

      let height = this.height / this.seqs.length;

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

<style scoped>
.draw {
  position: absolute;
  left: 0%;
  top: 0%;
}
</style>
