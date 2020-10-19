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

    <br />
    Color Styles
    <input v-model="style" type="radio" value="nt" checked />
    <input v-model="style" type="radio" value="aa" />

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
      :color-style="style"
      :metadata="metadata"
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
      nseq: 10,
      lseq: 10,
      nmetadata: 2,
      npos: 2,
      selection: { startSeq: 1, endSeq: 3, startPos: 2, endPos: 4 },
      newSelection: {},
      displayMetadata: true,
      displaySelection: true,
      displayLetters: true,
      displayTracks: true,
      displayScale: true,
      selectable: true,
      nTracks: 2,
      nFeatures: 1,
      style: "nt"
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
            positions: this.randomPositions(Number(this.lseq) + 1, 1),
            type: `feat${j}`,
            color: this.randomColor()
          };
          features.push(feature);
        }
        tracks.push({ trackLabel: `track${i}`, features: features });
      }
      return tracks;
    },
    metadata() {
      let categories = [];

      this.metadataCategories.forEach(c => {
        let regions = [];
        for (let index = 0; index < this.seqs.length; index++) {
          const seq = this.seqs[index];
          let region = {
            id: seq.id,
            ranges: this.randomPositions(this.nseq, this.npos)
          };
          regions.push(region);
        }
        const category = {
          label: c.label,
          style: { fill: c.color },
          regions: regions
        };
        categories.push(category);
      });

      let metadata = {};
      let metadatas = [];

      if (categories.length > 0) {
        metadata.categories = categories;
        metadatas.push(metadata);
      }

      return metadatas;
    },
    seqs() {
      let nSeqs = this.nseq;
      let l = this.lseq;

      let a_seqs = this.randomSequences(nSeqs, l);

      return a_seqs;
    }
  },
  methods: {
    randomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    generateSequences() {
      let nSeqs = this.nseq;
      let l = this.lseq;

      let a_seqs = this.randomSequences(nSeqs, l);

      this.seqs = a_seqs;
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

        a_seqs.push({
          seq: seq,
          id: "sequence" + i
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
.metadata {
  width: 100px;
  float: left;
  margin: 10px;
}

#msa-overview {
  margin: 50px auto 0px auto;
}
</style>
