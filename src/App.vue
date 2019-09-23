<template>
  <div id="app">
    Number of sequences :
    <input v-model="nseq" type="input" min="2" max="1000" />
    <br />
    Alignment length :
    <input v-model="lseq" type="input" min="10" max="1000" />
    <br />
    <button @click="generateSequences">Generate Sequences</button>
    <br />
    <p>Predefined selection:{{ selection }}</p>
    <msa-overview :seqs="seqs" :selection="selection" />
  </div>
</template>

<script>
import { MsaOverview } from "./components";

export default {
  name: "App",
  components: {
    MsaOverview
  },
  data() {
    return {
      seqs: [],
      nseq: 10,
      lseq: 10,
      selection: { startSeq: 3, endSeq: 5, startPos: 2, endPos: 4 }
    };
  },
  created() {},
  methods: {
    generateSequences() {
      console.log("generate Sequences");

      var nSeqs = this.nseq;
      var l = this.lseq;

      var a_seqs = this.randomSequences(nSeqs, l);
      console.log({ seqs: a_seqs });

      this.seqs = a_seqs;
    },
    randomSequences(n, length) {
      var a_seqs = [];

      for (let i = 0; i < n; i++) {
        var seq = "";

        for (let j = 0; j < length; j++) {
          var letter = this.randomLetter();
          seq += letter;
        }

        a_seqs.push({
          seq: seq,
          name: "sequence" + i
        });
      }

      return a_seqs;
    },
    randomLetter() {
      var a_letters = ["A", "C", "G", "T", "."];

      return a_letters[Math.floor(Math.random() * a_letters.length)];
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
