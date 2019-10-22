<template>
  <div id="app">
    Number of sequences :
    <input v-model="nseq" type="input" min="2" max="1000" />
    <br />
    Alignment length :
    <input v-model="lseq" type="input" min="10" max="1000" />
    <br />
    Number of metadata
    <input v-model="nmetadata" type="input" min="0" max="5" />
    <br />
    Number of maximum metadata positions (start, end) to display
    <input v-model="npos" type="input" min="0" max="5" />
    <br />
    <button @click="generateSequences">Generate Sequences</button>
    <br />
    <p>Predefined selection:{{ selection }}</p>
    <p>New selection:{{ newSelection }}</p>
    <p v-if="hasMetadata">Metadata generated : {{ metadata }}</p>
    <msa-overview
      :seqs="seqs"
      :selection="selection"
      @select="setNewSelection"
    />
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
      nmetadata: 0,
      npos: 0,
      metadata: [],
      selection: { startSeq: 3, endSeq: 5, startPos: 2, endPos: 4 },
      newSelection: {}
    };
  },
  computed: {
    hasMetadata() {
      return this.metadata.length > 0;
    }
  },
  created() {},
  methods: {
    generateSequences() {
      console.log("generate Sequences");

      let nSeqs = this.nseq;
      let l = this.lseq;

      let a_seqs = this.randomSequences(nSeqs, l);
      console.log({ seqs: a_seqs });

      this.seqs = a_seqs;

      let a_metadatas = this.randomMetadata(
        this.nmetadata,
        this.lseq,
        this.npos
      );

      this.metadata = a_metadatas;
    },

    randomMetadata(n, lengthSequence, nPosMax) {
      let a_metadatas = [];

      for (let i = 0; i < n; i++) {
        let color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
        let label = `metadata${n}`;
        let a_pos = this.randomPositions(lengthSequence, nPosMax);

        a_pos.length > 0
          ? a_metadatas.push({ color: color, label: label, positions: a_pos })
          : a_metadatas.push({ color: color, label: label });
      }

      return a_metadatas;
    },

    randomPositions(lengthSequence, nMax) {
      let a_pos = [];

      let n = Math.floor(Math.random() * nMax);

      for (let i = 0; i < n; i++) {
        let start = Math.floor(Math.random() * lengthSequence);
        let nb = Math.floor(Math.random() * (lengthSequence - start));
        let end = start + nb;

        let pos = [start, end];

        a_pos.push(pos);
      }

      return a_pos;
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
    },

    setNewSelection(s) {
      this.newSelection = s;
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
