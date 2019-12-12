import * as d3 from "d3";

export const maskMixin = {
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
        .domain([0, this.seqs.length]);
    },
    maxLength() {
      console.log("recompute length");
      let a_lengths = this.seqs.map(seq => seq.seq.length);
      return d3.max(a_lengths);
    }
  }
};
