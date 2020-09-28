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
    Number of tracks to display:
    <input v-model="nTracks" type="input" min="0" max="10" />
    <br />
    Max Number of features in tracks:
    <input v-model="nFeatures" type="input" min="0" max="3" />
    <br />
    <p>Predefined selection:{{ selection }}</p>
    <p>New selection:{{ newSelection }}</p>
    <div v-if="hasMetadata">
      <button
        v-for="cat in metadataCategories"
        :key="cat.label"
        class="metadata"
        :style="`background-color:${cat.color}`"
      >
        {{ cat.label }}
      </button>
    </div>

    <button @click="displayMetadata = !displayMetadata">Toggle metadata</button>
    <button @click="displaySelection = !displaySelection">
      Toggle selection
    </button>
    <button @click="displayLetters = !displayLetters">
      Toggle letter colors
    </button>

    <button @click="selectable = !selectable">
      Toggle selectable
    </button>

    <button @click="displayTracks = !displayTracks">
      Toggle tracks
    </button>

    <button @click="displayScale = !displayScale">
      Toggle scales
    </button>

    <msa-overview
      :display-letters-mask="displayLetters"
      :display-metadata-mask="displayMetadata"
      :display-selection-mask="displaySelection"
      :display-tracks="displayTracks"
      :display-scale="displayScale"
      :seqs="seqs"
      :selection="selection"
      :selectable="selectable"
      :tracks="tracks"
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
      seqs: [{ seq: "ACGTGAGCTA" }, { seq: "ATTTGAGCTA" }],
      nseq: 10,
      lseq: 10,
      nmetadata: 0,
      npos: 0,
      selection: { startSeq: 1, endSeq: 3, startPos: 2, endPos: 4 },
      newSelection: {},
      displayMetadata: true,
      displaySelection: true,
      displayLetters: true,
      displayTracks: true,
      displayScale: true,
      selectable: true,
      nTracks: 2,
      nFeatures: 1
    };
  },
  computed: {
    hasMetadata() {
      return this.metadataCategories.length > 0;
    },
    metadataCategories() {
      let a_cats = [];

      for (let i = 0; i < this.nmetadata; i++) {
        let color = this.randomColor();
        let label = `metadata${i}`;
        a_cats.push({ color: color, label: label });
      }

      return a_cats;
    },
    tracks() {
      let tracks = [];
      for (let i = 1; i <= this.nTracks; i++) {
        let features = [];
        for (let j = 1; j <= this.nFeatures; j++) {
          let feature = {
            positions: this.randomPositions(this.lseq + 1, 1),
            type: `track${i}-feat${j}`,
            color: this.randomColor()
          };
          features.push(feature);
        }
        tracks.push({ trackLabel: `track${i}`, features: features });
      }
      return tracks;
    }
  },
  methods: {
    randomColor() {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    },
    generateSequences() {
      let nSeqs = this.nseq;
      let l = this.lseq;

      let a_seqs = this.randomSequences(nSeqs, l);

      this.seqs = a_seqs;
    },

    randomMetadata(lengthSequence, nPosMax) {
      let a_metadatas = [];

      for (let i = 0; i < this.metadataCategories.length; i++) {
        let color = this.metadataCategories[i].color;
        let label = this.metadataCategories[i].label;
        let a_pos = this.randomPositions(lengthSequence, nPosMax);

        a_pos.length > 0
          ? a_metadatas.push({ color: color, label: label, positions: a_pos })
          : a_metadatas.push({ color: color, label: label });
      }

      return a_metadatas;
    },

    randomPositions(lengthSequence, nMax) {
      let a_pos = [];

      for (let i = 0; i < nMax; i++) {
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

        let a_metadatas = this.randomMetadata(this.lseq, this.npos);

        if (a_metadatas.length > 0) {
          a_seqs.push({
            metadata: a_metadatas,
            seq: seq,
            name: "sequence" + i
          });
        } else {
          a_seqs.push({
            seq: seq,
            name: "sequence" + i
          });
        }
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
.metadata {
  width: 100px;
  float: left;
  margin: 10px;
}

#msa-overview {
  margin: 50px auto 0px auto;
}
</style>
